import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "np_session";

/**
 * Rolling session lifetime. No spec value given — 30 days is a common,
 * reasonable default for a low-risk (no passwords) consumer product.
 * Explicit assumption.
 */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Pure DB write — creates a Session row for `userId`. Deliberately does NOT
 * touch cookies: `next/headers`' `cookies()` only works inside Next's real
 * request lifecycle, so callers (route handlers) set the returned token on
 * the NextResponse themselves, exactly like lib/gate-context.ts's cookie is
 * set in app/api/qualifier/route.ts. This also makes session creation
 * directly unit-testable.
 */
export async function createSessionRecord(
  userId: string,
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { userId, token: tokenHash, expiresAt },
  });

  return { rawToken, expiresAt };
}

/** Pure DB read — resolves the User for a raw session token, or null. */
export async function getSessionUserByToken(
  rawToken: string | undefined,
): Promise<User | null> {
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { token: tokenHash },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.user;
}

/** Pure DB delete — removes the Session row for a raw token, if any. */
export async function destroySessionByToken(rawToken: string | undefined): Promise<void> {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await prisma.session.deleteMany({ where: { token: tokenHash } });
}

/**
 * Convenience wrapper for Server Components, which have no NextRequest to
 * read cookies from — only `next/headers` works there. Not used by route
 * handlers or middleware, which read `request.cookies` directly.
 */
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  return getSessionUserByToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
