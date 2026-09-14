import { describe, expect, it, afterAll } from "vitest";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createMagicLinkToken, consumeMagicLinkToken } from "@/auth/token";

const TEST_EMAIL = "token-test@example.com";

afterAll(async () => {
  await prisma.magicLinkToken.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe("magic-link token lifecycle", () => {
  it("issues a token whose hash (not the raw value) is stored", async () => {
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);
    const rows = await prisma.magicLinkToken.findMany({ where: { email: TEST_EMAIL } });
    const latest = rows[rows.length - 1];
    expect(latest.tokenHash).not.toBe(rawToken);
    expect(latest.tokenHash).toHaveLength(64); // sha256 hex
  });

  it("consumes a valid token successfully", async () => {
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);
    const result = await consumeMagicLinkToken(rawToken);
    expect(result).toEqual({ ok: true, email: TEST_EMAIL });
  });

  it("rejects re-use of an already-consumed token (single-use)", async () => {
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);
    const first = await consumeMagicLinkToken(rawToken);
    expect(first.ok).toBe(true);

    const second = await consumeMagicLinkToken(rawToken);
    expect(second).toEqual({ ok: false, reason: "already_used" });
  });

  it("rejects an unknown token", async () => {
    const result = await consumeMagicLinkToken("not-a-real-token");
    expect(result).toEqual({ ok: false, reason: "not_found" });
  });

  it("rejects an expired token", async () => {
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);
    // Simulate expiry by backdating the row directly.
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await prisma.magicLinkToken.update({
      where: { tokenHash },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const result = await consumeMagicLinkToken(rawToken);
    expect(result).toEqual({ ok: false, reason: "expired" });
  });
});
