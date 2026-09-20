import { describe, expect, it, afterAll, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMagicLinkToken } from "@/auth/token";

vi.mock("@/notifications/send", () => ({
  sendMagicLinkEmail: vi.fn().mockResolvedValue(undefined),
}));

const TEST_EMAIL = "verify-route-test@example.com";

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.legacySession.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.magicLinkToken.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

// Tests the DORMANT, unrouted magic-link verify route (kept per explicit
// instruction, not deleted) — auth is Google-only now (see auth/auth.ts).
describe("GET /api/auth/verify", () => {
  it("consumes a valid token, upserts the user, creates a legacy session, and redirects to /application", async () => {
    const { GET } = await import("@/app/api/auth/verify/route");
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);

    const request = new NextRequest(
      `http://localhost:3000/api/auth/verify?token=${rawToken}`,
    );
    const response = await GET(request);

    expect(response.status).toBe(307); // NextResponse.redirect default
    expect(response.headers.get("location")).toContain("/application");

    const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
    expect(user).not.toBeNull();

    const sessionCount = await prisma.legacySession.count({ where: { userId: user!.id } });
    expect(sessionCount).toBe(1);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("np_session=");
  });

  it("redirects to /login with an error when the token is invalid", async () => {
    const { GET } = await import("@/app/api/auth/verify/route");
    const request = new NextRequest(
      "http://localhost:3000/api/auth/verify?token=not-a-real-token",
    );
    const response = await GET(request);
    expect(response.headers.get("location")).toContain("/login?error=not_found");
  });
});
