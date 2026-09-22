import { resolveConfigValue } from "@/lib/config-resolver";
import { CountryConfigKey } from "@/country-config/types";
import type { EligibilityMonthlyIncomeThreshold } from "@/country-config/types";
import { splitFullName } from "./form-fill/derive-overlay-values";
import type { Answers } from "@/questionnaire-engine/types";
import {
  mapAnswersToMotivationLetterData,
  mapAnswersToEmployerConfirmationData,
  mapAnswersToFreelancerNarrativeData,
  mapAnswersToIncomeSummarySheetData,
} from "./generate";
import type { DocumentType } from "@prisma/client";

export interface DocumentPreviewField {
  label: string;
  value: string;
}

export interface DocumentPreviewSection {
  title: string;
  fields: DocumentPreviewField[];
}

const OCCUPATION_LABELS: Record<string, string> = {
  employee: "Employee",
  freelancer: "Freelancer / independent contractor",
  business_owner: "Business owner",
};

/**
 * Free-to-view "confirm your details" data per document type — deliberately
 * NOT the composed letter text. Previewing the actual rendered PDF (as this
 * product briefly did) let anyone read and retype the full letter into
 * their own Word doc without paying; degrading the PDF (blur/watermark/
 * low-res) doesn't fix that either, since the text itself — not the
 * visual — is what's valuable and copyable. Showing only the underlying
 * data points instead leaks nothing beyond what the applicant already
 * typed into the questionnaire themselves, while still letting them
 * verify accuracy before paying — the actual point of a preview.
 *
 * Reuses the same mapper functions and CountryConfig resolution as
 * document-engine/generate-packet.ts so the data shown here always
 * matches what actually gets generated.
 *
 * Takes the application + homeCountryLabel as params rather than
 * re-fetching them: the one caller (checklist/page.tsx) already loads
 * the Application row and resolves the exact same
 * CriminalRecordBranchInstructions config (for its own Bucket-3 display)
 * a few lines earlier — re-fetching both here was two fully redundant DB
 * round trips on every single checklist page load.
 */
export async function getDocumentPreviewData(
  application: { id: string; country: string; visaType: string; answers: unknown },
  homeCountryLabel: string,
): Promise<Partial<Record<DocumentType, DocumentPreviewSection>>> {
  const answers = application.answers as Answers;

  const thresholdResult = await resolveConfigValue<EligibilityMonthlyIncomeThreshold>({
    country: application.country,
    visaType: application.visaType,
    key: CountryConfigKey.EligibilityMonthlyIncomeThreshold,
  });

  const sections: Partial<Record<DocumentType, DocumentPreviewSection>> = {};

  const motivation = mapAnswersToMotivationLetterData(answers, { homeCountryLabel });
  sections.MOTIVATION_LETTER = {
    title: "Motivation letter",
    fields: [
      { label: "Full name", value: motivation.fullName },
      { label: "Nationality", value: motivation.nationality },
      { label: "Currently residing in", value: motivation.residingLocation },
      { label: "Employment", value: `${motivation.jobTitleOrRole} ${motivation.employmentDescriptor}` },
      { label: "Intended move date", value: motivation.intendedMoveDate },
      { label: "Monthly income", value: motivation.incomeAmountFormatted },
      { label: "Reason for choosing Portugal", value: motivation.personalReason },
    ],
  };

  if (answers.employmentType === "employee") {
    const employer = mapAnswersToEmployerConfirmationData(answers);
    sections.EMPLOYER_CONFIRMATION_LETTER = {
      title: "Employer remote-work confirmation letter",
      fields: [
        { label: "Employer", value: employer.companyName },
        { label: "Employee", value: employer.employeeFullName },
        { label: "Job title", value: employer.jobTitle },
        { label: "Monthly income", value: employer.amountAndCurrency },
      ],
    };
  } else {
    const freelancer = mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel });
    sections.FREELANCER_INCOME_NARRATIVE = {
      title: "Freelancer / business income narrative",
      fields: [
        { label: "Role", value: freelancer.roleDescriptor },
        { label: "Clients", value: freelancer.clientNamesOrTypes },
        { label: "Income stability", value: freelancer.stabilityMonths },
        { label: "Average monthly income", value: freelancer.averageMonthlyIncomeFormatted },
      ],
    };
  }

  if (thresholdResult) {
    const incomeSummary = await mapAnswersToIncomeSummarySheetData(answers, {
      thresholdEur: thresholdResult.value.amountEur,
    });
    sections.INCOME_SUMMARY_SHEET = {
      title: "Income summary cover sheet",
      fields: [
        { label: "Reported monthly income", value: incomeSummary.rows[0]?.grossIncomeFormatted ?? "" },
        { label: "6-month average (EUR)", value: incomeSummary.averageFormatted },
        { label: "D8 threshold (EUR)", value: incomeSummary.thresholdFormatted },
        { label: "Meets threshold?", value: incomeSummary.thresholdStatus === "met" ? "Yes" : "No" },
        { label: "Conversion basis", value: incomeSummary.conversionNote },
      ],
    };
  }

  const { surname, givenNames } = splitFullName(answers.fullLegalName as string | undefined);
  sections.NATIONAL_VISA_FORM_PREFILL = {
    title: "National Visa Application Form (pre-filled)",
    fields: [
      { label: "Surname", value: surname },
      { label: "Given name(s)", value: givenNames },
      { label: "Nationality", value: homeCountryLabel },
      { label: "Passport number", value: String(answers.passportNumber ?? "") },
      { label: "Passport expiry", value: String(answers.passportExpiry ?? "") },
      { label: "Occupation", value: OCCUPATION_LABELS[String(answers.employmentType ?? "")] ?? "" },
    ],
  };

  return sections;
}
