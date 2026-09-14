import { prisma } from "@/lib/prisma";
import type { ResolvedConfigValue } from "@/country-config/types";

export interface ResolveConfigParams {
  country: string;
  visaType: string;
  /** null/undefined for a country-wide value not scoped to a home country. */
  homeCountry?: string | null;
  key: string;
  /** Defaults to now. Pass a fixed date to reproduce an old application's numbers. */
  asOf?: Date;
}

/**
 * The single sanctioned way to read a legal/eligibility number, template
 * text variant, Bucket-3 branch value, or form-field mapping. Never read
 * CountryConfig via a raw Prisma query elsewhere, and never inline these
 * values as code constants (AGENTS.md §4).
 *
 * Resolution: the row for (country, visaType, homeCountry, key) whose
 * [effectiveFrom, effectiveTo) range contains `asOf`, where effectiveTo
 * being null means "still current".
 */
export async function resolveConfigValue<T>(
  params: ResolveConfigParams,
): Promise<ResolvedConfigValue<T> | null> {
  const asOf = params.asOf ?? new Date();
  const homeCountry = params.homeCountry ?? null;

  const row = await prisma.countryConfig.findFirst({
    where: {
      country: params.country,
      visaType: params.visaType,
      homeCountry,
      key: params.key,
      effectiveFrom: { lte: asOf },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: asOf } }],
    },
    orderBy: { effectiveFrom: "desc" },
  });

  if (!row) return null;

  return {
    value: row.value as T,
    sourceUrl: row.sourceUrl,
    sourceNote: row.sourceNote,
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
  };
}
