import { describe, expect, it, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { findResumableApplication } from "@/lib/find-resumable-application";
import { createTestUser } from "../test-helpers/session";

const TEST_EMAIL = "find-resumable-application-test@example.com";

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.application.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.$disconnect();
});

describe("findResumableApplication", () => {
  it("returns null when the user has no applications at all", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const result = await findResumableApplication(user.id);
    expect(result).toBeNull();
  });

  it("returns null when the user's only application is PAID — a paid application is done, not resumable", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const paid = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE", status: "PAID" },
    });

    const result = await findResumableApplication(user.id);
    expect(result).toBeNull();

    await prisma.application.delete({ where: { id: paid.id } });
  });

  it("resumes an older AWAITING_PAYMENT application even when a newer PAID one exists", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const awaitingPayment = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE", status: "AWAITING_PAYMENT" },
    });
    const paid = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE", status: "PAID" },
    });

    const result = await findResumableApplication(user.id);
    expect(result?.id).toBe(awaitingPayment.id);

    await prisma.application.deleteMany({ where: { id: { in: [awaitingPayment.id, paid.id] } } });
  });

  it("returns the most recently created non-PAID application when multiple exist", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const older = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE", status: "DRAFT" },
    });
    const newer = await prisma.application.create({
      data: {
        userId: user.id,
        country: "PT",
        visaType: "D8_RESIDENCE",
        status: "QUESTIONNAIRE_COMPLETE",
      },
    });

    const result = await findResumableApplication(user.id);
    expect(result?.id).toBe(newer.id);

    await prisma.application.deleteMany({ where: { id: { in: [older.id, newer.id] } } });
  });
});
