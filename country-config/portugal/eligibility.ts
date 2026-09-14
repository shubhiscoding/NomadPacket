import type {
  EligibilityDependentsIncomeAddition,
  EligibilityMonthlyIncomeThreshold,
  EligibilitySavingsBufferGuideline,
} from "../types";

/**
 * Portugal D8 residence-visa eligibility figures, 2026.
 *
 * These are legal thresholds that move roughly every January (pegged to
 * Portugal's minimum wage) — AGENTS.md §4 requires they live here as
 * sourced, dated, versioned data, never as inline code constants. This file
 * is what prisma/seed.ts writes into CountryConfig; the runtime always
 * reads through lib/config-resolver.ts, never this file directly.
 *
 * Source: Product Spec (v1).md §1 ("Monthly income ≥ €3,680, pegged to 4×
 * Portugal's minimum wage"), cross-checked against 2026 immigration-advisory
 * publications (e.g. globalcitizensolutions.com/portugal-digital-nomad-visa,
 * citizenremote.com/visas/portugal-digital-nomad-visa) on 2026-09-14. Not an
 * official AIMA/consulate primary source — re-verify against an official
 * source before launch and whenever the January figure updates.
 */
export const monthlyIncomeThreshold2026: EligibilityMonthlyIncomeThreshold = {
  amountEur: 3680,
};

/**
 * Dependents income-addition formula. The +50% (spouse) / +30% (per child)
 * SHAPE is corroborated across every 2026 source checked, but the BASE they
 * multiply is reported inconsistently — some sources apply it to Portugal's
 * €920 minimum wage (→ +€460 / +€276), others to the D8's own €3,680
 * threshold (→ +€1,840 / +€1,104). This is a genuine, unresolved
 * discrepancy, not something to silently pick — both are carried, appliesTo
 * is left UNVERIFIED, and the UI must show both figures with a
 * "confirm with your consulate" notice until this is resolved against an
 * official source. See sourceNote in seed.ts for full citation.
 */
export const dependentsIncomeAddition2026: EligibilityDependentsIncomeAddition = {
  spousePercent: 50,
  childPercent: 30,
  appliesTo: "UNVERIFIED",
  interpretations: [
    { appliesTo: "MINIMUM_WAGE", spouseAdditionEur: 460, childAdditionEur: 276 },
    { appliesTo: "D8_THRESHOLD", spouseAdditionEur: 1840, childAdditionEur: 1104 },
  ],
};

/**
 * Source: Product Spec (v1).md §1 ("a savings buffer of roughly €11,040
 * helps" — i.e. 3x the monthly threshold, covering a full 3-month dip).
 */
export const savingsBufferGuideline2026: EligibilitySavingsBufferGuideline = {
  amountEur: 11040,
  note:
    "Roughly 3x the monthly income threshold. Consulates increasingly want a " +
    "6-month average above the threshold; a buffer like this helps if any " +
    "single month dips below it.",
};
