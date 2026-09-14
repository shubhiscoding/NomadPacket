import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getSessionUserByToken } from "@/auth/session";

/**
 * Protects everything under /application — unauthenticated visitors are
 * bounced to /login (which itself bounces to /start if the qualifier-gate
 * context is missing/expired, per AGENTS.md build order: gate, then auth,
 * then the real product).
 *
 * Named `proxy` per Next.js 16's renamed convention (formerly
 * `middleware`) — same API, same file-based routing hook.
 */
export async function proxy(request: NextRequest) {
  const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getSessionUserByToken(rawToken);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// No `runtime` config here — Proxy (Next.js 16's renamed middleware) always
// runs on Node.js, which is what we need for Prisma's client anyway.
export const config = {
  matcher: ["/application/:path*"],
};
