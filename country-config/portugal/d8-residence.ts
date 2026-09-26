import {
  dependentsIncomeAddition2026,
  monthlyIncomeThreshold2026,
  savingsBufferGuideline2026,
} from "./eligibility";
import { usCriminalRecordInstructions } from "./criminal-record-branches/us";
import { ukCriminalRecordInstructions } from "./criminal-record-branches/uk";
import { caCriminalRecordInstructions } from "./criminal-record-branches/ca";
import { nifInstructions } from "./nif";
import { nationalVisaFormFieldMapping } from "./form-field-mapping";
import { CountryConfigKey } from "../types";

/**
 * Bundles every Portugal/D8_RESIDENCE config value in one place — this is
 * what prisma/seed.ts iterates over to write CountryConfig rows, and what
 * tests import to assert seed data matches source. Adding a second visa
 * type for Portugal (e.g. D8_TEMPORARY, once built) means a sibling
 * `d8-temporary.ts` file + a registry entry in ./index.ts — not a change
 * to this file's shape or to the seed script's logic.
 */
export const portugalD8ResidenceConfig = {
  country: "PT",
  visaType: "D8_RESIDENCE",
  effectiveFrom: new Date("2026-01-01T00:00:00Z"),
  countryWide: [
    {
      key: CountryConfigKey.EligibilityMonthlyIncomeThreshold,
      value: monthlyIncomeThreshold2026,
      sourceUrl:
        "https://portugal.gov.pt/en/gc25/communication/news/government-increases-minimum-wage-to-920-euros-in-2026",
      sourceNote:
        "Portugal's government announced a 2026 RMMG of €920, effective from " +
        "1 January 2026. The D8 threshold is €3,680, computed as 4x that RMMG; " +
        "the exact D8 figure is not stated verbatim in the government announcement. " +
        "The official MNE visa portal classifies the target path as a residency " +
        "visa for professional activity done remotely. Do not use the VFS " +
        "Digital-Nomad-Checklist.pdf currently linked in older notes as residence " +
        "evidence: its live text identifies it as a temporary-stay checklist.",
    },
    {
      key: CountryConfigKey.EligibilityDependentsIncomeAddition,
      value: dependentsIncomeAddition2026,
      sourceUrl:
        "https://vistos.mne.gov.pt/en/national-visas/necessary-documentation/means-of-subsistence",
      sourceNote:
        "Portugal's official MNE means-of-subsistence page states that long-term " +
        "visa means are based on the 2026 minimum monthly salary of €920, with " +
        "100% for the first adult, 50% for a second/additional adult, and 30% " +
        "for children and dependent children. Retrieved 2026-09-26. The D8 " +
        "primary-applicant €3,680 threshold remains a separate 4x-RMMG product " +
        "rule; dependent additions use the MNE per-capita percentages against " +
        "the €920 RMMG.",
    },
    {
      key: CountryConfigKey.EligibilitySavingsBufferGuideline,
      value: savingsBufferGuideline2026,
      sourceUrl: "internal:Product Spec (v1).md#1",
      sourceNote: "Directly from Product Spec (v1).md §1, verified 2026-09-14.",
    },
    {
      key: CountryConfigKey.BranchNifInstructions,
      homeCountry: null,
      value: nifInstructions,
      sourceUrl: "internal:Product Spec (v1).md#2",
      sourceNote: "Directly from Product Spec (v1).md §2, verified 2026-09-14.",
    },
    {
      key: CountryConfigKey.FormFillNationalVisaFormMapping,
      value: nationalVisaFormFieldMapping,
      sourceUrl: "https://vistos.mne.gov.pt/images/formulario_visto_nacional_pt.pdf",
      sourceNote:
        "Real Portuguese national visa form, cross-checked against the VFS Global " +
        "Portugal form used by the mapping. Coordinate mapping is verified against " +
        "the downloaded PDF; fields that are ambiguous or applicant-signature-only " +
        "remain blank by design. See document-engine/form-fill/README.md.",
    },
  ],
  perHomeCountry: [
    {
      homeCountry: "US",
      key: CountryConfigKey.BranchCriminalRecordInstructions,
      value: usCriminalRecordInstructions,
      sourceUrl: "internal:Product Spec (v1).md#2",
      sourceNote:
        "FBI Identity History Summary via approved Channeler, per Product " +
        "Spec (v1).md §2; US Apostille Convention membership is stable " +
        "public record. Verified 2026-09-14.",
    },
    {
      homeCountry: "UK",
      key: CountryConfigKey.BranchCriminalRecordInstructions,
      value: ukCriminalRecordInstructions,
      sourceUrl: "internal:Product Spec (v1).md#2",
      sourceNote:
        "ACRO Police Certificate, per Product Spec (v1).md §2; UK Apostille " +
        "Convention membership is stable public record. Verified 2026-09-14.",
    },
    {
      homeCountry: "CA",
      key: CountryConfigKey.BranchCriminalRecordInstructions,
      value: caCriminalRecordInstructions,
      sourceUrl: "https://www.hcch.net/en/news-archive/details/?varevent=953",
      sourceNote:
        "Not detailed in the product spec (which names US/UK as worked " +
        "examples) — researched directly. RCMP-based Certified Criminal " +
        "Record Check via an accredited fingerprinting company. Canada's " +
        "Apostille Convention accession (2024-01-11) is RECENT — double-check " +
        "before launch in case an older source assumed full consular " +
        "legalization was still required. Verified 2026-09-14.",
    },
  ],
};
