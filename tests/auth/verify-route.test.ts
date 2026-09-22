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
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.magicLinkToken.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe("GET /api/auth/verify", () => {
  it("consumes a valid token, upserts the user, and creates a real Auth.js database session", async () => {
    // Regression test: this used to create a LegacySession/np_session
    // cookie that getCurrentUser() (every protected route's auth check)
    // never reads — magic-link "login" redirected into the app while
    // silently not authenticating anywhere. It must create the same
    // Session row/cookie Google sign-in does, so the two methods are
    // genuinely interchangeable for the same email.
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

    const sessions = await prisma.session.findMany({ where: { userId: user!.id } });
    expect(sessions).toHaveLength(1);
    expect(sessions[0].expires.getTime()).toBeGreaterThan(Date.now());

    const setCookie = response.headers.get("set-cookie");
    // http:// request in this test, so no __Secure- prefix — see
    // auth/create-session.ts's isSecureRequest handling.
    expect(setCookie).toContain(`authjs.session-token=${sessions[0].sessionToken}`);
  });

  it("uses the __Secure- cookie prefix for an https request", async () => {
    const { GET } = await import("@/app/api/auth/verify/route");
    const { rawToken } = await createMagicLinkToken(TEST_EMAIL);

    const request = new NextRequest(
      `https://nomadpacket.app/api/auth/verify?token=${rawToken}`,
    );
    const response = await GET(request);

    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("__Secure-authjs.session-token=");
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
