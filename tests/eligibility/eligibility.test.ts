import { describe, expect, it } from "vitest";
import {
  computeDependentsAdjustedThreshold,
  computeOverallAverage,
  computeRunningAverages,
  meetsThreshold,
  type MonthlyIncomeEntry,
} from "@/lib/eligibility";
import { monthlyIncomeThreshold2026, dependentsIncomeAddition2026 } from "@/country-config/portugal/eligibility";

describe("computeDependentsAdjustedThreshold", () => {
  it("returns the unadjusted base when no spouse and no children", () => {
    const result = computeDependentsAdjustedThreshold({
      baseThreshold: monthlyIncomeThreshold2026,
      dependentsAddition: dependentsIncomeAddition2026,
      hasSpouse: false,
      childrenCount: 0,
    });
    for (const interp of result.interpretations) {
      expect(interp.totalAmountEur).toBe(3680);
    }
  });

  it("computes both interpretations for a spouse-only case", () => {
    const result = computeDependentsAdjustedThreshold({
      baseThreshold: monthlyIncomeThreshold2026,
      dependentsAddition: dependentsIncomeAddition2026,
      hasSpouse: true,
      childrenCount: 0,
    });
    const minWage = result.interpretations.find((i) => i.appliesTo === "MINIMUM_WAGE");
    const d8Threshold = result.interpretations.find((i) => i.appliesTo === "D8_THRESHOLD");
    expect(minWage?.totalAmountEur).toBe(3680 + 460);
    expect(d8Threshold?.totalAmountEur).toBe(3680 + 1840);
  });

  it("computes both interpretations for a spouse + 2 children case", () => {
    const result = computeDependentsAdjustedThreshold({
      baseThreshold: monthlyIncomeThreshold2026,
      dependentsAddition: dependentsIncomeAddition2026,
      hasSpouse: true,
      childrenCount: 2,
    });
    const minWage = result.interpretations.find((i) => i.appliesTo === "MINIMUM_WAGE");
    const d8Threshold = result.interpretations.find((i) => i.appliesTo === "D8_THRESHOLD");
    expect(minWage?.totalAmountEur).toBe(3680 + 460 + 2 * 276);
    expect(d8Threshold?.totalAmountEur).toBe(3680 + 1840 + 2 * 1104);
  });

  it("children-only (no spouse) applies no spouse addition", () => {
    const result = computeDependentsAdjustedThreshold({
      baseThreshold: monthlyIncomeThreshold2026,
      dependentsAddition: dependentsIncomeAddition2026,
      hasSpouse: false,
      childrenCount: 1,
    });
    const minWage = result.interpretations.find((i) => i.appliesTo === "MINIMUM_WAGE");
    expect(minWage?.totalAmountEur).toBe(3680 + 276);
  });
});

describe("computeRunningAverages / computeOverallAverage", () => {
  const entries: MonthlyIncomeEntry[] = [
    { month: "2026-01", amountEur: 3000, source: "Acme Inc" },
    { month: "2026-02", amountEur: 4000, source: "Acme Inc" },
    { month: "2026-03", amountEur: 5000, source: "Acme Inc" },
  ];

  it("computes a running average that matches manual expectation at each step", () => {
    const averages = computeRunningAverages(entries);
    expect(averages[0]).toBe(3000);
    expect(averages[1]).toBe(3500);
    expect(averages[2]).toBeCloseTo(4000);
  });

  it("computes the overall average across all entries", () => {
    expect(computeOverallAverage(entries)).toBeCloseTo(4000);
  });

  it("returns 0 for an empty entry list rather than NaN", () => {
    expect(computeOverallAverage([])).toBe(0);
  });
});

describe("meetsThreshold", () => {
  it.each([
    { average: 3680, threshold: 3680, expected: true, label: "exactly at threshold" },
    { average: 3679.99, threshold: 3680, expected: false, label: "just under threshold" },
    { average: 5000, threshold: 3680, expected: true, label: "well above threshold" },
    { average: 0, threshold: 3680, expected: false, label: "zero income" },
  ])("$label", ({ average, threshold, expected }) => {
    expect(meetsThreshold(average, threshold)).toBe(expected);
  });
});
