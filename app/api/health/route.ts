import { NextResponse } from "next/server";

/**
 * Liveness check for local dev / deploy target smoke tests. Deliberately
 * does not touch the database or any third-party API — this only confirms
 * the Next.js server itself is up. DB/config health can be added once
 * Prisma is wired (Milestone 2).
 */
export function GET() {
  return NextResponse.json({ status: "ok", service: "nomadpacket" });
}
