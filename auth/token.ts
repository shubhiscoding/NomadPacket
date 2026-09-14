import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Magic-link token expiry. No spec value given — 15 minutes is a common,
 * reasonable default (long enough to find the email, short enough that a
 * leaked/forwarded link expires quickly). Explicit assumption, not a
 * config-driven legal figure, so this stays a code constant.
 */
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Creates a new single-use magic-link token for `email`. Only the SHA-256
 * hash is persisted — the raw token (embedded in the emailed URL) never
 * touches the database, so a DB read alone can never yield a usable
 * sign-in link.
 */
export async function createMagicLinkToken(
  email: string,
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);

  await prisma.magicLinkToken.create({
    data: { email, tokenHash, expiresAt },
  });

  return { rawToken, expiresAt };
}

export type ConsumeMagicLinkResult =
  | { ok: true; email: string }
  | { ok: false; reason: "not_found" | "expired" | "already_used" };

/**
 * Verifies and single-use-consumes a raw token from an incoming magic-link
 * URL. Marks `consumedAt` on success so the same link can't be replayed.
 */
export async function consumeMagicLinkToken(
  rawToken: string,
): Promise<ConsumeMagicLinkResult> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.magicLinkToken.findUnique({ where: { tokenHash } });

  if (!record) return { ok: false, reason: "not_found" };
  if (record.consumedAt) return { ok: false, reason: "already_used" };
  if (record.expiresAt < new Date()) return { ok: false, reason: "expired" };

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return { ok: true, email: record.email };
}
