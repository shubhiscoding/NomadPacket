import type { Answers } from "@/questionnaire-engine/types";

/**
 * Portugal's national visa form asks for Surname and First name(s) as
 * separate fields (1 and 3), but the questionnaire collects a single
 * `fullLegalName` string. This is a real content-shape mismatch surfaced
 * only once the actual government form was sourced — the stub's fake field
 * names hid it.
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

/**
 * Builds the flat string map fill.ts actually draws onto the PDF: raw
 * answers plus synthetic derived keys (surname/givenNames/occupationLabel)
 * that FormFieldOverlay.source.questionId can reference alongside real
 * QuestionIds.
 */
export function deriveOverlayValues(answers: Answers): Record<string, string> {
  const { surname, givenNames } = splitFullName(answers.fullLegalName as string | undefined);

  const values: Record<string, string> = { surname, givenNames };
  values.occupationLabel = occupationLabel(answers.employmentType as string | undefined);

  for (const [key, value] of Object.entries(answers)) {
    if (value !== undefined && value !== null) {
      values[key] = String(value);
    }
  }

  return values;
}
