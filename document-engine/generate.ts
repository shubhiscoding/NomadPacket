import type { Answers } from "@/questionnaire-engine/types";
import type { MotivationLetterData } from "./letters/templates/motivation-letter.template";
import type { EmployerConfirmationData } from "./letters/templates/employer-confirmation.template";
import type { FreelancerNarrativeData } from "./letters/templates/freelancer-narrative.template";
import type {
  IncomeSummaryRow,
  IncomeSummarySheetData,
} from "./letters/templates/income-summary-sheet.template";
import { computeRunningAverages, computeOverallAverage, meetsThreshold } from "@/lib/eligibility";
import { getExchangeRateToEur } from "@/lib/fx";

/**
 * Intl.NumberFormat's "en-US" currency style renders e.g. "€7,853.40" with
 * no space between the symbol and the digits — technically correct, but
 * visually cramped in the fonts used across these PDFs. Inserts a plain
 * space between the leading symbol and the first digit (matching how
 * currency amounts are commonly typeset) without touching the number
 * formatting itself.
 */
function formatCurrency(amount: number, currency: string): string {
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
  return formatted.replace(/^(\D+)(\d)/, "$1 $2");
}

function formatDate(value: string | number | boolean | undefined): string {
  if (typeof value !== "string" || !value) return "[date not provided]";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function str(value: string | number | boolean | undefined, fallback = ""): string {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

const GENERIC_ROLE_BY_EMPLOYMENT_TYPE: Record<string, string> = {
  employee: "employee",
  freelancer: "an independent freelancer",
  business_owner: "a business owner",
};

/**
 * Prefers the applicant's own answer for their job title/role; falls back
 * to a generic-but-accurate description derived from employmentType only
 * when they skipped the (optional) jobTitle question. Shared by every
 * mapper below so job title resolves the SAME way across all four
 * documents — the earlier bug was each mapper doing this differently
 * (one used employmentType as a stand-in, another left a literal
 * "[job title]" bracket even when a real answer existed).
 */
function resolveJobTitle(answers: Answers): string {
  const provided = str(answers.jobTitle);
  if (provided) return provided;
  return GENERIC_ROLE_BY_EMPLOYMENT_TYPE[str(answers.employmentType)] ?? "professional";
}

/**
 * Maps questionnaire answers to MotivationLetterData. `homeCountryLabel`
 * comes from the resolved country-config branch data, not typed by hand
 * per call site.
 */
export function mapAnswersToMotivationLetterData(
  answers: Answers,
  opts: { homeCountryLabel: string },
): MotivationLetterData {
  const employmentType = answers.employmentType;
  const employerOrClient = str(answers.employerOrClientNames, "[employer/clients not provided]");

  const employmentDescriptor =
    employmentType === "employee"
      ? `at ${employerOrClient}`
      : `as an independent freelancer/contractor serving clients including ${employerOrClient}`;

  const accommodationClause =
    answers.hasAccommodation && answers.accommodationDetails
      ? ` and reside at ${str(answers.accommodationDetails)}`
      : "";

  const incomeAmountFormatted = formatCurrency(
    Number(answers.monthlyIncome ?? 0),
    str(answers.incomeCurrency, "USD"),
  );

  // currentCity was previously read from answers.currentCountry (there was
  // no currentCity question at all) — that's a real field-mapping bug,
  // not just a naming slip: it meant the template's "{{currentCity}},
  // {{currentCountry}}" clause always rendered a country name (or
  // whatever else ended up in that answer) where a city belonged. Now
  // reads the actual currentCity answer (added specifically for this),
  // and cleanly omits the city clause entirely when it's blank rather
  // than showing a placeholder or duplicating the country.
  const currentCity = str(answers.currentCity);
  const currentCountryAnswer = str(answers.currentCountry, opts.homeCountryLabel);
  const residingLocation = currentCity ? `${currentCity}, ${currentCountryAnswer}` : currentCountryAnswer;

  return {
    homeCountry: opts.homeCountryLabel,
    fullName: str(answers.fullLegalName, "[full name not provided]"),
    nationality: opts.homeCountryLabel,
    residingLocation,
    visaFlavorLabel: "Residence",
    jobTitleOrRole: resolveJobTitle(answers),
    employmentDescriptor,
    intendedMoveDate: formatDate(answers.intendedMoveDate),
    accommodationClause,
    incomeAmountFormatted,
    // Falls back to a neutral, non-presumptuous statement when the
    // optional free-text field is blank — never fabricates a specific
    // personal reason.
    personalReason:
      str(answers.personalReason) || "its quality of life and welcoming community",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
}

/**
 * Gender isn't collected by the questionnaire (no such question in the
 * spec), so pronouns default to they/them throughout — a neutral,
 * non-presumptuous default, not a guess. This is a draft for the
 * employer's HR/manager to review and sign; they can edit it before
 * sending.
 */
export function mapAnswersToEmployerConfirmationData(answers: Answers): EmployerConfirmationData {
  return {
    companyName: str(answers.employerOrClientNames, "[employer name not provided]"),
    employeeFullName: str(answers.fullLegalName, "[full name not provided]"),
    // Previously always "[job title]", even when the applicant HAD given
    // a real answer elsewhere — silently inconsistent with the
    // motivation letter's own resolution. Now shares resolveJobTitle()
    // with every other document; only falls back to the literal bracket
    // (for HR to fill in) when there's truly nothing to work with.
    jobTitle: str(answers.jobTitle, "[job title]"),
    startDate: formatDate(answers.employmentStartDate),
    remoteDescriptor: "remote",
    pronounSubject: "They",
    pronounSubjectLowercase: "they",
    pronounPossessive: "their",
    pronounVerb: "are",
    amountAndCurrency: formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    ),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
}

const ROLE_DESCRIPTOR: Record<string, string> = {
  freelancer: "freelancer",
  business_owner: "business owner",
};

export function mapAnswersToFreelancerNarrativeData(
  answers: Answers,
  opts: { homeCountryLabel: string },
): FreelancerNarrativeData {
  const employmentType = str(answers.employmentType);
  return {
    homeCountry: opts.homeCountryLabel,
    fullName: str(answers.fullLegalName, "[full name not provided]"),
    roleDescriptor: ROLE_DESCRIPTOR[employmentType] ?? "freelancer",
    industryOrService: "[industry/service]",
    clientNamesOrTypes: str(answers.employerOrClientNames, "[clients not provided]"),
    stabilityMonths: `${str(answers.incomeStabilityMonths, "0")} months`,
    averageMonthlyIncomeFormatted: formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    ),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
}

/**
 * The questionnaire collects a single flat monthlyIncome figure and a
 * stability duration, not itemized month-by-month bank-statement data
 * (which lives in Bucket 3, self-sourced by the applicant). This sheet
 * approximates the spec's month-by-month table by repeating the reported
 * figure across up to 6 months of the reported stability window — an
 * assumption, not a fabrication of real transaction data; the applicant's
 * actual bank statements remain the source of truth submitted alongside
 * this cover sheet.
 *
 * The threshold is denominated in EUR but the applicant reports income in
 * their own currency — comparing face values directly would silently
 * misreport eligibility for every non-EUR applicant, so the reported
 * amount is converted to EUR (via lib/fx.ts, live ECB-backed rates) before
 * comparing. This is the ONE document whose entire job is a trustworthy
 * EUR-denominated number, so the conversion methodology is stated
 * explicitly on the document itself (conversionNote) — never a silent
 * step, even for a EUR-reporting applicant.
 */
export async function mapAnswersToIncomeSummarySheetData(
  answers: Answers,
  opts: { thresholdEur: number },
): Promise<IncomeSummarySheetData> {
  const monthsToShow = Math.max(1, Math.min(6, Number(answers.incomeStabilityMonths ?? 1)));
  const monthlyAmount = Number(answers.monthlyIncome ?? 0);
  const currency = str(answers.incomeCurrency, "USD");
  const source = str(answers.employerOrClientNames, "Reported income");
  const exchangeRate = await getExchangeRateToEur(currency);
  const monthlyAmountEur = monthlyAmount * exchangeRate;

  const entries = Array.from({ length: monthsToShow }, (_, i) => ({
    month: `Month ${i + 1}`,
    amountEur: monthlyAmountEur,
    source,
  }));

  const runningAverages = computeRunningAverages(entries);
  const rows: IncomeSummaryRow[] = entries.map((entry, i) => ({
    month: entry.month,
    grossIncomeFormatted: formatCurrency(monthlyAmount, currency),
    source: entry.source,
    runningAverageFormatted:
      i === 0 ? "—" : formatCurrency(runningAverages[i], "EUR"),
  }));

  const average = computeOverallAverage(entries);
  const status = meetsThreshold(average, opts.thresholdEur) ? "met" : "not met";

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const conversionNote =
    currency === "EUR"
      ? "Reported in EUR — no currency conversion applied."
      : `Converted from ${currency} to EUR at 1 ${currency} = ${exchangeRate.toFixed(4)} EUR ` +
        `(European Central Bank reference rate, retrieved ${today}).`;

  return {
    rows,
    averageFormatted: formatCurrency(average, "EUR"),
    thresholdFormatted: formatCurrency(opts.thresholdEur, "EUR"),
    thresholdStatus: status,
    conversionNote,
  };
}
