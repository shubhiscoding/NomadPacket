import { NextRequest, NextResponse } from "next/server";
import { consumeMagicLinkToken } from "@/auth/token";
import { createSessionForUser } from "@/auth/create-session";
import { prisma } from "@/lib/prisma";

/**
 * Consumes a magic-link token from the emailed URL: verifies + single-use
 * marks it, upserts the User by email, and creates a real Auth.js
 * database session (see auth/create-session.ts) — not the old
 * LegacySession/np_session cookie, which `getCurrentUser()` never reads.
 * That mismatch meant magic-link sign-in used to redirect into the app
 * while silently not actually authenticating anywhere: every protected
 * route (proxy.ts, checklist pages, etc.) only ever checks the Auth.js
 * session, and a magic-link "login" set a cookie nothing there looked at.
 *
 * Sharing Auth.js's own session table/cookie with the Google sign-in path
 * is what makes the two methods genuinely interchangeable for the same
 * email/User row — sign in with Google once, sign in with a magic link
 * next time, same account either way.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }

  const result = await consumeMagicLinkToken(token);
  if (!result.ok) {
    return NextResponse.redirect(
      new URL(`/login?error=${result.reason}`, request.url),
    );
  }

  const user = await prisma.user.upsert({
    where: { email: result.email },
    create: { email: result.email },
    update: {},
  });

  const isSecureRequest = request.nextUrl.protocol === "https:";
  const session = await createSessionForUser(user.id, isSecureRequest);

  const response = NextResponse.redirect(new URL("/application", request.url));
  response.cookies.set(session.cookieName, session.cookieValue, {
    httpOnly: true,
    secure: session.secure,
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });
  return response;
}
