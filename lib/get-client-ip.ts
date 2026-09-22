import type { NextRequest } from "next/server";

/**
 * Best-effort client IP for rate-limiting unauthenticated requests (e.g.
 * magic-link, where there's no user/applicationId yet to key on). Vercel
 * sets x-forwarded-for; falls back to a constant so a missing header
 * degrades to "everyone without one shares a bucket" rather than crashing.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
