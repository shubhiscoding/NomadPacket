/**
 * Shared types for the country-config module (AGENTS.md §3.2/§3.4).
 *
 * CountryConfig rows are the ONLY sanctioned source of legal/eligibility
 * numbers, template text variants, Bucket-3 branch guidance, and form-field
 * mappings. Nothing in questionnaire-engine or document-engine should ever
 * read a threshold or branch-specific string as a code constant — always
 * through lib/config-resolver.ts, keyed by one of the strings below.
 *
 * Adding country #2 means: new CountryConfig rows (seeded) + new files under
 * country-config/<country>/ using this same key namespace. No changes to
 * this file's shape, questionnaire-engine, or document-engine should be
 * required — if they are, something got hardcoded that shouldn't have been.
 */

/** Namespaced dotted keys used as CountryConfig.key. Keep this list authoritative. */
export const CountryConfigKey = {
  EligibilityMonthlyIncomeThreshold: "eligibility.monthlyIncomeThreshold",
  EligibilityDependentsIncomeAddition: "eligibility.dependentsIncomeAddition",
  EligibilitySavingsBufferGuideline: "eligibility.savingsBufferGuideline",
  BranchCriminalRecordInstructions: "branch.criminalRecord.instructions",
  BranchNifInstructions: "branch.nif.instructions",
  FormFillNationalVisaFormMapping: "formFill.nationalVisaForm.fieldMapping",
  QualifierGateSupport: "qualifierGate.support",
} as const;

export type CountryConfigKeyValue =
  (typeof CountryConfigKey)[keyof typeof CountryConfigKey];

/** A resolved, versioned config value plus its provenance. */
export interface ResolvedConfigValue<T> {
  value: T;
  sourceUrl: string;
  sourceNote: string | null;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

export interface EligibilityMonthlyIncomeThreshold {
  /** Monthly amount in EUR minor-unit-free (whole euros), e.g. 3680. */
  amountEur: number;
}

/**
 * The dependents income-addition formula. Percentages are well-corroborated
 * across sources; the BASE they apply to is not (see seed.ts sourceNote) —
 * both interpretations are carried so nothing is silently guessed.
 */
export interface EligibilityDependentsIncomeAddition {
  spousePercent: number;
  childPercent: number;
  /** "UNVERIFIED" until confirmed against an official AIMA/consulate source. */
  appliesTo: "MINIMUM_WAGE" | "D8_THRESHOLD" | "UNVERIFIED";
  interpretations: Array<{
    appliesTo: "MINIMUM_WAGE" | "D8_THRESHOLD";
    spouseAdditionEur: number;
    childAdditionEur: number;
  }>;
}

export interface EligibilitySavingsBufferGuideline {
  amountEur: number;
  note: string;
}

/** Bucket-3 guidance content, scoped by homeCountry (US/UK/CA in v1). */
export interface CriminalRecordBranchInstructions {
  homeCountryLabel: string;
  issuingAuthority: string;
  howToObtain: string[];
  isHagueApostilleMember: boolean;
  legalizationInstructions: string;
  translationRequired: boolean;
  freshnessRuleDays: number;
}

export interface NifBranchInstructions {
  explanation: string;
  needsFiscalRepresentative: boolean;
  routes: string[];
}

export interface FormFieldSource {
  questionId: string;
}

export interface FormFieldMapping {
  formAssetPath: string;
  /** True until the real official PDF has been sourced and mapped. */
  isStub: boolean;
  fields: Array<{ pdfFieldName: string; source: FormFieldSource }>;
}

export interface QualifierGateEntry {
  country: string;
  visaType: string;
  supported: boolean;
}
