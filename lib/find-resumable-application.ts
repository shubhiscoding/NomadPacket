import { prisma } from "@/lib/prisma";
import type { Application } from "@prisma/client";

/**
 * The one application a returning user should resume, or null if they
 * have none (or their only ones are already PAID — a paid application is
 * done, not resumable, so the caller should start a fresh one instead of
 * being sent back into an already-purchased questionnaire).
 *
 * `not: "PAID"` rather than an explicit allow-list of the other statuses:
 * an abandoned AWAITING_PAYMENT application should still be resumed
 * indefinitely (matches checkout re-issuing a session instead of
 * double-charging), and any status added later defaults to resumable
 * unless it's specifically PAID.
 */
export function findResumableApplication(userId: string): Promise<Application | null> {
  return prisma.application.findFirst({
    where: { userId, status: { not: "PAID" } },
    orderBy: { createdAt: "desc" },
  });
}
