import { describe, expect, it, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTestSessionCookie, gateContextCookieHeader } from "../test-helpers/session";

const TEST_EMAIL = "applications-route-test@example.com";

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.application.deleteMany({ where: { userId: user.id } });
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.$disconnect();
});

describe("POST /api/applications", () => {
  it("requires a session", async () => {
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(new NextRequest("http://localhost:3000/api/applications", { method: "POST" }));
    expect(res.status).toBe(401);
  });

  it("requires a valid gate-context cookie even when signed in", async () => {
    const { cookieHeader } = await createTestSessionCookie(TEST_EMAIL);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: cookieHeader },
      }),
    );
    expect(res.status).toBe(403);
  });

  it("creates an Application with country/visaType fixed from the gate context", async () => {
    const { cookieHeader } = await createTestSessionCookie(TEST_EMAIL);
    const gateCookie = gateContextCookieHeader("PT", "D8_RESIDENCE");
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: `${cookieHeader}; ${gateCookie}` },
      }),
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.application.country).toBe("PT");
    expect(data.application.visaType).toBe("D8_RESIDENCE");
    expect(data.application.status).toBe("DRAFT");
  });
});

describe("PATCH /api/applications/[id]", () => {
  it("saves partial answers incrementally and reports validation errors without losing progress", async () => {
    const { cookieHeader } = await createTestSessionCookie(TEST_EMAIL);
    const { POST } = await import("@/app/api/applications/route");
    const createRes = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: `${cookieHeader}; ${gateContextCookieHeader("PT", "D8_RESIDENCE")}` },
      }),
    );
    const { application } = await createRes.json();

    const { PATCH } = await import("@/app/api/applications/[id]/route");

    // First partial save: just the name. Should not be "complete" yet.
    const firstPatch = await PATCH(
      new NextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { cookie: cookieHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { fullLegalName: "Jane Doe" } }),
      }),
      { params: Promise.resolve({ id: application.id }) },
    );
    const firstData = await firstPatch!.json();
    expect(firstData.application.status).toBe("DRAFT");
    expect(firstData.errors.length).toBeGreaterThan(0);

    // Second partial save: adds more fields, merges with the first (name
    // persists even though this PATCH doesn't resend it).
    const secondPatch = await PATCH(
      new NextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { cookie: cookieHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { nationality: "US" } }),
      }),
      { params: Promise.resolve({ id: application.id }) },
    );
    const secondData = await secondPatch!.json();
    expect(secondData.application.answers.fullLegalName).toBe("Jane Doe");
    expect(secondData.application.answers.nationality).toBe("US");
  });

  it("rejects access to another user's application", async () => {
    const { cookieHeader: ownerCookie } = await createTestSessionCookie(TEST_EMAIL);
    const { POST } = await import("@/app/api/applications/route");
    const createRes = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: `${ownerCookie}; ${gateContextCookieHeader("PT", "D8_RESIDENCE")}` },
      }),
    );
    const { application } = await createRes.json();

    const { cookieHeader: otherCookie } = await createTestSessionCookie(
      "applications-route-test-other@example.com",
    );
    const { GET } = await import("@/app/api/applications/[id]/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        headers: { cookie: otherCookie },
      }),
      { params: Promise.resolve({ id: application.id }) },
    );
    expect(res!.status).toBe(404);

    await prisma.user.delete({ where: { email: "applications-route-test-other@example.com" } });
  });
});
