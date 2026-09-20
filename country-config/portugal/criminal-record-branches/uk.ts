import type { CriminalRecordBranchInstructions } from "../../types";

/**
 * UK-specific criminal record certificate guidance for the Portugal D8
 * checklist (Bucket 3). Source: Product Spec (v1).md §2 ("UK applicants
 * need an ACRO check"); apostille status confirmed against the UK being a
 * party to the 1961 Hague Apostille Convention (public record, stable
 * fact) as of 2026-09-14. Submission channel confirmed via VFS Global's UK
 * portal (real form/checklist PDFs retrieved 2026-09-20, e.g.
 * vfsglobal.com/one-pager/portugal/uk/english/pdf/...).
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
  translationNote:
    "Treat this as the safe default, not a confirmed universal rule — whether " +
    "an English-language document needs translation into Portuguese varies by " +
    "consulate, not just by home country. Confirm directly with the specific " +
    "Portuguese consulate handling your application before assuming either way.",
  freshnessRuleDays: 90,
  submissionChannelNote:
    "Applications are submitted via VFS Global's UK portal (VFS Global is " +
    "Portugal's official outsourced visa partner in the UK) — confirmed by " +
    "downloading real form/checklist PDFs from vfsglobal.com/one-pager/ " +
    "portugal/uk on 2026-09-20.",
};
