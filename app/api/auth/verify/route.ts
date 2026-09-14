import { NextRequest, NextResponse } from "next/server";
import { consumeMagicLinkToken } from "@/auth/token";
import { createSessionRecord, SESSION_COOKIE_NAME } from "@/auth/session";
import { prisma } from "@/lib/prisma";

/**
 * Consumes a magic-link token from the emailed URL: verifies + single-use
 * marks it, upserts the User by email, creates a Session, sets the session
 * cookie, and redirects into the app. /application is responsible for
 * either creating a new Application (from the gate-context cookie set on
 * /start) or resuming an existing one — this route only establishes
 * identity.
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

  const { rawToken, expiresAt } = await createSessionRecord(user.id);

  const response = NextResponse.redirect(new URL("/application", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}
