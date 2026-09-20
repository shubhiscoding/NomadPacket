import { NextResponse } from "next/server";
import { auth } from "@/auth/auth";

/**
 * Protects everything under /application — unauthenticated visitors are
 * bounced to /signin (which itself bounces to /start if the qualifier-gate
 * context is missing/expired, per AGENTS.md build order: gate, then auth,
 * then the real product). Auth is Google-only via Auth.js v5 — auth()
 * reads the database-backed session itself, no manual cookie lookup here.
 *
 * Named `proxy` per Next.js 16's renamed convention (formerly
 * `middleware`) — same API, same file-based routing hook.
 */
export default auth((request) => {
  if (!request.auth) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
});

// No `runtime` config here — Proxy (Next.js 16's renamed middleware) always
// runs on Node.js, which is what we need for Prisma's client anyway.
export const config = {
  matcher: ["/application/:path*"],
};
