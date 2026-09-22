import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Matches auth/auth.ts's session config (no override there) and Auth.js's own default. */
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Creates a real Auth.js database session directly — not a parallel
 * session system. Auth.js only knows how to start a session through one
 * of its own providers (`signIn()`), which the magic-link flow can't call
 * into since it isn't an OAuth/Credentials round-trip; this bypasses that
 * by writing the exact same row shape and cookie Auth.js's own database
 * session strategy expects (see auth/auth.ts's `session: { strategy:
 * "database" }`), verified against @auth/core's own defaults
 * (lib/utils/cookie.js's `defaultCookies`, lib/init.js's `maxAge`) rather
 * than guessed. `getCurrentUser()` (every protected route's one sanctioned
 * auth check) reads this exact table/cookie via Auth.js's `auth()` — so a
 * session created here is indistinguishable from one Google sign-in
 * created, which is the point: the same email should work through
 * either method, sharing one account.
 *
 * `isSecureRequest` should be `request.nextUrl.protocol === "https:"` —
 * Auth.js only uses the `__Secure-` cookie prefix (and marks it Secure)
 * over https, never on http://localhost, so this must match per-request
 * rather than being a fixed NODE_ENV check.
 */
export async function createSessionForUser(
  userId: string,
  isSecureRequest: boolean,
): Promise<{ cookieName: string; cookieValue: string; expires: Date; secure: boolean }> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  return {
    cookieName: `${isSecureRequest ? "__Secure-" : ""}authjs.session-token`,
    cookieValue: sessionToken,
    expires,
    secure: isSecureRequest,
  };
}
