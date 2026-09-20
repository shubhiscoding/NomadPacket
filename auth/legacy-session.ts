/**
 * ⚠️ DORMANT, UNROUTED — kept per explicit instruction, not deleted.
 *
 * This was the custom magic-link session system (auth/token.ts issues the
 * token, this file manages the resulting cookie session). It's no longer
 * wired into any route — auth is Google-only via Auth.js v5 now (see
 * auth/auth.ts, proxy.ts, and every route's `auth()` call). Nothing in the
 * app currently imports from this file. The Prisma model backing it was
 * renamed Session -> LegacySession (see prisma/schema.prisma) because
 * Auth.js's Prisma adapter requires the name `Session` for its own,
 * differently-shaped model — two models can't share one Prisma name, so
 * this one moved rather than the newly-active one.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export const LEGACY_SESSION_COOKIE_NAME = "np_session";

/** Rolling session lifetime — same 30-day assumption as before. */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function createLegacySessionRecord(
  userId: string,
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.legacySession.create({
    data: { userId, token: tokenHash, expiresAt },
  });

  return { rawToken, expiresAt };
}

export async function getLegacySessionUserByToken(
  rawToken: string | undefined,
): Promise<User | null> {
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);
  const session = await prisma.legacySession.findUnique({
    where: { token: tokenHash },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.user;
}

export async function destroyLegacySessionByToken(rawToken: string | undefined): Promise<void> {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await prisma.legacySession.deleteMany({ where: { token: tokenHash } });
}

export async function getLegacySessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  return getLegacySessionUserByToken(cookieStore.get(LEGACY_SESSION_COOKIE_NAME)?.value);
}

export async function getLegacySessionUserFromRequest(
  request: NextRequest,
): Promise<User | null> {
  return getLegacySessionUserByToken(request.cookies.get(LEGACY_SESSION_COOKIE_NAME)?.value);
}
