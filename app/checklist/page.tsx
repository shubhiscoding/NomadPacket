import type { Metadata } from "next";
import Link from "next/link";
import { getD8EligibilityFigures } from "@/lib/marketing-content-data";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

// Revalidate periodically rather than on every request — this is public
// marketing content, but it still reads live eligibility figures from
// CountryConfig (never hardcoded), so a January threshold update reaches
// this page without a redeploy, just with a short delay.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portugal D8 Visa Checklist 2026: Every Document You Need",
  description:
    "The complete Portugal D8 residence visa document checklist for 2026 — what you write, " +
    "what gets pre-filled, and what you gather yourself, with US/UK/Canada-specific guidance.",
  alternates: { canonical: canonicalUrl("/checklist") },
  openGraph: {
    title: "Portugal D8 Visa Checklist 2026: Every Document You Need",
    description:
      "The complete document checklist for Portugal's D8 residence visa, with " +
      "country-specific guidance for US, UK, and Canadian applicants.",
    url: canonicalUrl("/checklist"),
    type: "article",
  },
};

export default async function PublicChecklistPage() {
  const { threshold, dependents } = await getD8EligibilityFigures();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal D8 Residence Visa</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        The Complete Portugal D8 Visa Document Checklist
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        Every document a US, UK, or Canadian applicant needs for Portugal&apos;s D8
        residence visa falls into three buckets: documents a tool can write for you,
        one official form that gets pre-filled from the same answers, and a handful of
        documents only you can obtain. Here&apos;s the full list, current for
        {threshold ? " 2026" : ""}.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Eligibility, at a glance</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>18 or older, with a passport valid for the intended stay</li>
          {threshold && (
            <li>
              Monthly income of at least{" "}
              <strong className="text-stone-900">
                €{threshold.amountEur.toLocaleString("en-US")}
              </strong>{" "}
              (pegged to 4× Portugal&apos;s minimum wage — this figure is re-checked
              every January)
              {dependents && (
                <>
                  {" "}
                  — add {dependents.spousePercent}% for a spouse and {dependents.childPercent}%
                  per child, calculated against Portugal&apos;s minimum wage.
                </>
              )}
            </li>
          )}
          <li>Income that&apos;s foreign-sourced: employed, freelance, or business income earned outside Portugal</li>
          <li>Comprehensive health insurance covering your stay</li>
          <li>A clean criminal record certificate from your home country</li>
          <li>Proof of accommodation in Portugal</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          Bucket 1 — documents written for you
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          These four documents are generated from your answers to a single questionnaire —
          you write nothing from scratch.
        </p>
        <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-stone-600">
          <li>
            <strong className="text-stone-900">Motivation letter</strong> — explains why
            you&apos;re relocating, confirms your work is location-independent, and states
            your intended timeline. See a{" "}
            <Link href="/resources/motivation-letter-sample" className="text-teal-800 underline">
              real example
            </Link>
            .
          </li>
          <li>
            <strong className="text-stone-900">Employer remote-work confirmation letter</strong>{" "}
            — for employees: confirms your employer, role, and that remote work from
            Portugal is permitted. See{" "}
            <Link href="/resources/employer-letter-sample" className="text-teal-800 underline">
              a sample and a script for asking HR
            </Link>
            .
          </li>
          <li>
            <strong className="text-stone-900">Freelancer/business income narrative</strong> —
            used instead of the employer letter if you&apos;re self-employed: describes your
            client base, income stability, and business structure.
          </li>
          <li>
            <strong className="text-stone-900">Income summary cover sheet</strong> — a clean
            one-page table showing your monthly income against the threshold above, the exact
            format consulates want instead of raw bank statements.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          Bucket 2 — the official form, pre-filled
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Portugal&apos;s National Visa Application Form (Formulário de Pedido de Visto
          Nacional) is a standard, three-page government form. Filling it out by hand means
          re-entering everything from your other documents — a tool that already has your
          answers can pre-fill it instead.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          Bucket 3 — what you gather yourself
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          No tool can obtain these for you, but exactly how you get them differs by home
          country — see the dedicated guide for{" "}
          <Link href="/us" className="text-teal-800 underline">
            US
          </Link>
          ,{" "}
          <Link href="/uk" className="text-teal-800 underline">
            UK
          </Link>
          , or{" "}
          <Link href="/ca" className="text-teal-800 underline">
            Canadian
          </Link>{" "}
          applicants.
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>Passport (with enough validity remaining) and passport-sized photos</li>
          <li>Bank statements, contracts, or invoices covering several months of income</li>
          <li>A health insurance policy meeting Portugal&apos;s minimum coverage rules</li>
          <li>
            A criminal record certificate — the specific issuing authority and legalization
            steps vary by home country
          </li>
          <li>Proof of accommodation: a rental agreement or hotel booking</li>
          <li>
            A NIF (Portuguese tax number) — see the{" "}
            <Link href="/resources/nif-guide" className="text-teal-800 underline">
              full NIF guide
            </Link>
          </li>
          <li>Proof of visa fee payment</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "How much income do I need for the D8 visa?",
                answer: threshold
                  ? `As of 2026, the D8 visa requires average monthly income of at least €${threshold.amountEur.toLocaleString("en-US")} (4x Portugal's minimum wage). Consulates increasingly want a 6-month average above this figure.`
                  : "The D8 visa requires average monthly income at least 4x Portugal's minimum wage — check the current figure with your consulate, since it updates every January.",
              },
              {
                question: "Do I need a lawyer to apply for the D8 visa?",
                answer:
                  "Not necessarily — most of the D8 process is document assembly against published requirements, which is what this checklist and NomadPacket's generator are for. A lawyer becomes more valuable if your situation involves a criminal record, a prior visa refusal, or unusual income sources.",
              },
              {
                question: "How is the D8 visa different from the D7 visa?",
                answer:
                  "The D7 visa is for passive/retirement income (pensions, rental income, dividends); the D8 is specifically for remote workers and freelancers with active foreign-sourced income. The income threshold and required letters differ accordingly.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta />
      <Disclaimer />
    </main>
  );
}
