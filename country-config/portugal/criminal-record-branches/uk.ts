import type { CriminalRecordBranchInstructions } from "../../types";

/**
 * UK-specific criminal record certificate guidance for the Portugal D8
 * checklist (Bucket 3). Source: Product Spec (v1).md §2 ("UK applicants
 * need an ACRO check"); apostille status confirmed against the UK being a
 * party to the 1961 Hague Apostille Convention (public record, stable
 * fact) as of 2026-09-14.
 */
export const ukCriminalRecordInstructions: CriminalRecordBranchInstructions = {
  homeCountryLabel: "United Kingdom",
  issuingAuthority: "ACRO Police Certificate (Criminal Records Office)",
  howToObtain: [
    "Apply for an ACRO Police Certificate online via the ACRO Criminal Records " +
      "Office — this is the standard certificate accepted for overseas visa " +
      "applications, distinct from a standard DBS check.",
    "Provide proof of identity and address history covering the period the " +
      "certificate needs to reflect.",
    "Standard processing is typically a few weeks — apply well before your " +
      "consulate appointment.",
  ],
  isHagueApostilleMember: true,
  legalizationInstructions:
    "The UK is a member of the Hague Apostille Convention. Have the ACRO " +
    "certificate apostilled by the FCDO (Foreign, Commonwealth & Development " +
    "Office) legalisation service before submitting it with your visa application.",
  translationRequired: true,
  freshnessRuleDays: 90,
};
