import type {
  EligibilityDependentsIncomeAddition,
  EligibilityMonthlyIncomeThreshold,
} from "@/country-config/types";

/**
 * Eligibility/threshold math (AGENTS.md §4: tests-first, never trust
 * client-computed eligibility). All inputs come from resolveConfigValue()
 * results and questionnaire answers — nothing here is a hardcoded legal
 * number.
 */

export interface DependentsAdjustedThreshold {
  baseAmountEur: number;
  /** Both interpretations, since sources disagree on the base — see
   * country-config/portugal/eligibility.ts. Present both until verified. */
  interpretations: Array<{
    appliesTo: "MINIMUM_WAGE" | "D8_THRESHOLD";
    totalAmountEur: number;
  }>;
}

/**
 * Applies the dependents income-addition formula for a spouse and/or N
 * children, under each carried interpretation of what the percentage
 * applies to. Deliberately does not collapse to a single number — the
 * checklist/income-summary UI must show both until the base is verified
 * against an official source (per the explicit "keep this editable/
 * versioned rather than hardcoded or guessed" instruction).
 */
export function computeDependentsAdjustedThreshold(params: {
  baseThreshold: EligibilityMonthlyIncomeThreshold;
  dependentsAddition: EligibilityDependentsIncomeAddition;
  hasSpouse: boolean;
  childrenCount: number;
}): DependentsAdjustedThreshold {
  const { baseThreshold, dependentsAddition, hasSpouse, childrenCount } = params;

  const interpretations = dependentsAddition.interpretations.map((interp) => {
    const spouseAddition = hasSpouse ? interp.spouseAdditionEur : 0;
    const childrenAddition = childrenCount * interp.childAdditionEur;
    return {
      appliesTo: interp.appliesTo,
      totalAmountEur: baseThreshold.amountEur + spouseAddition + childrenAddition,
    };
  });

  return { baseAmountEur: baseThreshold.amountEur, interpretations };
}

export interface MonthlyIncomeEntry {
  month: string;
  amountEur: number;
  source: string;
}

/** Running average of amountEur up to and including each index, in order. */
export function computeRunningAverages(entries: MonthlyIncomeEntry[]): number[] {
  const averages: number[] = [];
  let runningSum = 0;
  entries.forEach((entry, index) => {
    runningSum += entry.amountEur;
    averages.push(runningSum / (index + 1));
  });
  return averages;
}

export function computeOverallAverage(entries: MonthlyIncomeEntry[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, e) => sum + e.amountEur, 0);
  return total / entries.length;
}

/**
 * Uses the single-applicant threshold for the pass/fail headline figure —
 * the dependents-adjusted interpretations are surfaced separately (both of
 * them) since the base is unverified, per computeDependentsAdjustedThreshold.
 */
export function meetsThreshold(averageEur: number, thresholdEur: number): boolean {
  return averageEur >= thresholdEur;
}
