import { describe, expect, it, afterAll, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGateContextCookieValue, GATE_CONTEXT_COOKIE_NAME } from "@/lib/gate-context";

const sendMagicLinkEmailMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/notifications/send", () => ({
  sendMagicLinkEmail: sendMagicLinkEmailMock,
}));

const TEST_EMAIL = "magic-link-route-test@example.com";

function requestWithGateCookie(body: unknown, gateContextCookie?: string): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (gateContextCookie) {
    headers.set("cookie", `${GATE_CONTEXT_COOKIE_NAME}=${gateContextCookie}`);
  }
  return new NextRequest("http://localhost:3000/api/auth/magic-link", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

afterAll(async () => {
  await prisma.magicLinkToken.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe("POST /api/auth/magic-link", () => {
  it("rejects requests without a valid gate-context cookie (auth unreachable without the gate)", async () => {
    const { POST } = await import("@/app/api/auth/magic-link/route");
    const res = await POST(requestWithGateCookie({ email: TEST_EMAIL }));
    expect(res.status).toBe(403);
    expect(sendMagicLinkEmailMock).not.toHaveBeenCalled();
  });

  it("issues a token and sends the email when the gate context is valid", async () => {
    sendMagicLinkEmailMock.mockClear();
    const gateCookie = createGateContextCookieValue({
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    const { POST } = await import("@/app/api/auth/magic-link/route");
    const res = await POST(requestWithGateCookie({ email: TEST_EMAIL }, gateCookie));

    expect(res.status).toBe(200);
    expect(sendMagicLinkEmailMock).toHaveBeenCalledTimes(1);
    const [[callArgs]] = sendMagicLinkEmailMock.mock.calls;
    expect(callArgs.to).toBe(TEST_EMAIL);
    expect(callArgs.verifyUrl).toContain("/api/auth/verify?token=");

    const tokenCount = await prisma.magicLinkToken.count({ where: { email: TEST_EMAIL } });
    expect(tokenCount).toBeGreaterThan(0);
  });

  it("rejects an invalid email even with a valid gate context", async () => {
    const gateCookie = createGateContextCookieValue({
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    const { POST } = await import("@/app/api/auth/magic-link/route");
    const res = await POST(requestWithGateCookie({ email: "not-an-email" }, gateCookie));
    expect(res.status).toBe(400);
  });

  it("surfaces a 502 (not a false 200) when the email provider fails to send", async () => {
    // Regression test: Resend's SDK returns {error} rather than throwing on
    // API-level failures — sendMagicLinkEmail must convert that into a
    // thrown error, and the route must not report ok:true when it happens.
    sendMagicLinkEmailMock.mockRejectedValueOnce(new Error("Resend failed to send email"));
    const gateCookie = createGateContextCookieValue({
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    const { POST } = await import("@/app/api/auth/magic-link/route");
    const res = await POST(requestWithGateCookie({ email: TEST_EMAIL }, gateCookie));
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.ok).toBeUndefined();
  });
});
