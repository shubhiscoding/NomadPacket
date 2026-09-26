import { prisma } from "@/lib/prisma";
import { resolveConfigValue } from "@/lib/config-resolver";
import { getCountryName } from "@/lib/country-mapping";
import { CountryConfigKey } from "@/country-config/types";
import type {
  CriminalRecordBranchInstructions,
  EligibilityMonthlyIncomeThreshold,
  FormFieldMapping,
} from "@/country-config/types";
import { fillForm } from "./form-fill/fill";
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
import { saveDocument, deleteDocument } from "@/lib/storage";
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
  // Use country mapping to convert ISO code to full country name. Falls back to
  // the nationality code if no mapping exists (shouldn't happen, but degrades gracefully).
  const homeCountryLabel = criminalRecordResult?.value.homeCountryLabel ?? getCountryName(nationality);

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

  // Bucket 2 — official form pre-fill. Currently always the STUB mapping
  // (see document-engine/form-fill/README.md); fill.ts is generic and
  // will work identically once the real mapping/asset replace it, no
  // change needed here.
  const formMappingResult = await resolveConfigValue<FormFieldMapping>({
    country: application.country,
    visaType: application.visaType,
    key: CountryConfigKey.FormFillNationalVisaFormMapping,
  });
  if (formMappingResult) {
    documentsToGenerate.push({
      type: "NATIONAL_VISA_FORM_PREFILL",
      buffer: fillForm(formMappingResult.value, answers, process.cwd()),
    });
  }

  // Regenerating overwrites these types' rows below — delete the old
  // stored files/blobs first so they don't leak (orphaned storage with
  // nothing pointing at them, since the DB row that named them is gone).
  const staleDocs = await prisma.generatedDocument.findMany({
    where: { applicationId, type: { in: documentsToGenerate.map((d) => d.type) } },
  });
  await Promise.all(staleDocs.map((doc) => deleteDocument(doc.fileUrl)));

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
