import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getSessionUserByToken } from "@/auth/session";

/**
 * Protects everything under /application — unauthenticated visitors are
 * bounced to /login (which itself bounces to /start if the qualifier-gate
 * context is missing/expired, per AGENTS.md build order: gate, then auth,
 * then the real product).
 */
export async function middleware(request: NextRequest) {
  const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getSessionUserByToken(rawToken);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/application/:path*"],
  // Prisma's Node engine doesn't run on the Edge runtime — force Node.js so
  // getSessionUserByToken's DB call works without a driver adapter.
  runtime: "nodejs",
};
