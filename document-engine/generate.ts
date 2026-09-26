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
  if (typeof value !== "string" || !value) return "date to be confirmed";
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
 * Feature B — Resolves freelancer client description based on whether they
 * have few named clients or many unnamed clients (marketplace/gig work).
 */
function resolveFreelancerClientDescription(answers: Answers): {
  introClientClause: string;
  incomeSourceLabel: string;
} {
  const freelancerClientBase = str(answers.freelancerClientBase);

  if (freelancerClientBase === "many_unnamed") {
    const count = answers.freelancerClientCount ?? "multiple";
    const platforms = str(answers.freelancerClientPlatforms, "various platforms");
    const notable = str(answers.freelancerNotableClients);
    const platformPhrase = `approximately ${count} client engagements over the past six months, primarily through ${platforms}`;
    const withNotable = notable ? `${platformPhrase}, including notable clients such as ${notable}` : platformPhrase;

    return {
      introClientClause: `clients located outside Portugal, including approximately ${count} engagements through ${platforms}${notable ? `, with notable clients such as ${notable}` : ""}`,
      incomeSourceLabel: `Multiple clients (${platforms})`,
    };
  }

  // Default: few_named or unset
  const clientNames = str(answers.employerOrClientNames, "select independent clients");
  return {
    introClientClause: `clients located outside Portugal, including ${clientNames}`,
    incomeSourceLabel: clientNames,
  };
}

interface EmployerRecord {
  companyName: string;
  jobTitle: string;
  startDate: Date;
  endDate: Date | null;
  monthlyIncome: number;
  currency: string;
}

/**
 * Feature A — Resolves employer history for employees who may have switched
 * employers recently. Single source of truth consumed by all three mappers
 * (motivation letter, employer confirmation, income summary).
 */
function resolveEmployerHistory(answers: Answers): {
  current: EmployerRecord;
  previous: EmployerRecord | null;
  hadGap: boolean;
  gapExplanation: string;
} {
  const hasChangedEmployer = answers.hasChangedEmployerRecently === true;

  const current: EmployerRecord = {
    companyName: str(answers.employerOrClientNames, "your current employer"),
    jobTitle: str(answers.jobTitle, "Professional"),
    startDate: new Date(str(answers.employmentStartDate, "2024-01-01")),
    endDate: null,
    monthlyIncome: Number(answers.monthlyIncome ?? 0),
    currency: str(answers.incomeCurrency, "USD"),
  };

  if (!hasChangedEmployer) {
    return {
      current,
      previous: null,
      hadGap: false,
      gapExplanation: "",
    };
  }

  const previous: EmployerRecord = {
    companyName: str(answers.previousEmployerName, "your previous employer"),
    jobTitle: str(answers.previousEmployerJobTitle, ""),
    startDate: new Date(str(answers.previousEmployerStartDate, "2024-01-01")),
    endDate: new Date(str(answers.previousEmployerEndDate, "2024-06-01")),
    monthlyIncome: Number(answers.previousEmployerMonthlyIncome ?? 0),
    currency: str(answers.previousEmployerIncomeCurrency, "USD"),
  };

  const hadGap = answers.hadEmploymentGap === true;
  const gapExplanation = str(answers.employmentGapExplanation, "");

  return { current, previous, hadGap, gapExplanation };
}

/**
 * Feature A — Builds month-by-month employer history for the income summary
 * sheet. Returns an array of months (oldest first) with which employer was
 * active in each month. Gap months are included (isGapMonth: true, employer: null)
 * but excluded from the average calculation.
 */
function resolveMonthlyIncomeHistory(
  history: ReturnType<typeof resolveEmployerHistory>,
  monthsToShow: number,
): Array<{ month: string; employer: EmployerRecord | null; isGapMonth: boolean }> {
  const result: Array<{ month: string; employer: EmployerRecord | null; isGapMonth: boolean }> = [];
  const now = new Date();

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i);
    const bucketStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1); // 1st of the month
    const bucketEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0); // Last day of the month

    let employer: EmployerRecord | null = null;
    let isGapMonth = false;

    if (!history.previous) {
      // No job switch: always current
      employer = history.current;
    } else {
      const currentRange = {
        start: history.current.startDate,
        end: history.current.endDate ?? new Date(8640000000000000), // Future infinity
      };

      const previousRange = {
        start: history.previous.startDate,
        end: history.previous.endDate ?? new Date(8640000000000000),
      };

      // Check which employer overlaps with this month [bucketStart, bucketEnd]
      // Two ranges [start1, end1] and [start2, end2] overlap if: start1 <= end2 AND end1 >= start2
      const currentOverlaps = currentRange.start <= bucketEnd && currentRange.end >= bucketStart;
      const previousOverlaps = previousRange.start <= bucketEnd && previousRange.end >= bucketStart;

      if (currentOverlaps && previousOverlaps) {
        // Both overlap: attribute to current (the primary period)
        employer = history.current;
      } else if (currentOverlaps) {
        employer = history.current;
      } else if (previousOverlaps) {
        employer = history.previous;
      } else {
        // No overlap: true gap month or history earlier than lookback
        isGapMonth = true;
      }
    }

    result.push({
      month: `Month ${i + 1}`,
      employer,
      isGapMonth,
    });
  }

  return result;
}

/**
 * Feature C — Resolves business narrative variant based on businessIncomeType.
 * Branches on income model (few clients, many clients, product, creator, other)
 * and composes appropriate paragraphs and labels.
 */
function resolveBusinessNarrativeVariant(answers: Answers): {
  introParagraph: string;
  incomeParagraph: string;
  incomeSourceLabel: string;
  reviewWarning: string;
} {
  const businessIncomeType = str(answers.businessIncomeType);

  if (businessIncomeType === "few_clients") {
    const clientNames = str(answers.employerOrClientNames, "select international clients");
    const stabilityMonths = str(answers.incomeStabilityMonths, "0");
    const avgIncome = formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    );

    return {
      introParagraph: `I, {{fullName}}, operate as a business owner. My income is derived from clients located outside Portugal, including ${clientNames}.`,
      incomeParagraph: `Over the past ${stabilityMonths} months, my average monthly income has been ${avgIncome}, as evidenced by the attached bank statements, invoices, and client contracts. My work is conducted entirely online and does not depend on physical presence in any single location, allowing me to continue serving my clients while residing in Portugal.`,
      incomeSourceLabel: clientNames,
      reviewWarning: "",
    };
  }

  if (businessIncomeType === "many_clients") {
    // Reuse Feature B's helper
    const freelancerDesc = resolveFreelancerClientDescription(answers);
    const stabilityMonths = str(answers.incomeStabilityMonths, "0");
    const avgIncome = formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    );

    return {
      introParagraph: `I, {{fullName}}, operate as a business owner. My income is derived from ${freelancerDesc.introClientClause}.`,
      incomeParagraph: `Over the past ${stabilityMonths} months, my average monthly income has been ${avgIncome}, as evidenced by the attached bank statements, invoices, and client contracts. My business serves clients located outside Portugal and does not depend on physical presence in any single location, allowing me to continue serving clients while residing in Portugal.`,
      incomeSourceLabel: freelancerDesc.incomeSourceLabel,
      reviewWarning: "",
    };
  }

  if (businessIncomeType === "product_revenue") {
    // SaaS/product revenue narrative
    const productDesc = str(answers.businessProductDescription, "digital products or services");
    const customerCount = answers.businessCustomerCount ?? "multiple";
    const revenueModel = str(answers.businessRevenueModel, "subscription");
    const isRegistered = answers.businessIsRegisteredEntity === true;
    const registeredCountry = str(answers.businessRegisteredCountry, "");
    const registrationNote = isRegistered && registeredCountry ? ` registered in ${registeredCountry}` : "";
    const stabilityMonths = str(answers.incomeStabilityMonths, "0");
    const avgIncome = formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    );

    return {
      introParagraph: `I, {{fullName}}, operate a business developing and selling ${productDesc}${registrationNote}. My business is a ${revenueModel}-based model serving approximately ${customerCount} customers outside Portugal.`,
      incomeParagraph: `Over the past ${stabilityMonths} months, my average monthly revenue has been ${avgIncome}, as documented by bank statements and payment processor records. My product is offered globally and does not depend on physical presence in any single location, allowing me to operate the business while residing in Portugal.`,
      incomeSourceLabel: `Product revenue (${revenueModel})`,
      reviewWarning: "",
    };
  }

  if (businessIncomeType === "creator_revenue") {
    // Content creator narrative
    const platforms = str(answers.creatorPlatforms, "various platforms");
    const incomeType = str(answers.creatorIncomeType, "mixed");
    const stabilityMonths = str(answers.incomeStabilityMonths, "0");
    const avgIncome = formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    );

    return {
      introParagraph: `I, {{fullName}}, operate as an independent content creator. My income is generated from audience engagement on ${platforms} through ${incomeType} channels, with audiences and customers located globally outside Portugal.`,
      incomeParagraph: `Over the past ${stabilityMonths} months, my average monthly income has been ${avgIncome}, as documented by platform statements and payment records. My content is created and distributed globally and does not depend on physical presence in any single location, allowing me to continue my creative work while residing in Portugal.`,
      incomeSourceLabel: `Content creator (${platforms})`,
      reviewWarning: "",
    };
  }

  // Feature C — other/fallback: no invented specifics, warning flag for review
  const rawDesc = str(answers.businessOtherDescription, "business services");
  // Add article if missing: check if starts with vowel sound → "an", else "a"
  const needsArticle = !rawDesc.match(/^(a|an)\s/i);
  const article = needsArticle ? (rawDesc.match(/^[aeiouAEIOU]/) ? "an" : "a") : "";
  const otherDesc = article ? `${article} ${rawDesc}` : rawDesc;
  const stabilityMonths = str(answers.incomeStabilityMonths, "0");
  const avgIncome = formatCurrency(
    Number(answers.monthlyIncome ?? 0),
    str(answers.incomeCurrency, "USD"),
  );
  const disclaimer =
    "⚠️ APPLICANT REVIEW REQUIRED: This narrative was automatically generated from a " +
    "custom business description. Please review it carefully before submission to ensure " +
    "it accurately represents your situation and meets your consulate's expectations. " +
    "If you are uncertain, consult with an immigration advisor.";

  return {
    introParagraph: `I, {{fullName}}, operate ${otherDesc}. My income is derived from activities and customers located outside Portugal.`,
    incomeParagraph: `Over the past ${stabilityMonths} months, my average monthly income has been ${avgIncome}, as documented by supporting financial records. My business is location-independent and does not depend on physical presence in any single location, allowing me to operate while residing in Portugal.`,
    incomeSourceLabel: "[Custom business model]",
    reviewWarning: disclaimer,
  };
}

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
 * per call site. Feature A: includes an optional employment gap clause when
 * the applicant has changed employers recently.
 */
export function mapAnswersToMotivationLetterData(
  answers: Answers,
  opts: { homeCountryLabel: string },
): MotivationLetterData {
  const employmentType = answers.employmentType;

  let employerOrClient = "";
  let employmentDescriptor = "";

  if (employmentType === "employee") {
    // Feature A: use current employer from resolveEmployerHistory
    const history = resolveEmployerHistory(answers);
    employerOrClient = history.current.companyName;
    employmentDescriptor = `at ${employerOrClient}`;
  } else {
    employerOrClient = str(answers.employerOrClientNames, "various clients");
    employmentDescriptor = `as an independent freelancer/contractor serving clients including ${employerOrClient}`;
  }

  const accommodationClause =
    answers.hasAccommodation && answers.accommodationDetails
      ? ` and reside at ${str(answers.accommodationDetails)}`
      : "";

  // Feature A: add employment gap clause if applicable
  const employmentGapClause =
    answers.hasChangedEmployerRecently === true && answers.hadEmploymentGap === true
      ? " I have been continuously employed, with a recent employer transition."
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
    fullName: str(answers.fullLegalName, "Applicant"),
    nationality: opts.homeCountryLabel,
    residingLocation,
    visaFlavorLabel: "Residence",
    jobTitleOrRole: resolveJobTitle(answers),
    employmentDescriptor,
    employmentGapClause,
    intendedMoveDate: formatDate(answers.intendedMoveDate),
    accommodationClause,
    incomeAmountFormatted,
    healthInsuranceClause: answers.hasHealthInsurance
      ? "I have arranged comprehensive health insurance valid in Portugal."
      : "I will provide comprehensive health insurance valid in Portugal as required for this visa.",
    // Falls back to a neutral, non-presumptuous statement when the
    // optional free-text field is blank — never fabricates a specific
    // personal reason. Sanitizes by stripping leading "I " from full sentences,
    // trailing punctuation, and lowercasing the first character. The template
    // uses "because" instead of "for" which works for both noun phrases
    // ("because its quality of life") and verb phrases ("because love the culture").
    personalReason: (() => {
      const provided = str(answers.personalReason);
      if (!provided) return "its quality of life and welcoming community";
      // Strip leading "I " or "I'" (common start to full sentences)
      let sanitized = provided.replace(/^I\s+/i, "").replace(/^I'/i, "");
      // Strip trailing punctuation
      sanitized = sanitized.replace(/[.!?]\s*$/, "");
      // Lowercase first character (works for both user input and dropdown values)
      if (sanitized.length > 0) {
        sanitized = sanitized[0].toLowerCase() + sanitized.slice(1);
      }
      return sanitized || provided;
    })(),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
}

/**
 * Gender isn't collected by the questionnaire (no such question in the
 * spec), so pronouns default to they/them throughout — a neutral,
 * non-presumptuous default, not a guess. This is a draft for the
 * employer's HR/manager to review and sign; they can edit it before
 * sending. Feature A: uses resolveEmployerHistory to extract the current
 * employer when hasChangedEmployerRecently is true.
 */
export function mapAnswersToEmployerConfirmationData(answers: Answers): EmployerConfirmationData {
  const history = resolveEmployerHistory(answers);
  const current = history.current;

  return {
    companyName: current.companyName,
    employeeFullName: str(answers.fullLegalName, "Applicant"),
    jobTitle: current.jobTitle || str(answers.jobTitle, "[job title]"),
    startDate: formatDate(current.startDate.toISOString()),
    remoteDescriptor: "remote",
    pronounSubject: "They",
    pronounSubjectLowercase: "they",
    pronounPossessive: "their",
    pronounVerb: "are",
    amountAndCurrency: formatCurrency(current.monthlyIncome, current.currency),
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  };
}

export function mapAnswersToFreelancerNarrativeData(
  answers: Answers,
  opts: { homeCountryLabel: string },
): FreelancerNarrativeData {
  const employmentType = str(answers.employmentType);
  const fullName = str(answers.fullLegalName, "Applicant");

  let introParagraph = "";
  let incomeParagraph = "";
  let reviewWarning = "";

  if (employmentType === "freelancer") {
    // Feature B — freelancer branch
    const clientDesc = resolveFreelancerClientDescription(answers);
    const stabilityMonths = str(answers.incomeStabilityMonths, "0");
    const avgIncome = formatCurrency(
      Number(answers.monthlyIncome ?? 0),
      str(answers.incomeCurrency, "USD"),
    );

    introParagraph = `I, ${fullName}, operate as an independent freelancer. My income is derived from ${clientDesc.introClientClause}.`;
    incomeParagraph = `Over the past ${stabilityMonths} months, my average monthly income has been ${avgIncome}, as evidenced by the attached bank statements, invoices, and client contracts. My work is conducted entirely online and does not depend on physical presence in any single location, allowing me to continue serving my clients while residing in Portugal.`;
  } else if (employmentType === "business_owner") {
    // Feature C — business owner branch
    const variant = resolveBusinessNarrativeVariant(answers);
    introParagraph = variant.introParagraph.replace("{{fullName}}", fullName);
    incomeParagraph = variant.incomeParagraph;
    reviewWarning = variant.reviewWarning || "";
  }

  return {
    homeCountry: opts.homeCountryLabel,
    fullName,
    introParagraph,
    incomeParagraph,
    reviewWarning: reviewWarning || undefined,
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
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Feature A: employer-switch branch
  if (answers.hasChangedEmployerRecently === true) {
    const history = resolveEmployerHistory(answers);
    const monthHistory = resolveMonthlyIncomeHistory(history, monthsToShow);

    // Cache exchange rates for both employers (at most 2 currencies)
    const currencies = new Set<string>();
    if (history.current) currencies.add(history.current.currency);
    if (history.previous) currencies.add(history.previous.currency);

    const rates = new Map<string, number>();
    for (const currency of currencies) {
      rates.set(currency, await getExchangeRateToEur(currency));
    }

    // Build entries (excluding gap months) and rows (including gap months)
    const entries: Array<{ month: string; amountEur: number; source: string }> = [];
    const rows: IncomeSummaryRow[] = [];

    monthHistory.forEach((mh, index) => {
      if (mh.isGapMonth) {
        // Gap month: no entry for average, but render a row
        rows.push({
          month: mh.month,
          grossIncomeFormatted: "—",
          source: "Employment gap",
          runningAverageFormatted: index === 0 ? "—" : formatCurrency(computeOverallAverage(entries), "EUR"),
        });
      } else if (mh.employer) {
        const rate = rates.get(mh.employer.currency) || 1;
        const amountEur = mh.employer.monthlyIncome * rate;
        const grossFormatted = formatCurrency(mh.employer.monthlyIncome, mh.employer.currency);

        entries.push({
          month: mh.month,
          amountEur,
          source: mh.employer.companyName,
        });

        const runningAvgs = computeRunningAverages(entries);
        rows.push({
          month: mh.month,
          grossIncomeFormatted: grossFormatted,
          source: mh.employer.companyName,
          runningAverageFormatted:
            index === 0 ? "—" : formatCurrency(runningAvgs[runningAvgs.length - 1], "EUR"),
        });
      }
    });

    const average = computeOverallAverage(entries);
    const status = meetsThreshold(average, opts.thresholdEur) ? "met" : "not met";

    // Append gap explanation to conversionNote
    let conversionNote = "";
    if (history.previous) {
      const prevCurrency = history.previous.currency;
      const currCurrency = history.current.currency;
      const prevRate = rates.get(prevCurrency) || 1;
      const currRate = rates.get(currCurrency) || 1;

      conversionNote = `Employment history includes a transition from ${history.previous.companyName} to ${history.current.companyName}. `;

      if (prevCurrency !== currCurrency) {
        conversionNote +=
          `Previous employer income (${prevCurrency}) converted at 1 ${prevCurrency} = ${prevRate.toFixed(4)} EUR; ` +
          `current employer income (${currCurrency}) converted at 1 ${currCurrency} = ${currRate.toFixed(4)} EUR. `;
      } else {
        conversionNote += `Both periods converted at 1 ${currCurrency} = ${currRate.toFixed(4)} EUR. `;
      }

      if (history.hadGap) {
        conversionNote += `Gap month(s) excluded from the running average calculation. `;
      }
      conversionNote += `(European Central Bank reference rates, retrieved ${today}).`;
    } else {
      // history.previous is null: only current employer
      const currCurrency = history.current.currency;
      conversionNote =
        currCurrency === "EUR"
          ? "Reported in EUR — no currency conversion applied."
          : `Converted from ${currCurrency} to EUR at 1 ${currCurrency} = ${(rates.get(currCurrency) || 1).toFixed(4)} EUR ` +
            `(European Central Bank reference rate, retrieved ${today}).`;
    }

    return {
      rows,
      averageFormatted: formatCurrency(average, "EUR"),
      thresholdFormatted: formatCurrency(opts.thresholdEur, "EUR"),
      thresholdStatus: status,
      conversionNote,
    };
  }

  // Default: single employer, no job switch
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
