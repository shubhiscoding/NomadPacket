import { describe, expect, it, beforeAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { resolveConfigValue } from "@/lib/config-resolver";
import { countryConfigRegistry } from "@/country-config";
import type {
  CriminalRecordBranchInstructions,
  EligibilityMonthlyIncomeThreshold,
  FormFieldMapping,
} from "@/country-config/types";

/**
 * Assumes `npm run db:seed` has been run against the test database — these
 * assertions verify the seeded rows actually match the source-of-truth
 * config-as-code files, catching drift between seed.ts and country-config/.
 */
beforeAll(async () => {
  // Re-run the exact seed logic inline would duplicate prisma/seed.ts; instead
  // just confirm rows exist, and skip gracefully if the DB hasn't been seeded.
  const count = await prisma.countryConfig.count({ where: { country: "PT" } });
  if (count === 0) {
    throw new Error(
      "PT country_configs not seeded — run `npm run db:seed` before this suite.",
    );
  }
});

describe("seeded Portugal D8_RESIDENCE config matches country-config source files", () => {
  const bundle = countryConfigRegistry.find(
    (b) => b.country === "PT" && b.visaType === "D8_RESIDENCE",
  )!;

  it("monthly income threshold", async () => {
    const result = await resolveConfigValue<EligibilityMonthlyIncomeThreshold>({
      country: "PT",
      visaType: "D8_RESIDENCE",
      key: "eligibility.monthlyIncomeThreshold",
    });
    const expected = bundle.countryWide.find(
      (e) => e.key === "eligibility.monthlyIncomeThreshold",
    )!;
    expect(result?.value).toEqual(expected.value);
  });

  it.each(["US", "UK", "CA"])(
    "criminal record branch instructions for %s",
    async (homeCountry) => {
      const result = await resolveConfigValue<CriminalRecordBranchInstructions>({
        country: "PT",
        visaType: "D8_RESIDENCE",
        homeCountry,
        key: "branch.criminalRecord.instructions",
      });
      const expected = bundle.perHomeCountry.find(
        (e) => e.homeCountry === homeCountry,
      )!;
      expect(result?.value).toEqual(expected.value);
      expect(result?.value.isHagueApostilleMember).toBe(true);
    },
  );

  it("form-fill mapping points at the real government form, not a stub", async () => {
    const result = await resolveConfigValue<FormFieldMapping>({
      country: "PT",
      visaType: "D8_RESIDENCE",
      key: "formFill.nationalVisaForm.fieldMapping",
    });
    expect(result?.value.isStub).toBe(false);
  });
});
