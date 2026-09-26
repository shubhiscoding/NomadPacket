import type { Answers } from "@/questionnaire-engine/types";
import { getCountryName } from "@/lib/country-mapping";

/**
 * Portugal's national visa form asks for Surname and First name(s) as
 * separate fields (1 and 3), but the questionnaire collects a single
 * `fullLegalName` string. This is a real content-shape mismatch surfaced
 * against the actual government form — the mapping's field names make it
 * easy to miss.
 *
 * Best-effort split: last space-separated token = surname, everything
 * before it = given name(s). This is a reasonable approximation, not a
 * correct general solution — compound surnames ("van der Berg", "De la
 * Cruz") or cultures where the family name comes first will split wrong.
 * TODO(before launch): replace with two separate questionnaire questions
 * (surname / given names) so this guess isn't needed at all.
 */
export function splitFullName(fullLegalName: string | undefined): {
  surname: string;
  givenNames: string;
} {
  const trimmed = (fullLegalName ?? "").trim();
  if (!trimmed) return { surname: "", givenNames: "" };

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { surname: parts[0], givenNames: "" };

  return {
    surname: parts[parts.length - 1],
    givenNames: parts.slice(0, -1).join(" "),
  };
}

const OCCUPATION_LABELS: Record<string, string> = {
  employee: "Employee",
  freelancer: "Freelancer / independent contractor",
  business_owner: "Business owner",
};

function occupationLabel(employmentType: string | undefined): string {
  return OCCUPATION_LABELS[employmentType ?? ""] ?? "";
}

function nationalityLabel(nationality: string | undefined): string {
  return getCountryName(nationality);
}

/**
 * "true"/"" (never any other value) — fill.ts only marks a checkbox
 * overlay when the derived value is exactly "true". Booleans-as-strings
 * because deriveOverlayValues' return type is Record<string, string>,
 * matching every other derived/raw value.
 */
function boolFlag(value: boolean): string {
  return value ? "true" : "";
}

/**
 * Builds the flat string map fill.ts actually draws onto the PDF: raw
 * answers plus synthetic derived keys (surname/givenNames/occupationLabel/
 * checkboxes/etc.) that FormFieldOverlay.source.questionId can reference
 * alongside real QuestionIds.
 */
export function deriveOverlayValues(answers: Answers): Record<string, string> {
  const { surname, givenNames } = splitFullName(answers.fullLegalName as string | undefined);
  const nationality = nationalityLabel(answers.nationality as string | undefined);

  const values: Record<string, string> = {
    surname,
    givenNames,
    nationalityLabel: nationality,
    occupationLabel: occupationLabel(answers.employmentType as string | undefined),
    // Field 26 "Member State of first entry" — always Portugal; this
    // product only supports a Portugal visa, so there's no other answer
    // it could be.
    memberStateFirstEntry: "Portugal",
    // Field 16 "Issued by (country)" for the travel document — the
    // applicant's own nationality/issuing country, already collected.
    passportIssuedByCountry: nationality,
    // Field 12 checkbox "Ordinary passport" — not asked separately; the
    // overwhelming majority of applicants have an ordinary (not
    // diplomatic/service) passport, so this defaults to checked. Flagged
    // as an assumption, not a verified fact per applicant.
    ordinaryPassportCheckbox: boolFlag(true),
    // Field 27 checkbox "Two entries (residency)" — always true. The
    // qualifier gate (country-config/qualifier-gate.ts) guarantees every
    // application that reaches this point is D8_RESIDENCE, never
    // D8_TEMPORARY, so this isn't a guess.
    entriesResidencyCheckbox: boolFlag(true),
    // Field 20 checkboxes "Residence in a country other than the country
    // of current nationality" — derived from the existing currentCountry
    // answer (already collected; Q3 in Section A), not a new question.
    residenceElsewhereYesCheckbox: boolFlag(
      Boolean(answers.currentCountry) &&
        String(answers.currentCountry).trim().length > 0 &&
        String(answers.currentCountry).trim().toLowerCase() !== nationality.toLowerCase(),
    ),
  };
  values.residenceElsewhereNoCheckbox = boolFlag(values.residenceElsewhereYesCheckbox !== "true");

  for (const [key, value] of Object.entries(answers)) {
    if (value !== undefined && value !== null) {
      values[key] = String(value);
    }
  }

  return values;
}
