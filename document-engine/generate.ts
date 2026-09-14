import type { Answers } from "@/questionnaire-engine/types";
import type { MotivationLetterData } from "./letters/templates/motivation-letter.template";
import type { EmployerConfirmationData } from "./letters/templates/employer-confirmation.template";
import type { FreelancerNarrativeData } from "./letters/templates/freelancer-narrative.template";
import type {
  IncomeSummaryRow,
  IncomeSummarySheetData,
} from "./letters/templates/income-summary-sheet.template";
import { computeRunningAverages, computeOverallAverage, meetsThreshold } from "@/lib/eligibility";
import { convertToEur } from "@/lib/fx";

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function formatDate(value: string | number | boolean | undefined): string {
  if (typeof value !== "string" || !value) return "[date not provided]";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function str(value: string | number | boolean | undefined, fallback = ""): string {
  return value === undefined || value === null ? fallback : String(value);
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

  return {
    homeCountry: opts.homeCountryLabel,
    fullName: str(answers.fullLegalName, "[full name not provided]"),
    nationality: opts.homeCountryLabel,
    currentCity: str(answers.currentCountry, "[current location not provided]"),
    currentCountry: opts.homeCountryLabel,
    // v1 only builds the residence-visa path (AGENTS.md scope) — the
    // qualifier gate never lets D8_TEMPORARY reach this far, so this is
    // always "Residence".
    visaFlavorLabel: "Residence",
    jobTitleOrRole: employmentType === "employee" ? "employee" : str(employmentType, "professional"),
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
    jobTitle: "[job title]",
    startDate: "[start date]",
    remoteDescriptor: "remote",
    pronounSubject: "They",
    pronounObject: "them",
    pronounPossessive: "their",
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
 * comparing. This is async as a result. Threshold comparison itself is
 * computed here from a server-resolved config value, never trusted from
 * the client.
 */
export async function mapAnswersToIncomeSummarySheetData(
  answers: Answers,
  opts: { thresholdEur: number },
): Promise<IncomeSummarySheetData> {
  const monthsToShow = Math.max(1, Math.min(6, Number(answers.incomeStabilityMonths ?? 1)));
  const monthlyAmount = Number(answers.monthlyIncome ?? 0);
  const currency = str(answers.incomeCurrency, "USD");
  const source = str(answers.employerOrClientNames, "Reported income");
  const monthlyAmountEur = await convertToEur(monthlyAmount, currency);

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

  return {
    rows,
    averageFormatted: formatCurrency(average, "EUR"),
    thresholdFormatted: formatCurrency(opts.thresholdEur, "EUR"),
    thresholdStatus: status,
  };
}
