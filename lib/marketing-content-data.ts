import { resolveConfigValue } from "@/lib/config-resolver";
import { CountryConfigKey } from "@/country-config/types";
import type {
  CriminalRecordBranchInstructions,
  EligibilityDependentsIncomeAddition,
  EligibilityMonthlyIncomeThreshold,
  EligibilitySavingsBufferGuideline,
  NifBranchInstructions,
} from "@/country-config/types";

/**
 * Shared data-fetching for public marketing/resource pages (seo.md §3).
 * These pages must pull the SAME versioned CountryConfig values the
 * product itself uses — never a hardcoded number in page copy — so a
 * January threshold update is a data change, not a content-and-code
 * redeploy across a dozen pages (AGENTS.md §4).
 */

const COUNTRY = "PT";
const VISA_TYPE = "D8_RESIDENCE";

export async function getD8EligibilityFigures() {
  const [threshold, dependents, savings] = await Promise.all([
    resolveConfigValue<EligibilityMonthlyIncomeThreshold>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: CountryConfigKey.EligibilityMonthlyIncomeThreshold,
    }),
    resolveConfigValue<EligibilityDependentsIncomeAddition>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: CountryConfigKey.EligibilityDependentsIncomeAddition,
    }),
    resolveConfigValue<EligibilitySavingsBufferGuideline>({
      country: COUNTRY,
      visaType: VISA_TYPE,
      key: CountryConfigKey.EligibilitySavingsBufferGuideline,
    }),
  ]);

  return {
    threshold: threshold?.value ?? null,
    dependents: dependents?.value ?? null,
    savings: savings?.value ?? null,
  };
}

export async function getCriminalRecordInstructions(
  homeCountry: string,
): Promise<CriminalRecordBranchInstructions | null> {
  const result = await resolveConfigValue<CriminalRecordBranchInstructions>({
    country: COUNTRY,
    visaType: VISA_TYPE,
    homeCountry,
    key: CountryConfigKey.BranchCriminalRecordInstructions,
  });
  return result?.value ?? null;
}

export async function getNifInstructions(): Promise<NifBranchInstructions | null> {
  const result = await resolveConfigValue<NifBranchInstructions>({
    country: COUNTRY,
    visaType: VISA_TYPE,
    key: CountryConfigKey.BranchNifInstructions,
  });
  return result?.value ?? null;
}
