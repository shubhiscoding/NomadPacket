import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/auth/current-user";
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
import { Disclaimer } from "@/components/Disclaimer";
import { DeliveryActions } from "./delivery-actions";
import { DocumentPreviewButton } from "./document-preview-button";
import { hasEntitlement } from "@/entitlement/guard";
import { generateApplicationDocuments } from "@/document-engine/generate-packet";
import { getDocumentPreviewData } from "@/document-engine/preview-data";
import { checkRateLimit, consumeRateLimit, retryAfterMinutes } from "@/lib/rate-limit";
import { RateLimitNotice } from "@/components/RateLimitNotice";
import type { DocumentType } from "@prisma/client";

const REGENERATE_RATE_LIMIT = { max: 5, windowMs: 30 * 60 * 1000 };

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
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) notFound();

  const answers = application.answers as Answers;
  const config = getQuestionnaireConfig(application.country, application.visaType);
  const questionnaireComplete = config ? isQuestionnaireComplete(config, answers) : false;

  const [initialGeneratedDocuments, isPaid] = await Promise.all([
    prisma.generatedDocument.findMany({
      where: { applicationId: id },
      orderBy: { generatedAt: "desc" },
    }),
    hasEntitlement(id),
  ]);
  let generatedDocuments = initialGeneratedDocuments;

  // Documents regenerate automatically instead of needing a manual
  // button: missing entirely (first completion, or a PAID application
  // whose files the 30-day retention cron already deleted — regenerating
  // is free forever once paid, see entitlement/guard.ts), or stale
  // relative to an answer edited since the last generation. Answers are
  // only editable pre-payment (see the card below), so staleness can
  // only happen in the unpaid state.
  //
  // Regeneration itself costs real compute (PDF rendering, FX API calls),
  // so it's rate-limited (5 per 30 min, sliding window) — checked with
  // consumeRateLimit only at the moment regeneration would actually run,
  // never on a plain page view. If blocked, skip regeneration gracefully
  // and keep showing whatever documents already exist rather than
  // erroring — a stale document is far better UX than a broken page.
  const isStale = generatedDocuments.some((doc) => doc.generatedAt < application.updatedAt);
  const needsRegeneration =
    questionnaireComplete && (generatedDocuments.length === 0 || (!isPaid && isStale));

  let regenRateLimit = await checkRateLimit(`regenerate:${id}`, REGENERATE_RATE_LIMIT);
  if (needsRegeneration) {
    regenRateLimit = await consumeRateLimit(`regenerate:${id}`, REGENERATE_RATE_LIMIT);
    if (regenRateLimit.allowed) {
      await generateApplicationDocuments(id);
      generatedDocuments = await prisma.generatedDocument.findMany({
        where: { applicationId: id },
        orderBy: { generatedAt: "desc" },
      });
    }
  }

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

  const homeCountryLabel = criminalRecordResult?.value.homeCountryLabel ?? nationality;
  const previewData = questionnaireComplete
    ? await getDocumentPreviewData(application, homeCountryLabel)
    : {};

  const passportCheck = checkPassportValidity({
    passportExpiry: answers.passportExpiry as string | undefined,
    intendedMoveDate: answers.intendedMoveDate as string | undefined,
  });
  const accommodationCheck = checkAccommodation({ hasAccommodation: Boolean(answers.hasAccommodation) });
  const healthInsuranceCheck = checkHealthInsurance({
    hasHealthInsurance: Boolean(answers.hasHealthInsurance),
  });

  // Only counts items this page can actually verify — the generated
  // documents plus the three dynamically-computed Bucket-3 checks.
  // Deliberately excludes the five Bucket-3 items with no real signal
  // (passport photos, bank statements, criminal record, NIF, visa fee):
  // those always render "Action Needed" below, which is honest, but
  // folding them into this fraction would imply the app is tracking
  // something it has no way to actually know.
  const documentsGeneratedCount = expectedTypes.filter((type) => generatedByType.has(type)).length;
  const trackedDone =
    documentsGeneratedCount +
    (passportCheck.status === "done" ? 1 : 0) +
    (accommodationCheck.status === "done" ? 1 : 0) +
    (healthInsuranceCheck.status === "done" ? 1 : 0);
  const trackedTotal = expectedTypes.length + 3;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-stone-500">NomadPacket</p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/application/history?from=${id}`}
            className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            My documents
          </Link>
          {generatedDocuments.length === 0 ? (
            <span
              aria-disabled="true"
              title="Generate your documents first"
              className="inline-flex items-center rounded-full border border-stone-100 px-3 py-1 text-xs font-medium text-stone-300"
            >
              Fill new form
            </span>
          ) : (
            <Link
              href="/start?new=1"
              className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              Fill new form
            </Link>
          )}
        </div>
      </div>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Your document packet</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Everything you need for your Portugal D8 residence visa application, in one place.
      </p>

      {/* Progress summary — only counts what's genuinely verifiable, see
          trackedDone/trackedTotal above. */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-medium text-stone-500">
          <span>Overall progress</span>
          <span>
            {trackedDone} of {trackedTotal} complete
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-teal-700 transition-all"
            style={{ width: `${(trackedDone / trackedTotal) * 100}%` }}
          />
        </div>
      </div>

      {/* The one thing to do next — consolidates what used to be a
          separate "finish questionnaire" banner, a manual generate/
          regenerate button, and DeliveryActions each rendered inline
          further down the page. Documents themselves now always
          regenerate automatically (see the staleness check above) rather
          than needing a button click at all — editing an answer and
          coming back here is enough. Editing is only offered while
          unpaid; once paid, the answers (and the documents built from
          them) are locked in, matching what was actually purchased. */}
      <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 px-5 py-4">
        {!questionnaireComplete ? (
          <>
            <p className="text-sm font-medium text-stone-900">Finish your questionnaire</p>
            <p className="mt-1 text-sm text-stone-600">
              Answer the remaining questions to generate your documents.
            </p>
            <Link
              href={`/application/${id}/questionnaire`}
              className="mt-3 inline-flex items-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
            >
              Continue questionnaire
            </Link>
          </>
        ) : !isPaid ? (
          <>
            <p className="text-sm font-medium text-stone-900">Your documents are ready</p>
            <p className="mt-1 text-sm text-stone-600">
              Review the details used in each one below, then pay once to unlock the download.
              Edit your answers any time before paying — documents update automatically.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DeliveryActions applicationId={id} isPaid={false} />
              <Link
                href={`/application/${id}/questionnaire`}
                className="text-sm font-medium text-stone-600 hover:underline"
              >
                Edit answers
              </Link>
            </div>
            {!regenRateLimit.allowed ? (
              <div className="mt-2">
                <RateLimitNotice tone="blocked">
                  You&apos;ve hit the edit limit for now — the documents below are from your last
                  edit. Try again in {retryAfterMinutes(regenRateLimit.retryAfterMs)} minute(s).
                </RateLimitNotice>
              </div>
            ) : (
              regenRateLimit.remaining <= 2 && (
                <div className="mt-2">
                  <RateLimitNotice>
                    {regenRateLimit.remaining} edit{regenRateLimit.remaining === 1 ? "" : "s"} left
                    before a short cooldown.
                  </RateLimitNotice>
                </div>
              )
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-stone-900">Your packet is ready</p>
            <p className="mt-1 text-sm text-stone-600">
              Download your complete packet as a ZIP whenever you need it.
            </p>
            <div className="mt-3">
              <DeliveryActions applicationId={id} isPaid={true} />
            </div>
          </>
        )}
      </div>

      {/* Bucket 1 + 2 — documents we write for you */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Documents we generate for you
          </h2>
          <span className="text-xs font-medium text-stone-400">
            {documentsGeneratedCount}/{expectedTypes.length} generated
          </span>
        </div>

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
                  {previewData[type] && (
                    <DocumentPreviewButton
                      title={previewData[type]!.title}
                      fields={previewData[type]!.fields}
                    />
                  )}
                  <StatusPill status={doc ? "done" : "action_needed"} />
                </div>
              </div>
            );
          })}
        </div>
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
                ? [
                    criminalRecordResult.value.issuingAuthority,
                    criminalRecordResult.value.howToObtain[0],
                    criminalRecordResult.value.legalizationInstructions,
                    criminalRecordResult.value.translationNote,
                    criminalRecordResult.value.submissionChannelNote,
                  ].filter((line): line is string => Boolean(line))
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

      <Disclaimer />
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
  description: string | string[];
}) {
  const lines = Array.isArray(description) ? description.filter(Boolean) : description ? [description] : [];

  return (
    <div className="rounded-lg border border-stone-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <StatusPill status={status} />
      </div>
      {lines.length > 0 &&
        (lines.length === 1 ? (
          <p className="mt-1 text-xs leading-relaxed text-stone-500">{lines[0]}</p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-1">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-stone-500">
                <span className="text-stone-300">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
