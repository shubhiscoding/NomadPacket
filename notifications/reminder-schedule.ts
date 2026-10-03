// Flow A (Awaiting Payment): 4 emails at these delays
export const FLOW_A_DELAYS_MS = [
  3 * 60 * 60 * 1000, // Email 1: 3 hours
  24 * 60 * 60 * 1000, // Email 2: 24 hours
  2.5 * 24 * 60 * 60 * 1000, // Email 3: 60 hours (2.5 days)
  7 * 24 * 60 * 60 * 1000, // Email 4: 7 days (hard cap)
];

// Flow B (Incomplete): 2 emails at these delays
export const FLOW_B_DELAYS_MS = [
  3 * 60 * 60 * 1000, // Email 1: 3 hours
  48 * 60 * 60 * 1000, // Email 2: 48 hours
];

export const REMINDER_CUTOFF_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Determines which email in a sequence should be sent, if any.
 * Returns the email number (1, 2, 3, or 4) to send, or null if none qualifies.
 *
 * `updatedAt`: application's last-activity timestamp (Application.updatedAt).
 * `lastEmailNumber`: the last email sent for this flow (null if none sent yet).
 * `lastEmailSentAt`: sentAt of that last email (null if none sent yet).
 * `now`: injected clock for testability.
 * `delays`: array of delays in ms for this flow's email sequence.
 */
export function getNextEmailNumber(params: {
  updatedAt: Date;
  lastEmailNumber: number | null;
  lastEmailSentAt: Date | null;
  now: Date;
  delays: number[];
}): number | null {
  const { updatedAt, lastEmailNumber, lastEmailSentAt, now, delays } = params;
  const inactiveMs = now.getTime() - updatedAt.getTime();

  // Hard cap: once inactive for more than 7 days, never send again.
  if (inactiveMs > REMINDER_CUTOFF_MS) return null;

  if (lastEmailNumber === null) {
    // First email: check if first delay has passed.
    return inactiveMs >= delays[0] ? 1 : null;
  }

  // Already sent email N, check if we should send email N+1.
  if (lastEmailNumber >= delays.length) {
    // Already sent all emails in the sequence.
    return null;
  }

  const sinceLastSentMs = now.getTime() - lastEmailSentAt!.getTime();
  const nextEmailDelay = delays[lastEmailNumber];

  // Send the next email if enough time has passed since the last one.
  return sinceLastSentMs >= nextEmailDelay ? lastEmailNumber + 1 : null;
}
