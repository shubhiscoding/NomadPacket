import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import {
  getNextEmailNumber,
  FLOW_A_DELAYS_MS,
  FLOW_B_DELAYS_MS,
  REMINDER_CUTOFF_MS,
} from "@/notifications/reminder-schedule";
import { sendFlowAReminder, sendFlowBReminder } from "@/notifications/send";
import type { Answers } from "@/questionnaire-engine/types";
import type { ReminderFlow } from "@prisma/client";

/**
 * Daily cron job (9 AM UTC) that sends multi-email reminder sequences to
 * applications stuck in DRAFT (incomplete, Flow B: 2 emails) or
 * QUESTIONNAIRE_COMPLETE/AWAITING_PAYMENT (complete but unpaid, Flow A: 4
 * emails). Each flow has its own sequence at different delays.
 *
 * Timing note: Vercel Hobby accounts allow only once-daily crons. This means
 * emails may arrive up to ~24 hours after the scheduled delay (e.g., the 3-hour
 * email might arrive at 3-27 hours). This is acceptable since users expect
 * follow-ups within a few days, not minute-perfect timing. The getNextEmailNumber()
 * logic compares elapsed time since updatedAt, so it's robust to variable
 * cron execution times.
 *
 * Email sequence:
 * - Flow A: 3h, 24h, 60h, 7d (4 emails for awaiting payment)
 * - Flow B: 3h, 48h (2 emails for incomplete)
 *
 * Respects 7-day inactivity cap (no reminders after 7 days). Tracks which
 * email was sent in ApplicationReminder rows (separate from Application to
 * avoid resetting the inactivity clock).
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
    flowASent: 0,
    flowBSent: 0,
    failed: 0,
  };

  // Flow A: QUESTIONNAIRE_COMPLETE + AWAITING_PAYMENT (4-email sequence)
  await runFlow({
    flow: "AWAITING_PAYMENT",
    statuses: ["QUESTIONNAIRE_COMPLETE", "AWAITING_PAYMENT"],
    delays: FLOW_A_DELAYS_MS,
    send: sendFlowAReminder,
    counterKey: "flowASent",
  });

  // Flow B: DRAFT (2-email sequence)
  await runFlow({
    flow: "INCOMPLETE",
    statuses: ["DRAFT"],
    delays: FLOW_B_DELAYS_MS,
    send: sendFlowBReminder,
    counterKey: "flowBSent",
  });

  return NextResponse.json(summary);

  async function runFlow(opts: {
    flow: ReminderFlow;
    statuses: ("DRAFT" | "QUESTIONNAIRE_COMPLETE" | "AWAITING_PAYMENT")[];
    delays: number[];
    send: (p: { to: string; name: string; checklistUrl: string; emailNumber: number }) => Promise<void>;
    counterKey: "flowASent" | "flowBSent";
  }) {
    const candidates = await prisma.application.findMany({
      where: { status: { in: opts.statuses }, updatedAt: { gte: cutoff } },
      include: { user: { select: { email: true, name: true } } },
    });
    if (candidates.length === 0) return;

    const priorReminders = await prisma.applicationReminder.findMany({
      where: { flow: opts.flow, applicationId: { in: candidates.map((c) => c.id) } },
      orderBy: { sentAt: "desc" },
      select: { applicationId: true, emailNumber: true, sentAt: true },
    });
    const lastReminderByApp = new Map<
      string,
      { emailNumber: number; sentAt: Date }
    >();
    for (const r of priorReminders) {
      if (!lastReminderByApp.has(r.applicationId)) {
        lastReminderByApp.set(r.applicationId, {
          emailNumber: r.emailNumber,
          sentAt: r.sentAt,
        });
      }
    }

    for (const app of candidates) {
      const lastReminder = lastReminderByApp.get(app.id) ?? null;
      const nextEmailNumber = getNextEmailNumber({
        updatedAt: app.updatedAt,
        lastEmailNumber: lastReminder?.emailNumber ?? null,
        lastEmailSentAt: lastReminder?.sentAt ?? null,
        now,
        delays: opts.delays,
      });

      if (nextEmailNumber === null) continue;

      const answers = app.answers as Answers;
      const name = app.user.name ?? (answers.fullLegalName as string | undefined) ?? "there";
      const checklistUrl = `${siteUrl}/application/${app.id}/checklist`;

      try {
        await opts.send({
          to: app.user.email,
          name,
          checklistUrl,
          emailNumber: nextEmailNumber,
        });
        await prisma.applicationReminder.create({
          data: {
            applicationId: app.id,
            flow: opts.flow,
            emailNumber: nextEmailNumber,
          },
        });
        summary[opts.counterKey]++;
      } catch (err) {
        console.error(
          `Failed to send ${opts.flow} email ${nextEmailNumber} for application ${app.id}:`,
          err
        );
        summary.failed++;
      }
    }
  }
}
