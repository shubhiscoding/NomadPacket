import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { countryPagesConfig, getCountryPageConfig } from "@/lib/country-pages-config";
import {
  getCriminalRecordInstructions,
  getD8EligibilityFigures,
  getNifInstructions,
} from "@/lib/marketing-content-data";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const revalidate = 3600;

/**
 * seo.md §3 Phase 2 — "the single highest-leverage content investment":
 * one genuinely different landing page per home country, built almost
 * entirely from country-config/portugal/criminal-record-branches/ data
 * that already exists (and is already sourced/verified) for the product
 * itself. Statically generated at build time for all 3 home countries via
 * generateStaticParams — not three near-duplicate files.
 */
export function generateStaticParams() {
  return countryPagesConfig.map((c) => ({ homeCountry: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ homeCountry: string }>;
}): Promise<Metadata> {
  const { homeCountry } = await params;
  const config = getCountryPageConfig(homeCountry);
  if (!config) return {};

  const title = `Portugal D8 Visa from ${config.label}: Complete Guide (2026)`;
  const description = `Everything a ${config.label} applicant needs for Portugal's D8 residence visa — income requirements, criminal record certificate process, apostille steps, and NIF guidance.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/${config.slug}`) },
    openGraph: { title, description, url: canonicalUrl(`/${config.slug}`), type: "article" },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ homeCountry: string }>;
}) {
  const { homeCountry } = await params;
  const config = getCountryPageConfig(homeCountry);
  if (!config) notFound();

  const [criminalRecord, nif, { threshold }] = await Promise.all([
    getCriminalRecordInstructions(config.homeCountryCode),
    getNifInstructions(),
    getD8EligibilityFigures(),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal D8 Residence Visa</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        Portugal D8 Visa Guide for Applicants from {config.label}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        The D8 process is largely the same regardless of where you&apos;re applying from —
        except for one document that varies significantly by home country: your criminal
        record certificate. Here&apos;s exactly what applicants from {config.label} need,
        start to finish.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Income requirement</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {threshold
            ? `Same for every applicant regardless of home country: at least €${threshold.amountEur.toLocaleString("en-US")} in average monthly income, foreign-sourced and remote.`
            : "Average monthly income at least 4x Portugal's minimum wage, foreign-sourced and remote — see the full checklist for the current figure."}{" "}
          See the{" "}
          <Link href="/checklist" className="text-teal-800 underline">
            full document checklist
          </Link>{" "}
          for the complete eligibility picture.
        </p>
      </section>

      {criminalRecord && (
        <section className="mt-10">
          <h2 className="text-xl font-medium text-stone-900">
            Criminal record certificate: {config.label}-specific process
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            <strong className="text-stone-900">Issuing authority:</strong>{" "}
            {criminalRecord.issuingAuthority}
          </p>
          <ol className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
            {criminalRecord.howToObtain.map((step, i) => (
              <li key={step} className="list-decimal pl-1">
                {i === 0 && <strong className="text-stone-900">How to obtain it: </strong>}
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            <strong className="text-stone-900">Legalization: </strong>
            {criminalRecord.legalizationInstructions}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            <strong className="text-stone-900">Translation: </strong>
            {criminalRecord.translationNote}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            <strong className="text-stone-900">Freshness rule: </strong>
            Most consulates want this certificate issued within {criminalRecord.freshnessRuleDays}{" "}
            days of your application — don&apos;t get it too early.
          </p>
          {criminalRecord.submissionChannelNote && (
            <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              {criminalRecord.submissionChannelNote}
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">NIF (Portuguese tax number)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {nif?.explanation}{" "}
          {nif?.needsFiscalRepresentative &&
            `As a non-EU applicant from ${config.label}, you'll typically need a fiscal representative in Portugal to obtain one before arrival.`}{" "}
          See the{" "}
          <Link href="/resources/nif-guide" className="text-teal-800 underline">
            full NIF guide
          </Link>{" "}
          for the exact remote routes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: `How long does the D8 visa process take from ${config.label}?`,
                answer:
                  "Timelines vary by consulate and season, but most applicants budget several months end-to-end: gathering documents (including the criminal record certificate, which itself can take weeks), the consulate appointment, and processing time after submission.",
              },
              {
                question: `Do I need to apostille my criminal record certificate as a ${config.label} applicant?`,
                answer: criminalRecord?.isHagueApostilleMember
                  ? `Yes — ${config.label} is a member of the Hague Apostille Convention, so an apostille (not full consular legalization) is the correct step.`
                  : "This depends on whether your home country is a Hague Apostille Convention member — check the specific guidance above.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading={`Start your D8 packet as a ${config.label} applicant`}
        body="NomadPacket generates your motivation letter, income summary, and pre-filled visa form — and shows this exact country-specific guidance on your personal checklist."
      />
      <Disclaimer />
    </main>
  );
}
