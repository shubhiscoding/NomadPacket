import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { generateApplicationDocuments } from "@/document-engine/generate-packet";
import { loadDocument } from "@/lib/storage";
import { __clearFxCacheForTests } from "@/lib/fx";
import employeeUsFixture from "../fixtures/us-employee-residence.json";
import businessCaDependentsFixture from "../fixtures/ca-business-owner-dependents.json";

const TEST_EMAIL = "generate-packet-test@example.com";
// A separate user for the business_owner fixture — one user can only
// have one non-PAID application at a time (DB constraint, see
// prisma/migrations/20260922150000_one_draft_application_per_user), and
// TEST_EMAIL's first application needs to stay alive (unpaid) for the
// "regenerating" test below.
const SECOND_TEST_EMAIL = "generate-packet-test-2@example.com";
let applicationId: string;
let secondApplicationId: string;

beforeAll(() => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rates: { EUR: 1 } }) }),
  );
});

afterAll(async () => {
  for (const email of [TEST_EMAIL, SECOND_TEST_EMAIL]) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.generatedDocument.deleteMany({
        where: { application: { userId: user.id } },
      });
      await prisma.application.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }
  await prisma.$disconnect();
});

describe("generateApplicationDocuments", () => {
  it("generates all 4 documents for a US employee: motivation, employer confirmation, income summary, and the national visa form prefill", async () => {
    const user = await prisma.user.upsert({
      where: { email: TEST_EMAIL },
      create: { email: TEST_EMAIL },
      update: {},
    });
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        country: employeeUsFixture.country,
        visaType: employeeUsFixture.visaType,
        answers: employeeUsFixture.answers,
      },
    });
    applicationId = application.id;

    await generateApplicationDocuments(applicationId);

    const docs = await prisma.generatedDocument.findMany({ where: { applicationId } });
    const types = docs.map((d) => d.type).sort();
    expect(types).toEqual(
      [
        "EMPLOYER_CONFIRMATION_LETTER",
        "INCOME_SUMMARY_SHEET",
        "MOTIVATION_LETTER",
        "NATIONAL_VISA_FORM_PREFILL",
      ].sort(),
    );

    // Confirm every file is actually retrievable from storage, not just a
    // DB row pointing nowhere.
    for (const doc of docs) {
      const buffer = await loadDocument(doc.fileUrl);
      expect(buffer.length).toBeGreaterThan(0);
    }
  });

  it("generates the freelancer narrative instead of the employer letter for a business_owner", async () => {
    const user = await prisma.user.upsert({
      where: { email: SECOND_TEST_EMAIL },
      create: { email: SECOND_TEST_EMAIL },
      update: {},
    });
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        country: businessCaDependentsFixture.country,
        visaType: businessCaDependentsFixture.visaType,
        answers: businessCaDependentsFixture.answers,
      },
    });
    secondApplicationId = application.id;

    await generateApplicationDocuments(secondApplicationId);

    const docs = await prisma.generatedDocument.findMany({
      where: { applicationId: secondApplicationId },
    });
    const types = docs.map((d) => d.type);
    expect(types).toContain("FREELANCER_INCOME_NARRATIVE");
    expect(types).not.toContain("EMPLOYER_CONFIRMATION_LETTER");
  });

  it("regenerating replaces existing rows rather than accumulating duplicates", async () => {
    await generateApplicationDocuments(applicationId);
    const docs = await prisma.generatedDocument.findMany({ where: { applicationId } });
    expect(docs.length).toBe(4);
  });
});
