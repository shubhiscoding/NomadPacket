import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { resolveConfigValue } from "@/lib/config-resolver";

// Isolated fixture country/visaType so this suite never collides with real
// seeded Portugal/D8 data.
const COUNTRY = "TEST";
const VISA_TYPE = "TEST_VISA";
const KEY = "eligibility.monthlyIncomeThreshold";

beforeAll(async () => {
  await prisma.countryConfig.createMany({
    data: [
      // Superseded value: 2024-01-01 through 2025-12-31.
      {
        country: COUNTRY,
        visaType: VISA_TYPE,
        homeCountry: null,
        key: KEY,
        value: { amountEur: 1000 },
        effectiveFrom: new Date("2024-01-01T00:00:00Z"),
        effectiveTo: new Date("2026-01-01T00:00:00Z"),
        sourceUrl: "test://old",
      },
      // Current value: 2026-01-01 onward, still current (effectiveTo null).
      {
        country: COUNTRY,
        visaType: VISA_TYPE,
        homeCountry: null,
        key: KEY,
        value: { amountEur: 2000 },
        effectiveFrom: new Date("2026-01-01T00:00:00Z"),
        effectiveTo: null,
        sourceUrl: "test://current",
      },
      // Home-country-scoped row, to prove scoping is respected.
      {
        country: COUNTRY,
        visaType: VISA_TYPE,
        homeCountry: "US",
        key: "branch.criminalRecord.instructions",
        value: { note: "us-specific" },
        effectiveFrom: new Date("2026-01-01T00:00:00Z"),
        effectiveTo: null,
        sourceUrl: "test://us",
      },
    ],
  });
});

afterAll(async () => {
  await prisma.countryConfig.deleteMany({ where: { country: COUNTRY } });
  await prisma.$disconnect();
});

describe("resolveConfigValue", () => {
  it("resolves the current (effectiveTo: null) row as of now", async () => {
    const result = await resolveConfigValue<{ amountEur: number }>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: KEY,
    });
    expect(result?.value.amountEur).toBe(2000);
    expect(result?.sourceUrl).toBe("test://current");
  });

  it("resolves the historical row for a past asOf date, reproducing an old application's numbers", async () => {
    const result = await resolveConfigValue<{ amountEur: number }>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: KEY,
      asOf: new Date("2025-06-01T00:00:00Z"),
    });
    expect(result?.value.amountEur).toBe(1000);
  });

  it("treats the effectiveFrom boundary as inclusive", async () => {
    const result = await resolveConfigValue<{ amountEur: number }>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: KEY,
      asOf: new Date("2026-01-01T00:00:00Z"),
    });
    expect(result?.value.amountEur).toBe(2000);
  });

  it("treats the effectiveTo boundary as exclusive (the old row stops applying exactly at effectiveTo)", async () => {
    const result = await resolveConfigValue<{ amountEur: number }>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: KEY,
      asOf: new Date("2025-12-31T23:59:59Z"),
    });
    expect(result?.value.amountEur).toBe(1000);
  });

  it("returns null when no row matches (unknown key)", async () => {
    const result = await resolveConfigValue({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: "nonexistent.key",
    });
    expect(result).toBeNull();
  });

  it("returns null when asOf predates every row's effectiveFrom", async () => {
    const result = await resolveConfigValue({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: KEY,
      asOf: new Date("2020-01-01T00:00:00Z"),
    });
    expect(result).toBeNull();
  });

  it("respects homeCountry scoping — a country-wide lookup does not see a home-country-scoped row", async () => {
    const countryWide = await resolveConfigValue({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: "branch.criminalRecord.instructions",
    });
    expect(countryWide).toBeNull();

    const usScoped = await resolveConfigValue<{ note: string }>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      homeCountry: "US",
      key: "branch.criminalRecord.instructions",
    });
    expect(usScoped?.value.note).toBe("us-specific");
  });
});
