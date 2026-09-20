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
  /**
   * Conservative default — English-language documents are sometimes
   * accepted without translation depending on the specific consulate, not
   * just the home country. `true` here means "assume you'll need one
   * unless your consulate says otherwise," not a confirmed universal rule.
   * `translationNote` carries the caveat; always show it alongside this
   * flag rather than presenting the boolean as a flat fact.
   */
  translationRequired: boolean;
  translationNote: string;
  freshnessRuleDays: number;
  /** Where you actually submit — differs by home country (e.g. VFS Global vs. direct consulate). */
  submissionChannelNote?: string;
}

export interface NifBranchInstructions {
  explanation: string;
  needsFiscalRepresentative: boolean;
  routes: string[];
}

export interface FormFieldSource {
  /**
   * A QuestionId, OR a synthetic derived key (e.g. "surname", "givenNames",
   * "occupationLabel") computed from answers before filling — see
   * document-engine/form-fill/derive-overlay-values.ts. Kept as a plain
   * string (not the strict QuestionId union) so this stays decoupled from
   * questionnaire-engine and derived-value keys can coexist.
   */
  questionId: string;
}

/**
 * A single value overlaid onto the PDF at an absolute position. Portugal's
 * real national visa form (like most official government forms) has NO
 * fillable AcroForm fields — it's a flat, print-and-hand-fill PDF — so
 * pre-fill means drawing text on top of it at measured coordinates, not
 * setting a named form field. `page` is 0-based; `x`/`y` are in PDF points
 * from the bottom-left of the page (pdf-lib's coordinate system).
 *
 * Two kinds:
 *  - "text" (default): draws the derived value as a string. `maxWidth`, if
 *    set, makes fill.ts shrink the font (down to `minFontSize`) until the
 *    text fits, rather than letting it overflow into a neighboring cell —
 *    this form's cells are tight enough that a long employer name or
 *    address genuinely needs this, not just a nice-to-have.
 *  - "checkbox": draws a checkmark over a printed ☐ glyph. Only drawn when
 *    the derived value is the literal string "true" — every other value
 *    (including "false" or missing) leaves the box unmarked. Only used for
 *    choices this product can determine with certainty (e.g. "Two entries
 *    (residency)" is always true — the qualifier gate guarantees D8
 *    residence, never temporary stay); never for anything genuinely
 *    ambiguous (sex, civil status, purpose of journey).
 */
export interface FormFieldOverlay {
  page: number;
  x: number;
  y: number;
  source: FormFieldSource;
  kind?: "text" | "checkbox";
  fontSize?: number;
  maxWidth?: number;
  minFontSize?: number;
}

export interface FormFieldMapping {
  formAssetPath: string;
  /**
   * True until the real official PDF has been sourced and mapped. False
   * means `formAssetPath` points at the actual government/VFS-Global-
   * sourced form and `fields` are real, measured coordinates — not a
   * guarantee every field is pixel-perfect; see the form-fill README for
   * what's still a visual-QA follow-up vs. what's a genuine blocker.
   */
  isStub: boolean;
  fields: FormFieldOverlay[];
}

export interface QualifierGateEntry {
  country: string;
  visaType: string;
  supported: boolean;
}
