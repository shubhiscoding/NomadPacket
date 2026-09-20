import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveConfigValue } from "@/lib/config-resolver";
import { CountryConfigKey } from "@/country-config/types";
import type {
  EligibilityDependentsIncomeAddition,
  EligibilityMonthlyIncomeThreshold,
} from "@/country-config/types";
import { computeDependentsAdjustedThreshold, meetsThreshold } from "@/lib/eligibility";
import { convertToEur } from "@/lib/fx";

const bodySchema = z.object({
  monthlyIncome: z.coerce.number().min(0),
  currency: z.enum(["USD", "GBP", "CAD", "EUR"]),
  hasSpouse: z.boolean().default(false),
  childrenCount: z.coerce.number().int().min(0).max(10).default(0),
});

/**
 * Public, ungated calculator (seo.md §5) — reuses the exact same
 * lib/eligibility.ts functions the product itself uses for the income
 * summary sheet, and resolves the threshold from CountryConfig, never a
 * hardcoded figure. No auth required: this is top-of-funnel content, not
 * part of a paid application.
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { monthlyIncome, currency, hasSpouse, childrenCount } = parsed.data;

  const [thresholdResult, dependentsResult] = await Promise.all([
    resolveConfigValue<EligibilityMonthlyIncomeThreshold>({
      country: "PT",
      visaType: "D8_RESIDENCE",
      key: CountryConfigKey.EligibilityMonthlyIncomeThreshold,
    }),
    resolveConfigValue<EligibilityDependentsIncomeAddition>({
      country: "PT",
      visaType: "D8_RESIDENCE",
      key: CountryConfigKey.EligibilityDependentsIncomeAddition,
    }),
  ]);

  if (!thresholdResult || !dependentsResult) {
    return NextResponse.json({ error: "Configuration unavailable" }, { status: 503 });
  }

  const incomeEur = await convertToEur(monthlyIncome, currency);
  const adjusted = computeDependentsAdjustedThreshold({
    baseThreshold: thresholdResult.value,
    dependentsAddition: dependentsResult.value,
    hasSpouse,
    childrenCount,
  });

  // The dependents formula's base is resolved (MINIMUM_WAGE, per Portaria
  // 1563/2007 — see country-config/portugal/eligibility.ts) but both
  // interpretations are still carried in config; use the one flagged as
  // authoritative for the headline pass/fail figure.
  const authoritative =
    adjusted.interpretations.find((i) => i.appliesTo === dependentsResult.value.appliesTo) ??
    adjusted.interpretations[0];

  return NextResponse.json({
    incomeEur: Math.round(incomeEur),
    requiredThresholdEur: authoritative.totalAmountEur,
    meetsThreshold: meetsThreshold(incomeEur, authoritative.totalAmountEur),
    baseThresholdEur: thresholdResult.value.amountEur,
    interpretations: adjusted.interpretations,
  });
}
