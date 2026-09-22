import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { POST as qualifierPost } from "@/app/api/qualifier/route";
import { POST as waitlistPost } from "@/app/api/waitlist/route";
import { prisma } from "@/lib/prisma";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";

function postJson(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  await prisma.waitlist.deleteMany({ where: { email: { contains: "gate-route-test" } } });
});

afterAll(async () => {
  await prisma.waitlist.deleteMany({ where: { email: { contains: "gate-route-test" } } });
  await prisma.$disconnect();
});

describe("POST /api/qualifier", () => {
  it("supported selection: redirects to /login and sets a valid signed gate-context cookie", async () => {
    const res = await qualifierPost(
      postJson("http://localhost:3000/api/qualifier", {
        country: "PT",
        visaType: "D8_RESIDENCE",
      }),
    );
    const json = await res.json();
    expect(json.redirectTo).toBe("/signin"); // Google-only sign-in now (see auth/auth.ts)

    const setCookie = res.cookies.get(GATE_CONTEXT_COOKIE_NAME);
    expect(setCookie?.value).toBeTruthy();
    const ctx = verifyGateContextCookieValue(setCookie?.value);
    expect(ctx).toEqual({ country: "PT", visaType: "D8_RESIDENCE", forceNew: false });
  });

  it("threads forceNew through to the gate-context cookie when set (the 'Fill new form' signal)", async () => {
    const res = await qualifierPost(
      postJson("http://localhost:3000/api/qualifier", {
        country: "PT",
        visaType: "D8_RESIDENCE",
        forceNew: true,
      }),
    );
    const setCookie = res.cookies.get(GATE_CONTEXT_COOKIE_NAME);
    const ctx = verifyGateContextCookieValue(setCookie?.value);
    expect(ctx?.forceNew).toBe(true);
  });

  it("unsupported selection: redirects to /waitlist, sets no gate-context cookie", async () => {
    const res = await qualifierPost(
      postJson("http://localhost:3000/api/qualifier", {
        country: "PT",
        visaType: "D8_TEMPORARY",
      }),
    );
    const json = await res.json();
    expect(json.redirectTo).toContain("/waitlist");
    expect(json.redirectTo).toContain("visaType=D8_TEMPORARY");
    expect(res.cookies.get(GATE_CONTEXT_COOKIE_NAME)).toBeUndefined();
  });

  it("rejects a malformed request body", async () => {
    const res = await qualifierPost(
      postJson("http://localhost:3000/api/qualifier", { country: "PT" }),
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/waitlist", () => {
  it("creates a Waitlist row and nothing else (no User/Application created by this route)", async () => {
    const email = "gate-route-test@example.com";
    const res = await waitlistPost(
      postJson("http://localhost:3000/api/waitlist", {
        email,
        country: "PT",
        visaType: "D8_TEMPORARY",
      }),
    );
    expect(res.status).toBe(200);

    const row = await prisma.waitlist.findFirst({ where: { email } });
    expect(row).not.toBeNull();
    expect(row?.country).toBe("PT");
    expect(row?.visaType).toBe("D8_TEMPORARY");

    const userCount = await prisma.user.count({ where: { email } });
    expect(userCount).toBe(0);
  });

  it("rejects an invalid email", async () => {
    const res = await waitlistPost(
      postJson("http://localhost:3000/api/waitlist", {
        email: "not-an-email",
        country: "PT",
        visaType: "D8_TEMPORARY",
      }),
    );
    expect(res.status).toBe(400);
  });
});
