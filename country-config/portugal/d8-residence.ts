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
        "https://www.vfsglobal.com/one-pager/portugal/usa/english/pdf/Digital-Nomad-Checklist.pdf",
      sourceNote:
        "€3,680 = 4x Portugal's 2026 minimum wage (RMMG). Cross-checked " +
        "against VFS Global's own D8/digital-nomad checklist (Portugal's " +
        "official outsourced visa partner), which states the requirement as " +
        "4x RMMG and cites Portaria n.º 1563/2007, retrieved 2026-09-20. The " +
        "exact euro figure isn't stated verbatim in any one document — it's " +
        "computed from the current RMMG, set by a separate annual decree.",
    },
    {
      key: CountryConfigKey.EligibilityDependentsIncomeAddition,
      value: dependentsIncomeAddition2026,
      sourceUrl:
        "https://vistos.mne.gov.pt/images/schengen/portaria1563_2007_meios_de_subsist.pdf",
      sourceNote:
        "Portaria n.º 1563/2007, de 11 de Dezembro, Art. 2.º §2 (applied to " +
        "residence visas via Art. 5.º) — primary government legal source, " +
        "read in full 2026-09-20. Confirms the base is the RMMG (minimum " +
        "wage), resolving the earlier MINIMUM_WAGE-vs-D8_THRESHOLD ambiguity. " +
        "See country-config/portugal/eligibility.ts.",
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
      sourceUrl: "PENDING-SOURCE",
      sourceNote:
        "STUB — see document-engine/form-fill/README.md and the TODO in " +
        "document-engine/form-fill/mappings/pt-d8-national-visa-form.mapping.ts. " +
        "Not sourced from the real official Portuguese visa form.",
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
