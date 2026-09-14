import type { CriminalRecordBranchInstructions } from "../../types";

/**
 * US-specific criminal record certificate guidance for the Portugal D8
 * checklist (Bucket 3). Source: Product Spec (v1).md §2 ("US applicants
 * need an FBI background check via an approved channeler"); apostille
 * status confirmed against the US being a party to the 1961 Hague Apostille
 * Convention (public record, stable fact) as of 2026-09-14.
 */
export const usCriminalRecordInstructions: CriminalRecordBranchInstructions = {
  homeCountryLabel: "United States",
  issuingAuthority: "FBI Identity History Summary (background check)",
  howToObtain: [
    "Request an FBI Identity History Summary through an FBI-approved 'Channeler' " +
      "(a private company authorized to submit fingerprints and receive results " +
      "faster than applying to the FBI directly).",
    "Submit fingerprints — most channelers offer a mail-in fingerprint card or a " +
      "live-scan location.",
    "Typical turnaround via a channeler is a few business days once fingerprints " +
      "are received.",
  ],
  isHagueApostilleMember: true,
  legalizationInstructions:
    "The US is a member of the Hague Apostille Convention. Have the FBI Identity " +
    "History Summary apostilled by the US Department of State (not a full " +
    "consular legalization) before submitting it with your visa application.",
  translationRequired: true,
  freshnessRuleDays: 90,
};
