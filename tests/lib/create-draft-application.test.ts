import { describe, expect, it, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { createDraftApplicationSafely } from "@/lib/create-draft-application";
import { createTestUser } from "../test-helpers/session";

const TEST_EMAIL = "create-draft-application-test@example.com";

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.application.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  await prisma.$disconnect();
});

describe("createDraftApplicationSafely", () => {
  it("creates a normal draft application when the user has none yet", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const application = await createDraftApplicationSafely({
      userId: user.id,
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    expect(application.userId).toBe(user.id);
    expect(application.status).toBe("DRAFT");

    await prisma.application.delete({ where: { id: application.id } });
  });

  it("the DB constraint itself rejects a second non-PAID application for the same user", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const first = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE" },
    });

    await expect(
      prisma.application.create({
        data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE" },
      }),
    ).rejects.toThrow();

    await prisma.application.delete({ where: { id: first.id } });
  });

  it("gracefully returns the existing draft instead of throwing when a race is hit", async () => {
    // Simulates the exact bug this constraint fixes: two near-simultaneous
    // "Fill new form" invocations both trying to create a fresh draft.
    // The first insert (done directly, standing in for "the other
    // request that won the race") succeeds; createDraftApplicationSafely
    // must not throw for the second one — it should return the winner.
    const user = await createTestUser(TEST_EMAIL);
    const winner = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE" },
    });

    const result = await createDraftApplicationSafely({
      userId: user.id,
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    expect(result.id).toBe(winner.id);

    // Only one row exists — the losing create never actually inserted anything.
    const count = await prisma.application.count({ where: { userId: user.id } });
    expect(count).toBe(1);

    await prisma.application.delete({ where: { id: winner.id } });
  });

  it("a PAID application never blocks creating a new draft", async () => {
    const user = await createTestUser(TEST_EMAIL);
    const paid = await prisma.application.create({
      data: { userId: user.id, country: "PT", visaType: "D8_RESIDENCE", status: "PAID" },
    });

    const draft = await createDraftApplicationSafely({
      userId: user.id,
      country: "PT",
      visaType: "D8_RESIDENCE",
    });
    expect(draft.status).toBe("DRAFT");
    expect(draft.id).not.toBe(paid.id);

    await prisma.application.deleteMany({ where: { id: { in: [paid.id, draft.id] } } });
  });
});
