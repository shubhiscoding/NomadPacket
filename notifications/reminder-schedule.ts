export const FIRST_REMINDER_DELAY_MS = 60 * 60 * 1000; // 1 hour
export const REMINDER_CADENCE_MS = 24 * 60 * 60 * 1000; // 24 hours
export const REMINDER_CUTOFF_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Pure decision function for whether a reminder should be sent right now.
 * No Prisma, no Date.now() internally — every input is passed in so this
 * is trivially testable with fixed fake "now" values.
 *
 * `updatedAt`: the application's last-activity timestamp (Application.updatedAt).
 * `lastReminderAt`: sentAt of the most recent ApplicationReminder row for
 *   this application+flow, or null if none has ever been sent.
 * `now`: injected clock, so tests never depend on wall-clock time.
 */
export function shouldSendReminder(params: {
  updatedAt: Date;
  lastReminderAt: Date | null;
  now: Date;
}): boolean {
  const { updatedAt, lastReminderAt, now } = params;
  const inactiveMs = now.getTime() - updatedAt.getTime();

  // Hard cap: once inactive for more than 7 days, never send again,
  // regardless of reminder history.
  if (inactiveMs > REMINDER_CUTOFF_MS) return false;

  if (lastReminderAt === null) {
    // First reminder: fires once at least 1hr of inactivity has passed.
    return inactiveMs >= FIRST_REMINDER_DELAY_MS;
  }

  // Subsequent reminder: fires once 24h have passed since the last one.
  const sinceLastReminderMs = now.getTime() - lastReminderAt.getTime();
  return sinceLastReminderMs >= REMINDER_CADENCE_MS;
}
