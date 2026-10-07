import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Portugal Digital Nomad Visa: D8 Residence Visa vs Other Routes",
  description: "Understand Portugal's digital nomad visa options: D8 residence visa for remote workers, D7 for passive income, temporary-stay visa. Eligibility, requirements, and how to choose.",
  alternates: { canonical: canonicalUrl("/resources/portugal-digital-nomad-visa") },
  openGraph: {
    title: "Portugal Digital Nomad Visa: D8 vs D7 vs Temporary Stay",
    description: "Compare Portugal's visa routes for remote workers and understand which one fits your situation.",
    url: canonicalUrl("/resources/portugal-digital-nomad-visa"),
    type: "article",
  },
};

export default function PortugalDigitalNomadVisaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal Visa Routes</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        Portugal Digital Nomad Visa: D8, D7, and Temporary-Stay Options
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>Portugal offers multiple visa routes for remote workers, but they're different and not interchangeable.</strong> The D8 residence visa (the "digital nomad visa") is designed for remote workers with active foreign-sourced income. This guide clarifies which route fits your situation and why choosing the wrong one wastes time and money.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">The three main routes for remote workers</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Portugal offers three different visa paths for people who want to live in the country without working for a Portuguese employer:
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
            <h3 className="font-semibold text-stone-900">D8 Residence Visa (Active Remote Income)</h3>
            <p className="mt-2 text-sm text-stone-700">
              <strong>For:</strong> Remote workers, freelancers, business owners with active foreign-sourced income.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Key requirement:</strong> Minimum monthly income of €3,680 (roughly 4× Portugal's minimum wage).
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Duration:</strong> 1-year renewable residence visa (enables permanent residency if renewed consistently).
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Process:</strong> 3–5 months from start to approval (the approach this site covers).
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="font-semibold text-stone-900">D7 Passive-Income Visa</h3>
            <p className="mt-2 text-sm text-stone-700">
              <strong>For:</strong> People with passive income (pensions, rental income, dividends, interest) who don't work.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Key requirement:</strong> Minimum monthly passive income of €1,081 (roughly 1.18× Portugal's minimum wage).
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Duration:</strong> 1-year renewable residence visa.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Process:</strong> Similar timeline to D8, but a fundamentally different application (not covered here).
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">Type D Short-Stay Visa (Temporary Stay)</h3>
            <p className="mt-2 text-sm text-stone-700">
              <strong>For:</strong> Short-term visitors who want to stay up to 120 days per year without establishing residency.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Key requirement:</strong> Usually just proof of accommodation and funds for your stay; income isn't verified.
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Duration:</strong> 1 year, valid for 120 cumulative days (doesn't establish residency).
            </p>
            <p className="mt-2 text-sm text-stone-700">
              <strong>Process:</strong> Simpler paperwork; typically 1–2 months.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">D8 vs D7: The critical difference</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The most common confusion is between D8 and D7. Here's why they matter:
        </p>

        <div className="mt-4 rounded-lg border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">Aspect</th>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">D8 (Remote Income)</th>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">D7 (Passive Income)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="px-4 py-2 text-stone-700">Income type</td>
                <td className="px-4 py-2 text-stone-700">Active (employment, freelance work, business)</td>
                <td className="px-4 py-2 text-stone-700">Passive (pensions, dividends, rental income, interest)</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="px-4 py-2 text-stone-700">Minimum monthly income</td>
                <td className="px-4 py-2 text-stone-700">€3,680 (4× minimum wage)</td>
                <td className="px-4 py-2 text-stone-700">€1,081 (1.18× minimum wage)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-stone-700">Proof required</td>
                <td className="px-4 py-2 text-stone-700">Employment letter, contracts, invoices, payslips, tax returns</td>
                <td className="px-4 py-2 text-stone-700">Pension statements, bank statements, property deeds, investment statements</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="px-4 py-2 text-stone-700">Can you work in Portugal?</td>
                <td className="px-4 py-2 text-stone-700">Yes, for foreign employer/clients only</td>
                <td className="px-4 py-2 text-stone-700">No (passive income only, no active work)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-stone-700">Application complexity</td>
                <td className="px-4 py-2 text-stone-700">More complex (income verification, employer letters)</td>
                <td className="px-4 py-2 text-stone-700">Simpler (straightforward income proofs)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          <strong>Critical rule:</strong> If you work remotely for an employer or clients (even if you're a freelancer and don't have a traditional "job"), you need the D8, not D7. Using D7 when you have active income will result in a visa denial. Do not apply for the wrong route to take advantage of the lower income threshold.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">D8 vs Temporary-Stay: Residency matters</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The temporary-stay visa (often called "tourist visa" or "digital nomad visa" in casual use, which is confusing) lets you visit for up to 120 days per year but doesn't establish residency. The D8 establishes full residency.
        </p>

        <div className="mt-4 rounded-lg border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">Aspect</th>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">D8 Residence</th>
                <th className="px-4 py-2 text-left font-semibold text-stone-900">Temporary-Stay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="px-4 py-2 text-stone-700">Residency status</td>
                <td className="px-4 py-2 text-stone-700">Full residency (you are a resident of Portugal)</td>
                <td className="px-4 py-2 text-stone-700">No residency (you are a visitor)</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="px-4 py-2 text-stone-700">Days per year allowed</td>
                <td className="px-4 py-2 text-stone-700">Unlimited (full-time residency)</td>
                <td className="px-4 py-2 text-stone-700">120 days per calendar year</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-stone-700">Can open a Portuguese bank account?</td>
                <td className="px-4 py-2 text-stone-700">Yes (required for many things)</td>
                <td className="px-4 py-2 text-stone-700">Difficult without residency</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="px-4 py-2 text-stone-700">Can rent an apartment?</td>
                <td className="px-4 py-2 text-stone-700">Yes, long-term leases available</td>
                <td className="px-4 py-2 text-stone-700">Only short-term rentals (Airbnb, hotels)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-stone-700">Tax implications</td>
                <td className="px-4 py-2 text-stone-700">You become tax-resident (must file Portuguese taxes)</td>
                <td className="px-4 py-2 text-stone-700">No tax residency status</td>
              </tr>
              <tr className="bg-stone-50">
                <td className="px-4 py-2 text-stone-700">For whom?</td>
                <td className="px-4 py-2 text-stone-700">People moving to Portugal long-term</td>
                <td className="px-4 py-2 text-stone-700">People visiting for a few months per year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">How to choose: A simple flowchart</h2>
        <div className="mt-4 space-y-3 text-sm text-stone-600">
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="font-semibold text-stone-900">1. Do you have passive income (pension, rental, dividends)?</p>
            <p className="mt-2">
              <strong>If YES (only):</strong> Check if it's ≥€1,081/month. If so, you might use D7 instead (separate process, not covered here).
            </p>
            <p className="mt-1">
              <strong>If YES + ACTIVE REMOTE WORK:</strong> The D8 is required; you can't use D7 for this.
            </p>
            <p className="mt-1">
              <strong>If NO:</strong> Continue to question 2.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-4">
            <p className="font-semibold text-stone-900">2. Do you earn income from remote work (employment, freelance, business)?</p>
            <p className="mt-2">
              <strong>If YES:</strong> You need the D8. Check: Is your income ≥€3,680/month on average?
            </p>
            <p className="mt-1">
              <strong>If NO:</strong> Neither D8 nor D7 fits; you may need a different route or consult an immigration lawyer.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-4">
            <p className="font-semibold text-stone-900">3. Do you plan to live in Portugal full-time or just visit 120 days/year?</p>
            <p className="mt-2">
              <strong>If FULL-TIME RESIDENCY:</strong> D8 (residence visa) is the right choice. This is what this guide covers.
            </p>
            <p className="mt-1">
              <strong>If JUST VISITING (≤120 days/year):</strong> Temporary-stay visa might be simpler (but less documentation depth; consult your consulate).
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">D8 eligibility checklist</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          If you've confirmed the D8 is the right path, verify you meet the basics:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>• ✓ You have stable, foreign-sourced remote income (≥€3,680/month average over 6 months)</li>
          <li>• ✓ You have documentation proving this income (employment letter, contracts, tax returns, bank statements)</li>
          <li>• ✓ You don't have serious criminal convictions or immigration history issues</li>
          <li>• ✓ You plan to live in Portugal long-term (not just visit)</li>
          <li>• ✓ You can secure accommodation in Portugal (rental lease or property)</li>
          <li>• ✓ You can arrange health insurance covering Portugal</li>
          <li>• ✓ You are a non-EU/EEA citizen (EU/EEA citizens don't need D8; freedom of movement applies)</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          If all of these are true, proceed with the D8 application. See the main <Link href="/resources/portugal-d8-visa" className="text-teal-800 underline">Portugal D8 visa guide</Link> for the full requirements and process.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Common mistakes: Choosing the wrong visa</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-900">Mistake 1: Trying to use D7 when you have active income</p>
            <p className="mt-1 text-xs text-red-800">
              You have €2,000/month salary from freelance work, but only €800/month from a rental property. You think: "I'll use D7 since it's easier." This results in immediate visa rejection once the consulate realizes you're working. Always use D8 if you have active work income, regardless of passive income.
            </p>
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-900">Mistake 2: Confusing temporary-stay with D8 residency</p>
            <p className="mt-1 text-xs text-red-800">
              You want to move to Portugal permanently, open a bank account, and sign a long-term lease. You book the temporary-stay visa instead because it sounds simpler. After 120 days, you're forced to leave and can't access your own apartment or bank. Use the D8 for permanent moves.
            </p>
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-900">Mistake 3: Preparing D8 documents when you don't qualify</p>
            <p className="mt-1 text-xs text-red-800">
              You have €2,500/month remote income, below the €3,680 threshold. You spend 2 months gathering documents and book a consulate appointment. On submission day, the consulate denies you for income insufficiency. Always verify the income threshold first; if you're below it, either increase your income, wait until you do, or explore other visa routes.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Is the Portugal digital nomad visa really the D8 residence visa?",
                answer:
                  "Yes. The term 'digital nomad visa' commonly refers to the D8 residence visa for remote workers with foreign-sourced income. Portugal also has a temporary-stay short-visit option sometimes loosely called a 'digital nomad visa,' which is different. Always confirm which one you're applying for.",
              },
              {
                question: "Can I apply for D8 if I have both active and passive income?",
                answer:
                  "Yes. If your total income (active + passive) is ≥€3,680/month and includes active remote work, use D8. The income sources can be mixed; the consulate cares that your total is sufficient and documented.",
              },
              {
                question: "What if my remote income is in a currency other than EUR?",
                answer:
                  "Convert using a 6-month average exchange rate (check xe.com or your bank's historical rates). Your bank statements will show the converted EUR amount if you have a European account. Use the actual amount you receive in EUR when calculating eligibility.",
              },
              {
                question: "Can EU/EEA citizens apply for the D8 visa?",
                answer:
                  "No. EU/EEA citizens have freedom of movement and can live in Portugal without a visa. The D8 is for non-EU/EEA citizens. If you're an EU/EEA national, you can simply move to Portugal and register for residency.",
              },
              {
                question: "After getting the D8 visa, do I need to reapply every year?",
                answer:
                  "The D8 visa is typically valid for 1 year. Before it expires, you can renew it by reapplying (proving ongoing income and residence) or transition to a permanent residency permit if you've been continuously resident. The process is simpler for renewals than the initial application.",
              },
              {
                question: "If I'm unsure which visa I need, who should I ask?",
                answer:
                  "Contact the Portuguese consulate responsible for your home country directly via email. Describe your income situation (employment, freelance, business, passive income), your intended stay (permanent or seasonal), and ask which visa route matches. Getting this right from a consulate before spending time on applications saves significant effort.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading="Ready to pursue the D8?"
        body="Once you've confirmed D8 is the right path, use the full D8 guide to understand every requirement, or jump straight to your country guide (USA, UK, or Canada) to learn the criminal record and submission steps specific to you."
      />
      <Disclaimer />
    </main>
  );
}