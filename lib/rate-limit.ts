import { prisma } from "@/lib/prisma";

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the oldest in-window attempt expires, or null if not blocked. */
  retryAfterMs: number | null;
}

/**
 * Single sliding-window rate limiter backing every rate-limited action in
 * the app (magic-link requests, packet-emails, document regeneration) —
 * one mechanism, different keys/windows per caller, rather than one-off
 * counters per feature. DB-backed (RateLimitEvent) since this app has no
 * Redis/Upstash in its stack and serverless functions can't hold reliable
 * in-memory state across requests.
 *
 * A sliding window (count attempts within the last `windowMs`, keyed by an
 * arbitrary caller-defined string) rather than a fixed reset-at-midnight
 * window: it self-resets exactly `windowMs` after the oldest attempt in
 * the window, with no separate "cooldown until" timestamp to track.
 */
async function countInWindow(key: string, windowMs: number): Promise<{ count: number; oldest: Date | null }> {
  const since = new Date(Date.now() - windowMs);
  const events = await prisma.rateLimitEvent.findMany({
    where: { key, createdAt: { gt: since } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });
  return { count: events.length, oldest: events[0]?.createdAt ?? null };
}

function toResult(count: number, oldest: Date | null, opts: RateLimitOptions): RateLimitResult {
  const allowed = count < opts.max;
  const remaining = Math.max(0, opts.max - count);
  const retryAfterMs = allowed || !oldest ? null : oldest.getTime() + opts.windowMs - Date.now();
  return { allowed, remaining, retryAfterMs };
}

/**
 * Read-only: how many attempts remain right now, without recording one.
 * Use this to show a "N left" notice proactively (e.g. on page load)
 * without the act of checking itself counting as an attempt.
 */
export async function checkRateLimit(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const { count, oldest } = await countInWindow(key, opts.windowMs);
  return toResult(count, oldest, opts);
}

/**
 * Records an attempt if under the limit. Callers must use this (not
 * checkRateLimit) at the point they actually perform the limited action —
 * calling checkRateLimit alone would let unlimited attempts through since
 * nothing would ever get recorded.
 */
export async function consumeRateLimit(key: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const { count, oldest } = await countInWindow(key, opts.windowMs);
  const result = toResult(count, oldest, opts);
  if (result.allowed) {
    await prisma.rateLimitEvent.create({ data: { key } });
    // One fewer than computed pre-insert, since this attempt just consumed one.
    return { ...result, remaining: result.remaining - 1 };
  }
  return result;
}

/** Rounds up to a whole minute for user-facing "try again in N minutes" copy. */
export function retryAfterMinutes(retryAfterMs: number | null): number {
  return Math.max(1, Math.ceil((retryAfterMs ?? 0) / 60_000));
}
