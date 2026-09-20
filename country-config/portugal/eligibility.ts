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
 * publications on 2026-09-14, then against VFS Global's own official D8/
 * digital-nomad checklist (vfsglobal.com/one-pager/portugal/usa/english/pdf/
 * Digital-Nomad-Checklist.pdf, retrieved 2026-09-20) — which states the
 * requirement as "average monthly income ... minimum value equivalent to
 * four monthly minimum guaranty remuneration" and cites Portaria n.º
 * 1563/2007 as its legal basis, corroborating the 4x-RMMG formula directly
 * from Portugal's official visa-partner documentation. €3,680 itself is a
 * COMPUTED figure (4x the RMMG minimum wage, which the government sets by a
 * separate annual decree) rather than a number stated verbatim in any one
 * document — re-verify the current RMMG and recompute each January.
 */
export const monthlyIncomeThreshold2026: EligibilityMonthlyIncomeThreshold = {
  amountEur: 3680,
};

/**
 * Dependents income-addition formula — RESOLVED against a primary legal
 * source. Portaria n.º 1563/2007, de 11 de Dezembro (Diário da República,
 * 1.ª série, N.º 238, Art. 2.º §2), fixes Portugal's general "meios de
 * subsistência" (means of subsistence) per-capita formula against the
 * RMMG (retribuição mínima mensal garantida — the national minimum wage),
 * not against any visa-specific enhanced threshold:
 *   a) Primeiro adulto: 100%
 *   b) Segundo ou mais adultos: 50%
 *   c) Crianças e jovens <18 e filhos maiores a cargo: 30%
 * Art. 5.º ("Visto de residência") applies this same Art. 2.º §2 formula to
 * residence-visa applicants, which is what D8 is. D8's well-documented
 * "4x RMMG" figure for the primary applicant is a visa-specific enhancement
 * on top of this ordinance — the dependent add-on percentages themselves
 * are computed on the RMMG, not on the enhanced 4x figure. Full text:
 * https://vistos.mne.gov.pt/images/schengen/portaria1563_2007_meios_de_subsist.pdf
 * (government-hosted primary source), retrieved and read in full 2026-09-20.
 *
 * The D8_THRESHOLD interpretation is kept alongside for transparency (it's
 * what a handful of consultancy sources state, incorrectly per the above),
 * but MINIMUM_WAGE is the governing figure.
 */
export const dependentsIncomeAddition2026: EligibilityDependentsIncomeAddition = {
  spousePercent: 50,
  childPercent: 30,
  appliesTo: "MINIMUM_WAGE",
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
