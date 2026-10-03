import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import { shouldSendReminder, REMINDER_CUTOFF_MS } from "@/notifications/reminder-schedule";
import {
  sendAwaitingPaymentReminderEmail,
  sendIncompleteApplicationReminderEmail,
} from "@/notifications/send";
import type { Answers } from "@/questionnaire-engine/types";
import type { ReminderFlow } from "@prisma/client";

/**
 * Hourly cron job that sends reminder emails to applications stuck in
 * DRAFT (incomplete) or QUESTIONNAIRE_COMPLETE/AWAITING_PAYMENT (complete but
 * unpaid) states. Respects a 7-day inactivity cap per flow (if no activity for
 * 7+ days, reminders stop). Tracks reminders sent in ApplicationReminder rows
 * (separate from Application to avoid resetting the inactivity clock).
 */
export async function GET(request: NextRequest) {
  const cronSecret = getEnv().CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() - REMINDER_CUTOFF_MS);
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;

  const summary = {
    awaitingPaymentSent: 0,
    incompleteSent: 0,
    failed: 0,
  };

  // Flow A: QUESTIONNAIRE_COMPLETE + AWAITING_PAYMENT
  await runFlow({
    flow: "AWAITING_PAYMENT",
    statuses: ["QUESTIONNAIRE_COMPLETE", "AWAITING_PAYMENT"],
    send: sendAwaitingPaymentReminderEmail,
    counterKey: "awaitingPaymentSent",
  });

  // Flow B: DRAFT (incomplete)
  await runFlow({
    flow: "INCOMPLETE",
    statuses: ["DRAFT"],
    send: sendIncompleteApplicationReminderEmail,
    counterKey: "incompleteSent",
  });

  return NextResponse.json(summary);

  async function runFlow(opts: {
    flow: ReminderFlow;
    statuses: ("DRAFT" | "QUESTIONNAIRE_COMPLETE" | "AWAITING_PAYMENT")[];
    send: (p: { to: string; name: string; checklistUrl: string }) => Promise<void>;
    counterKey: "awaitingPaymentSent" | "incompleteSent";
  }) {
    const candidates = await prisma.application.findMany({
      where: { status: { in: opts.statuses }, updatedAt: { gte: cutoff } },
      include: { user: { select: { email: true, name: true } } },
    });
    if (candidates.length === 0) return;

    const priorReminders = await prisma.applicationReminder.findMany({
      where: { flow: opts.flow, applicationId: { in: candidates.map((c) => c.id) } },
      orderBy: { sentAt: "desc" },
      select: { applicationId: true, sentAt: true },
    });
    const lastSentByApp = new Map<string, Date>();
    for (const r of priorReminders) {
      if (!lastSentByApp.has(r.applicationId)) lastSentByApp.set(r.applicationId, r.sentAt);
    }

    for (const app of candidates) {
      const lastReminderAt = lastSentByApp.get(app.id) ?? null;
      if (!shouldSendReminder({ updatedAt: app.updatedAt, lastReminderAt, now })) continue;

      const answers = app.answers as Answers;
      const name = app.user.name ?? (answers.fullLegalName as string | undefined) ?? "there";
      const checklistUrl = `${siteUrl}/application/${app.id}/checklist`;

      try {
        await opts.send({ to: app.user.email, name, checklistUrl });
        await prisma.applicationReminder.create({
          data: { applicationId: app.id, flow: opts.flow },
        });
        summary[opts.counterKey]++;
      } catch (err) {
        console.error(`Failed to send ${opts.flow} reminder for application ${app.id}:`, err);
        summary.failed++;
      }
    }
  }
}
