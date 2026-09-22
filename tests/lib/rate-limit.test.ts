import { describe, expect, it, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, consumeRateLimit, retryAfterMinutes } from "@/lib/rate-limit";

const KEY_PREFIX = "rate-limit-test:";

afterAll(async () => {
  await prisma.rateLimitEvent.deleteMany({ where: { key: { startsWith: KEY_PREFIX } } });
  await prisma.$disconnect();
});

describe("checkRateLimit / consumeRateLimit", () => {
  it("allows up to max attempts, then blocks the next one", async () => {
    const key = `${KEY_PREFIX}basic-${Date.now()}`;
    const opts = { max: 3, windowMs: 60_000 };

    const first = await consumeRateLimit(key, opts);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = await consumeRateLimit(key, opts);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = await consumeRateLimit(key, opts);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = await consumeRateLimit(key, opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
    expect(fourth.retryAfterMs).not.toBeNull();
  });

  it("checkRateLimit does not itself consume an attempt", async () => {
    const key = `${KEY_PREFIX}readonly-${Date.now()}`;
    const opts = { max: 1, windowMs: 60_000 };

    const peekedBefore = await checkRateLimit(key, opts);
    expect(peekedBefore.allowed).toBe(true);
    expect(peekedBefore.remaining).toBe(1);

    // Peeking again should show the exact same state — checkRateLimit
    // must never write a row.
    const peekedAgain = await checkRateLimit(key, opts);
    expect(peekedAgain.remaining).toBe(1);

    const consumed = await consumeRateLimit(key, opts);
    expect(consumed.allowed).toBe(true);
    expect(consumed.remaining).toBe(0);

    const blocked = await consumeRateLimit(key, opts);
    expect(blocked.allowed).toBe(false);
  });

  it("resets once the window passes — a backdated attempt outside the window doesn't count", async () => {
    const key = `${KEY_PREFIX}window-${Date.now()}`;
    const opts = { max: 1, windowMs: 60_000 };

    // Simulate an attempt from 2 minutes ago (outside the 1-minute window)
    // by backdating createdAt directly, rather than sleeping in a test.
    await prisma.rateLimitEvent.create({
      data: { key, createdAt: new Date(Date.now() - 2 * 60_000) },
    });

    const result = await consumeRateLimit(key, opts);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("computes an accurate retryAfterMs based on the oldest in-window attempt", async () => {
    const key = `${KEY_PREFIX}retry-after-${Date.now()}`;
    const opts = { max: 1, windowMs: 60_000 };

    // Backdate the one existing attempt to 40 seconds ago — 20 seconds
    // remain in its window.
    await prisma.rateLimitEvent.create({
      data: { key, createdAt: new Date(Date.now() - 40_000) },
    });

    const result = await checkRateLimit(key, opts);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).not.toBeNull();
    expect(result.retryAfterMs!).toBeGreaterThan(15_000);
    expect(result.retryAfterMs!).toBeLessThanOrEqual(20_000);
  });
});

describe("retryAfterMinutes", () => {
  it("rounds up to a whole minute, and never reports zero", () => {
    expect(retryAfterMinutes(1)).toBe(1);
    expect(retryAfterMinutes(30_000)).toBe(1);
    expect(retryAfterMinutes(61_000)).toBe(2);
    expect(retryAfterMinutes(null)).toBe(1);
  });
});
