import { describe, expect, it, beforeAll, beforeEach, afterAll, vi } from "vitest";
import { NextRequest } from "next/server";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { generateApplicationDocuments } from "@/document-engine/generate-packet";
import { __clearFxCacheForTests } from "@/lib/fx";
import { createTestUser } from "../test-helpers/session";
import employeeUsFixture from "../fixtures/us-employee-residence.json";
import type { User } from "@prisma/client";

// Auth is Google-only via Auth.js v5 now — mock at the module boundary
// rather than construct a real session (see tests/test-helpers/session.ts).
vi.mock("@/auth/current-user", () => ({ getCurrentUser: vi.fn() }));
import { getCurrentUser } from "@/auth/current-user";

const TEST_EMAIL = "delivery-test@example.com";
const OTHER_EMAIL = "delivery-test-other@example.com";
let applicationId: string;
let testUser: User;
let otherUser: User;

const sendMock = vi.fn();
vi.mock("@/notifications/resend-client", () => ({
  getResendClient: () => ({ emails: { send: sendMock } }),
}));

beforeEach(() => {
  vi.mocked(getCurrentUser).mockReset();
});

beforeAll(async () => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rates: { EUR: 1 } }) }),
  );

  testUser = await createTestUser(TEST_EMAIL);
  otherUser = await createTestUser(OTHER_EMAIL);
  const application = await prisma.application.create({
    data: {
      userId: testUser.id,
      country: employeeUsFixture.country,
      visaType: employeeUsFixture.visaType,
      answers: employeeUsFixture.answers,
    },
  });
  applicationId = application.id;
  await generateApplicationDocuments(applicationId);
  // Download/email are entitlement-gated on a real PAID Payment row now
  // (entitlement/guard.ts) rather than the old always-true stub — these
  // tests are about download/email behavior once payment has already
  // succeeded, not about the payment flow itself, so seed that directly.
  await prisma.payment.create({
    data: {
      applicationId,
      providerRef: `test_payment_${applicationId}`,
      status: "PAID",
      amount: 0,
      currency: "USD",
    },
  });
});

afterAll(async () => {
  for (const email of [TEST_EMAIL, OTHER_EMAIL]) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.generatedDocument.deleteMany({ where: { application: { userId: user.id } } });
      await prisma.application.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }
  await prisma.$disconnect();
});

describe("GET /api/documents/[id]/download", () => {
  it("requires a session", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    const { GET } = await import("@/app/api/documents/[id]/download/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/documents/${applicationId}/download`),
      { params: Promise.resolve({ id: applicationId }) },
    );
    expect(res.status).toBe(401);
  });

  it("rejects another user's application", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(otherUser);
    const { GET } = await import("@/app/api/documents/[id]/download/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/documents/${applicationId}/download`),
      { params: Promise.resolve({ id: applicationId }) },
    );
    expect(res.status).toBe(404);
  });

  it("returns a ZIP containing every generated document", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(testUser);
    const { GET } = await import("@/app/api/documents/[id]/download/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/documents/${applicationId}/download`),
      { params: Promise.resolve({ id: applicationId }) },
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/zip");

    const arrayBuffer = await res.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const filenames = Object.keys(zip.files);
    expect(filenames).toContain("MOTIVATION_LETTER.pdf");
    expect(filenames).toContain("EMPLOYER_CONFIRMATION_LETTER.pdf");
    expect(filenames).toContain("INCOME_SUMMARY_SHEET.pdf");
    expect(filenames).toContain("NATIONAL_VISA_FORM_PREFILL.pdf");
  });

  it("returns 409 for an application with no generated documents yet", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(testUser);
    const emptyApplication = await prisma.application.create({
      data: { userId: testUser.id, country: "PT", visaType: "D8_RESIDENCE" },
    });
    // Paid but never generated — isolates the "no documents" 409 path from
    // the entitlement check, which runs first in the route.
    await prisma.payment.create({
      data: {
        applicationId: emptyApplication.id,
        providerRef: `test_payment_${emptyApplication.id}`,
        status: "PAID",
        amount: 0,
        currency: "USD",
      },
    });
    const { GET } = await import("@/app/api/documents/[id]/download/route");
    const res = await GET(
      new NextRequest(`http://localhost:3000/api/documents/${emptyApplication.id}/download`),
      { params: Promise.resolve({ id: emptyApplication.id }) },
    );
    expect(res.status).toBe(409);
    await prisma.application.delete({ where: { id: emptyApplication.id } });
  });
});

describe("POST /api/applications/[id]/email-packet", () => {
  it("sends the packet as an email attachment to the signed-in user's own address", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(testUser);
    sendMock.mockResolvedValueOnce({ data: { id: "email_123" }, error: null });
    const { POST } = await import("@/app/api/applications/[id]/email-packet/route");
    const res = await POST(
      new NextRequest(`http://localhost:3000/api/applications/${applicationId}/email-packet`, {
        method: "POST",
      }),
      { params: Promise.resolve({ id: applicationId }) },
    );
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const [[callArgs]] = sendMock.mock.calls;
    expect(callArgs.to).toBe(TEST_EMAIL);
    expect(callArgs.attachments[0].filename).toBe(`nomadpacket-${applicationId}.zip`);
  });

  it("surfaces a 502 (not a false 200) when Resend fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(testUser);
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { statusCode: 401, name: "validation_error", message: "API key is invalid" },
    });
    const { POST } = await import("@/app/api/applications/[id]/email-packet/route");
    const res = await POST(
      new NextRequest(`http://localhost:3000/api/applications/${applicationId}/email-packet`, {
        method: "POST",
      }),
      { params: Promise.resolve({ id: applicationId }) },
    );
    expect(res.status).toBe(502);
  });
});
