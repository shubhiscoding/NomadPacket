import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/questionnaire-engine/registry";
import { isQuestionnaireComplete } from "@/questionnaire-engine/engine";
import { resolveConfigValue } from "@/lib/config-resolver";
import { CountryConfigKey } from "@/country-config/types";
import type {
  CriminalRecordBranchInstructions,
  FormFieldMapping,
  NifBranchInstructions,
} from "@/country-config/types";
import { checkAccommodation, checkHealthInsurance, checkPassportValidity } from "@/lib/checklist";
import type { Answers } from "@/questionnaire-engine/types";
import { StatusPill } from "@/components/StatusPill";
import { GenerateDocumentsButton } from "./generate-documents-button";
import { DeliveryActions } from "./delivery-actions";
import type { DocumentType } from "@prisma/client";

const BUCKET_1_2_LABELS: Record<DocumentType, string> = {
  MOTIVATION_LETTER: "Motivation letter",
  EMPLOYER_CONFIRMATION_LETTER: "Employer remote-work confirmation letter",
  FREELANCER_INCOME_NARRATIVE: "Freelancer / business income narrative",
  INCOME_SUMMARY_SHEET: "Income summary cover sheet",
  NATIONAL_VISA_FORM_PREFILL: "National Visa Application Form (pre-filled)",
};

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) notFound();

  const answers = application.answers as Answers;
  const config = getQuestionnaireConfig(application.country, application.visaType);
  const questionnaireComplete = config ? isQuestionnaireComplete(config, answers) : false;

  const generatedDocuments = await prisma.generatedDocument.findMany({
    where: { applicationId: id },
    orderBy: { generatedAt: "desc" },
  });
  const generatedByType = new Map(generatedDocuments.map((d) => [d.type, d]));

  // Only the branch relevant to this employmentType is expected — the
  // other letter type in BUCKET_1_2_LABELS just never appears.
  const expectedTypes: DocumentType[] =
    answers.employmentType === "employee"
      ? ["MOTIVATION_LETTER", "EMPLOYER_CONFIRMATION_LETTER", "INCOME_SUMMARY_SHEET", "NATIONAL_VISA_FORM_PREFILL"]
      : ["MOTIVATION_LETTER", "FREELANCER_INCOME_NARRATIVE", "INCOME_SUMMARY_SHEET", "NATIONAL_VISA_FORM_PREFILL"];

  const nationality = String(answers.nationality ?? "");
  const [criminalRecordResult, nifResult, formMappingResult] = await Promise.all([
    resolveConfigValue<CriminalRecordBranchInstructions>({
      country: application.country,
      visaType: application.visaType,
      homeCountry: nationality,
      key: CountryConfigKey.BranchCriminalRecordInstructions,
    }),
    resolveConfigValue<NifBranchInstructions>({
      country: application.country,
      visaType: application.visaType,
      key: CountryConfigKey.BranchNifInstructions,
    }),
    resolveConfigValue<FormFieldMapping>({
      country: application.country,
      visaType: application.visaType,
      key: CountryConfigKey.FormFillNationalVisaFormMapping,
    }),
  ]);

  const passportCheck = checkPassportValidity({
    passportExpiry: answers.passportExpiry as string | undefined,
    intendedMoveDate: answers.intendedMoveDate as string | undefined,
  });
  const accommodationCheck = checkAccommodation({ hasAccommodation: Boolean(answers.hasAccommodation) });
  const healthInsuranceCheck = checkHealthInsurance({
    hasHealthInsurance: Boolean(answers.hasHealthInsurance),
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-stone-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Your document packet</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Everything you need for your Portugal D8 residence visa application, in one place.
      </p>

      {/* Bucket 1 + 2 — documents we write for you */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Documents we generate for you
        </h2>

        {!questionnaireComplete && (
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Finish the questionnaire before generating your documents.
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {expectedTypes.map((type) => {
            const doc = generatedByType.get(type);
            const isStubForm = type === "NATIONAL_VISA_FORM_PREFILL" && formMappingResult?.value.isStub;
            return (
              <div
                key={type}
                className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">{BUCKET_1_2_LABELS[type]}</p>
                  {isStubForm && (
                    <p className="text-xs text-amber-700">Preview only — sample form, not final</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {doc && (
                    <a
                      href={`/api/applications/${id}/documents/${doc.id}/preview`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-teal-800 hover:underline"
                    >
                      Preview
                    </a>
                  )}
                  <StatusPill status={doc ? "done" : "action_needed"} />
                </div>
              </div>
            );
          })}
        </div>

        {questionnaireComplete && (
          <div className="mt-4">
            <GenerateDocumentsButton applicationId={id} />
          </div>
        )}

        {generatedDocuments.length > 0 && (
          <div className="mt-6 border-t border-stone-100 pt-6">
            <DeliveryActions applicationId={id} />
          </div>
        )}
      </section>

      {/* Bucket 3 — self-sourced documents, with guidance */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Documents you&apos;ll need to gather
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          <ChecklistItem title="Passport" status={passportCheck.status} description={passportCheck.message} />
          <ChecklistItem
            title="Passport photos"
            status="action_needed"
            description="Standard passport-photo size and format — check current requirements with your consulate."
          />
          <ChecklistItem
            title="Bank statements / contracts / invoices"
            status="action_needed"
            description="Gather 6 months of statements or invoices highlighting your monthly income, to support the income summary sheet above."
          />
          <ChecklistItem
            title="Health insurance"
            status={healthInsuranceCheck.status}
            description={healthInsuranceCheck.message}
          />
          <ChecklistItem
            title="Criminal record certificate"
            status="action_needed"
            description={
              criminalRecordResult
                ? `${criminalRecordResult.value.issuingAuthority}. ${criminalRecordResult.value.howToObtain[0]} ${criminalRecordResult.value.legalizationInstructions}`
                : "Nationality not set yet — answer the questionnaire to see country-specific guidance."
            }
          />
          <ChecklistItem
            title="Proof of accommodation"
            status={accommodationCheck.status}
            description={accommodationCheck.message}
          />
          <ChecklistItem
            title="NIF (Portuguese tax number)"
            status="action_needed"
            description={nifResult?.value.explanation ?? ""}
          />
          <ChecklistItem
            title="Visa fee payment proof"
            status="action_needed"
            description="Confirm the current D8 visa fee and accepted payment methods with your consulate — these vary by location."
          />
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-stone-400">
        This tool assembles documents based on publicly available Portuguese consulate and AIMA
        requirements. It does not provide legal advice and cannot guarantee visa approval — no
        service can. Requirements vary by consulate and may change; always confirm current
        requirements with your nearest Portuguese consulate or an immigration lawyer, particularly
        if your situation involves a criminal record, prior visa refusals, or unusual income
        sources.
      </p>
    </main>
  );
}

function ChecklistItem({
  title,
  status,
  description,
}: {
  title: string;
  status: "done" | "action_needed" | "optional";
  description: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <StatusPill status={status} />
      </div>
      {description && <p className="mt-1 text-xs leading-relaxed text-stone-500">{description}</p>}
    </div>
  );
}
