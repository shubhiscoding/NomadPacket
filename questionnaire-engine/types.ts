/**
 * Config-driven questionnaire types (AGENTS.md §3.2): the engine
 * (engine.ts) operates only on QuestionnaireConfig + answers — no
 * country/visa-specific `if` branches belong in engine code or shared
 * components. Branching (employment type, dependents) is expressed
 * declaratively via `visibleWhen`.
 */

export type QuestionId =
  // Section A — Basics
  | "fullLegalName"
  | "nationality"
  | "currentCity"
  | "currentCountry"
  | "passportNumber"
  | "passportExpiry"
  // Section B — Work & income
  | "employmentType"
  | "jobTitle"
  | "employerOrClientNames"
  | "monthlyIncome"
  | "incomeCurrency"
  | "incomeStabilityMonths"
  | "hasSavingsBuffer"
  | "savingsBufferAmount"
  // Section C — Family
  | "hasDependents"
  | "dependentsSpouseIncluded"
  | "dependentsChildrenCount"
  // Section D — Logistics
  | "hasAccommodation"
  | "accommodationDetails"
  | "hasHealthInsurance"
  | "intendedMoveDate"
  // Optional — feeds the motivation letter's personalized paragraph. Not
  // one of the spec's numbered questions; added because the letter
  // template needs free text no numbered question covers (see plan §4
  // assumption 3).
  | "personalReason"
  // Section E — optional extras, added specifically so more of the
  // official visa form's fields can be pre-filled instead of left blank
  // (fields 4, 14, 19 on the real form — see document-engine/form-fill/).
  // All optional: skipping this section still produces a complete,
  // submittable packet, just with a few more fields for the applicant to
  // fill in by hand.
  | "dateOfBirth"
  | "passportIssueDate"
  | "homeAddress"
  | "phoneNumber";

export type FieldType =
  | "text"
  | "select"
  | "radio"
  | "date"
  | "currency"
  | "number"
  | "boolean"
  | "textarea";

export interface SelectOption {
  value: string;
  label: string;
}

export type BranchCondition =
  | { questionId: QuestionId; equals: string | number | boolean }
  | { questionId: QuestionId; in: Array<string | number | boolean> }
  | { all: BranchCondition[] }
  | { any: BranchCondition[] };

export type ValidationRule =
  | { type: "minLength"; value: number }
  | { type: "pattern"; value: string; message: string }
  | { type: "minDate"; value: "today" }
  | { type: "min"; value: number };

export interface Question {
  id: QuestionId;
  section: "A" | "B" | "C" | "D" | "E";
  label: string;
  helpText?: string;
  fieldType: FieldType;
  options?: SelectOption[];
  required: boolean;
  validation?: ValidationRule[];
  visibleWhen?: BranchCondition;
}

export interface QuestionGroup {
  section: "A" | "B" | "C" | "D" | "E";
  title: string;
  questions: Question[];
}

export interface QuestionnaireConfig {
  country: string;
  visaType: string;
  groups: QuestionGroup[];
}

/** Answers keyed by QuestionId. Values are loosely typed since fieldType varies. */
export type Answers = Partial<Record<QuestionId, string | number | boolean>>;

export interface ValidationError {
  questionId: QuestionId;
  message: string;
}
