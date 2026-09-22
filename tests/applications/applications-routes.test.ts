import { describe, expect, it, afterAll, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTestUser, gateContextCookieHeader } from "../test-helpers/session";

// Auth is Google-only via Auth.js v5 now — auth() reads cookies through
// next/headers, which only works inside Next's real request lifecycle,
// not when a test calls a route handler function directly. Mock at the
// module boundary instead (see tests/test-helpers/session.ts).
vi.mock("@/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from "@/auth/current-user";

const TEST_EMAIL = "applications-route-test@example.com";

beforeEach(async () => {
  vi.mocked(getCurrentUser).mockReset();
  // Several tests below call POST /api/applications for the same reused
  // TEST_EMAIL user — each creates a new non-PAID application, which
  // now violates the DB's "one draft per user" constraint (see
  // prisma/migrations/20260922150000_one_draft_application_per_user)
  // unless the previous test's draft is cleared first.
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.application.deleteMany({ where: { userId: user.id } });
  }
});

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.application.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.$disconnect();
});

describe("POST /api/applications", () => {
  it("requires a session", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(new NextRequest("http://localhost:3000/api/applications", { method: "POST" }));
    expect(res.status).toBe(401);
  });

  it("requires a valid gate-context cookie even when signed in", async () => {
    const user = await createTestUser(TEST_EMAIL);
    vi.mocked(getCurrentUser).mockResolvedValue(user);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(new NextRequest("http://localhost:3000/api/applications", { method: "POST" }));
    expect(res.status).toBe(403);
  });

  it("creates an Application with country/visaType fixed from the gate context", async () => {
    const user = await createTestUser(TEST_EMAIL);
    vi.mocked(getCurrentUser).mockResolvedValue(user);
    const gateCookie = gateContextCookieHeader("PT", "D8_RESIDENCE");
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: gateCookie },
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
    const user = await createTestUser(TEST_EMAIL);
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    const { POST } = await import("@/app/api/applications/route");
    const createRes = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: gateContextCookieHeader("PT", "D8_RESIDENCE") },
      }),
    );
    const { application } = await createRes.json();

    const { PATCH } = await import("@/app/api/applications/[id]/route");

    // First partial save: just the name. Should not be "complete" yet.
    const firstPatch = await PATCH(
      new NextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { nationality: "US" } }),
      }),
      { params: Promise.resolve({ id: application.id }) },
    );
    const secondData = await secondPatch!.json();
    expect(secondData.application.answers.fullLegalName).toBe("Jane Doe");
    expect(secondData.application.answers.nationality).toBe("US");
  });

  it("rejects access to another user's application", async () => {
    const owner = await createTestUser(TEST_EMAIL);
    vi.mocked(getCurrentUser).mockResolvedValue(owner);

    const { POST } = await import("@/app/api/applications/route");
    const createRes = await POST(
      new NextRequest("http://localhost:3000/api/applications", {
        method: "POST",
        headers: { cookie: gateContextCookieHeader("PT", "D8_RESIDENCE") },
      }),
    );
    const { application } = await createRes.json();

    const other = await createTestUser("applications-route-test-other@example.com");
    vi.mocked(getCurrentUser).mockResolvedValue(other);

    const { GET } = await import("@/app/api/applications/[id]/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/applications/${application.id}`),
      { params: Promise.resolve({ id: application.id }) },
    );
    expect(res!.status).toBe(404);

    await prisma.user.delete({ where: { email: "applications-route-test-other@example.com" } });
  });
});
