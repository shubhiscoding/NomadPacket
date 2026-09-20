import { describe, expect, it, beforeAll, vi } from "vitest";
import { NextRequest } from "next/server";
import { __clearFxCacheForTests } from "@/lib/fx";

beforeAll(() => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rates: { EUR: 1 } }) }),
  );
});

/**
 * Assumes prisma/seed.ts has been run — reads the real seeded PT/D8_RESIDENCE
 * config, same as the product itself, per the "same math" claim on the
 * calculator page.
 */
describe("POST /api/tools/income-calculator", () => {
  it("reports meetsThreshold true for a single applicant well above the threshold", async () => {
    const { POST } = await import("@/app/api/tools/income-calculator/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/tools/income-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: 5000, currency: "EUR", hasSpouse: false, childrenCount: 0 }),
      }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.meetsThreshold).toBe(true);
    expect(data.requiredThresholdEur).toBe(3680);
  });

  it("reports meetsThreshold false for income below the single-applicant threshold", async () => {
    const { POST } = await import("@/app/api/tools/income-calculator/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/tools/income-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: 2000, currency: "EUR", hasSpouse: false, childrenCount: 0 }),
      }),
    );
    const data = await res.json();
    expect(data.meetsThreshold).toBe(false);
  });

  it("raises the required threshold for a spouse and children, using the MINIMUM_WAGE-based figure", async () => {
    const { POST } = await import("@/app/api/tools/income-calculator/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/tools/income-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: 4000, currency: "EUR", hasSpouse: true, childrenCount: 2 }),
      }),
    );
    const data = await res.json();
    // 3680 base + 460 spouse + 2*276 children = 4692, per the resolved
    // MINIMUM_WAGE interpretation (Portaria 1563/2007).
    expect(data.requiredThresholdEur).toBe(4692);
    expect(data.meetsThreshold).toBe(false); // 4000 < 4692
  });

  it("rejects invalid input", async () => {
    const { POST } = await import("@/app/api/tools/income-calculator/route");
    const res = await POST(
      new NextRequest("http://localhost:3000/api/tools/income-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: -100, currency: "XYZ" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});
