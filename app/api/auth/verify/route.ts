import { NextRequest, NextResponse } from "next/server";
import { consumeMagicLinkToken } from "@/auth/token";
import { createLegacySessionRecord, LEGACY_SESSION_COOKIE_NAME } from "@/auth/legacy-session";
import { prisma } from "@/lib/prisma";

/**
 * ⚠️ DORMANT, UNROUTED — nothing links here anymore (auth/auth.ts +
 * /signin is the active Google-only sign-in flow). Kept per explicit
 * instruction rather than deleted; updated to the renamed
 * auth/legacy-session.ts exports so it still compiles, not left dangling.
 *
 * Consumes a magic-link token from the emailed URL: verifies + single-use
 * marks it, upserts the User by email, creates a LegacySession, sets the
 * session cookie, and redirects into the app.
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

  const { rawToken, expiresAt } = await createLegacySessionRecord(user.id);

  const response = NextResponse.redirect(new URL("/application", request.url));
  response.cookies.set(LEGACY_SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}
