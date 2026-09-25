/**
 * Motivation Letter — Product Spec (v1).md §4, plus a "Dear Sir/Madam,"
 * greeting line the spec's draft omitted. Multiple 2026 immigration-
 * advisory sources (anchorless.io, coverletterforvisa.com) independently
 * recommend this as the standard salutation when the reviewing officer's
 * name is unknown, which is always true here — verified 2026-09-20.
 * Text lives here as data (ordered paragraphs with {{placeholders}}),
 * never inline in a component or route. NEVER mention "NomadPacket"
 * anywhere in this text (AGENTS.md §2) — this letter must read as the
 * applicant's own words to a consulate.
 */
export interface MotivationLetterData {
  homeCountry: string;
  fullName: string;
  nationality: string;
  /**
   * Pre-composed "City, Country" (or just "Country" if no city was
   * given) — a single field, not two ({{currentCity}}/{{currentCountry}}
   * used to be filled from the SAME currentCountry answer, which either
   * duplicated the country or, worse, could show whatever unrelated
   * value ended up in that answer where a city belonged). See
   * generate.ts's mapAnswersToMotivationLetterData.
   */
  residingLocation: string;
  visaFlavorLabel: string;
  jobTitleOrRole: string;
  /** "at {employer}" | "as an independent freelancer/contractor serving clients including {clients}" */
  employmentDescriptor: string;
  /** Feature A: optional inline clause appended to employment paragraph (e.g. "I have been continuously employed through a recent employer transition."), or "" */
  employmentGapClause: string;
  intendedMoveDate: string;
  /** Already includes the leading "and reside at ..." clause, or "" if unknown. */
  accommodationClause: string;
  incomeAmountFormatted: string;
  personalReason: string;
  date: string;
}

export const motivationLetterTemplate = {
  id: "MOTIVATION_LETTER" as const,
  paragraphs: [
    "To the Consular Section, Embassy/Consulate of Portugal in {{homeCountry}},",
    "Dear Sir/Madam,",
    "I, {{fullName}}, a citizen of {{nationality}} currently residing in {{residingLocation}}, am writing to formally express my intention to relocate to Portugal under the D8 {{visaFlavorLabel}} Visa program.",
    "I work as a {{jobTitleOrRole}} {{employmentDescriptor}}, earning income that is entirely sourced from outside Portugal.{{employmentGapClause}} My work is fully remote and location-independent, allowing me to continue performing my professional duties without interruption while residing in Portugal.",
    "I intend to relocate to Portugal on or around {{intendedMoveDate}}{{accommodationClause}}. I have arranged comprehensive health insurance valid in Portugal and can demonstrate a stable monthly income of {{incomeAmountFormatted}}, well in excess of the minimum threshold required for this visa category.",
    "I am drawn to Portugal because {{personalReason}}. I look forward to contributing to and being part of Portuguese life during my stay.",
    "Sincerely,\n{{fullName}}\n{{date}}",
  ],
};
