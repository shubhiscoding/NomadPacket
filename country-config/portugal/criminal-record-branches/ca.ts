import type { CriminalRecordBranchInstructions } from "../../types";

/**
 * Canada-specific criminal record certificate guidance for the Portugal D8
 * checklist (Bucket 3). Not explicitly detailed in Product Spec (v1).md
 * (which names the US/UK process as examples and says "expand from there"
 * for the third home country) — researched directly.
 *
 * Issuing process: RCMP-based fingerprint criminal record check, typically
 * obtained via an RCMP-accredited third-party fingerprinting company
 * (faster turnaround than applying directly to the RCMP). Source: general
 * public guidance on Canadian criminal record checks for immigration
 * purposes, verified 2026-09-14.
 *
 * Apostille status: Canada acceded to the 1961 Hague Apostille Convention
 * effective 2024-01-11 (source: hcch.net/en/news-archive — HCCH's own
 * notice that the Convention entered into force for Canada). This is a
 * RECENT change worth double-checking at implementation/launch time in case
 * an older guide still assumes Canada needed full consular legalization.
 *
 * ⚠️ SUBMISSION CHANNEL — genuinely unresolved, flagged rather than guessed:
 * unlike US/UK (both confirmed via real VFS Global US/UK portals with
 * downloadable forms), Canada does NOT appear to have an equivalent VFS
 * Global "Portugal visa from Canada" channel. The URL pattern that exists —
 * visa.vfsglobal.com/prt/en/can — reads as VFS's CANADIAN-immigration
 * service point located IN Portugal (the reverse direction), not a
 * Portugal-from-Canada portal; no "one-pager/portugal/canada" forms page
 * was found the way US/UK have. Canadian applicants most likely apply
 * directly through a Portuguese consulate (e.g. the Consulate General of
 * Portugal in Toronto — toronto.consuladoportugal.mne.gov.pt). CONFIRM
 * this directly with that consulate before launch — do not assume the
 * VFS-based flow described for US/UK applies to Canada.
 */
export const caCriminalRecordInstructions: CriminalRecordBranchInstructions = {
  homeCountryLabel: "Canada",
  issuingAuthority: "RCMP-based Certified Criminal Record Check",
  howToObtain: [
    "Obtain a fingerprint-based criminal record check through an RCMP-accredited " +
      "third-party fingerprinting company (faster turnaround than applying " +
      "directly to the RCMP).",
    "Provide fingerprints — most accredited companies offer in-person locations " +
      "across major Canadian cities.",
    "Typical turnaround via an accredited company is 1-2 weeks once " +
      "fingerprints are processed.",
  ],
  isHagueApostilleMember: true,
  legalizationInstructions:
    "Canada joined the Hague Apostille Convention effective January 11, 2024. " +
    "Have the certified criminal record check apostilled by Global Affairs " +
    "Canada before submitting it with your visa application — full consular " +
    "legalization is no longer required.",
  translationRequired: true,
  translationNote:
    "Treat this as the safe default, not a confirmed universal rule — whether " +
    "an English-language document needs translation into Portuguese varies by " +
    "consulate, not just by home country. Confirm directly with the specific " +
    "Portuguese consulate handling your application before assuming either way.",
  freshnessRuleDays: 90,
  submissionChannelNote:
    "UNCONFIRMED: no VFS Global Portugal-from-Canada portal was found " +
    "(unlike US/UK, which both have one). Canadian applicants likely apply " +
    "directly through a Portuguese consulate — e.g. the Consulate General " +
    "of Portugal in Toronto (toronto.consuladoportugal.mne.gov.pt). Verify " +
    "the exact submission channel and form version with that consulate " +
    "before launch; don't assume the VFS-based US/UK flow applies here.",
};
