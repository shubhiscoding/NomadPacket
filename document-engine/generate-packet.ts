import { prisma } from "@/lib/prisma";
import { resolveConfigValue } from "@/lib/config-resolver";
import { CountryConfigKey } from "@/country-config/types";
import type {
  CriminalRecordBranchInstructions,
  EligibilityMonthlyIncomeThreshold,
} from "@/country-config/types";
import type { Answers } from "@/questionnaire-engine/types";
import {
  mapAnswersToMotivationLetterData,
  mapAnswersToEmployerConfirmationData,
  mapAnswersToFreelancerNarrativeData,
  mapAnswersToIncomeSummarySheetData,
} from "./generate";
import {
  renderMotivationLetterPdf,
  renderEmployerConfirmationPdf,
  renderFreelancerNarrativePdf,
  renderIncomeSummarySheetPdf,
} from "./letters/render-to-pdf";
import { saveDocument } from "@/lib/storage";
import type { DocumentType } from "@prisma/client";

/**
 * Generates every Bucket-1 letter this application needs (motivation
 * letter + income summary always; employer confirmation OR freelancer
 * narrative depending on the employmentType branch — never both), and
 * persists them as GeneratedDocument rows. Regenerating an application
 * (e.g. after an answer changes) replaces its existing rows rather than
 * accumulating duplicates.
 *
 * All eligibility/legal numbers are resolved fresh from CountryConfig here
 * — never trusted from anything the client computed (AGENTS.md §4).
 */
export async function generateApplicationDocuments(applicationId: string): Promise<void> {
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
  });
  const answers = application.answers as Answers;

  const thresholdResult = await resolveConfigValue<EligibilityMonthlyIncomeThreshold>({
    country: application.country,
    visaType: application.visaType,
    key: CountryConfigKey.EligibilityMonthlyIncomeThreshold,
  });
  if (!thresholdResult) {
    throw new Error(
      `No eligibility.monthlyIncomeThreshold config for ${application.country}/${application.visaType} — has the database been seeded?`,
    );
  }

  const nationality = String(answers.nationality ?? "");
  const criminalRecordResult = await resolveConfigValue<CriminalRecordBranchInstructions>({
    country: application.country,
    visaType: application.visaType,
    homeCountry: nationality,
    key: CountryConfigKey.BranchCriminalRecordInstructions,
  });
  // Falls back to the raw nationality code if no branch config matches
  // (shouldn't happen for US/UK/CA, but degrades gracefully rather than
  // throwing if an unexpected value slips through).
  const homeCountryLabel = criminalRecordResult?.value.homeCountryLabel ?? nationality;

  const documentsToGenerate: Array<{ type: DocumentType; buffer: Promise<Buffer> }> = [];

  documentsToGenerate.push({
    type: "MOTIVATION_LETTER",
    buffer: renderMotivationLetterPdf(
      mapAnswersToMotivationLetterData(answers, { homeCountryLabel }),
    ),
  });

  if (answers.employmentType === "employee") {
    documentsToGenerate.push({
      type: "EMPLOYER_CONFIRMATION_LETTER",
      buffer: renderEmployerConfirmationPdf(mapAnswersToEmployerConfirmationData(answers)),
    });
  } else {
    documentsToGenerate.push({
      type: "FREELANCER_INCOME_NARRATIVE",
      buffer: renderFreelancerNarrativePdf(
        mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel }),
      ),
    });
  }

  documentsToGenerate.push({
    type: "INCOME_SUMMARY_SHEET",
    buffer: renderIncomeSummarySheetPdf(
      await mapAnswersToIncomeSummarySheetData(answers, {
        thresholdEur: thresholdResult.value.amountEur,
      }),
    ),
  });

  await prisma.generatedDocument.deleteMany({
    where: { applicationId, type: { in: documentsToGenerate.map((d) => d.type) } },
  });

  for (const doc of documentsToGenerate) {
    const buffer = await doc.buffer;
    const key = `${applicationId}/${doc.type}.pdf`;
    await saveDocument(key, buffer);
    await prisma.generatedDocument.create({
      data: { applicationId, type: doc.type, fileUrl: key },
    });
  }
}
