import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Portugal D8 Visa Guide: Full Requirements & Application Process 2026",
  description: "Complete Portugal D8 visa guide—what it is, income requirements (€3,680/month), document checklist, criminal record process, and how to apply from US, UK, Canada.",
  alternates: { canonical: canonicalUrl("/resources/portugal-d8-visa") },
  openGraph: {
    title: "Portugal D8 Visa: Full Requirements & Application Process",
    description: "The definitive guide to Portugal's D8 residence visa for remote workers: requirements, documents, and step-by-step application.",
    url: canonicalUrl("/resources/portugal-d8-visa"),
    type: "article",
  },
};

export default function PortugalD8VisaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal D8 Visa Guide</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        Portugal D8 Visa: Complete Guide to Requirements & Application
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>The Portugal D8 visa is a residence visa for remote workers with foreign-sourced income, often called the "digital nomad visa."</strong> Unlike temporary-stay alternatives, the D8 is designed for applicants planning to reside in Portugal long-term. This guide explains the core requirements, document checklist, and critical distinctions that affect your eligibility and application strategy.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">What is the D8 visa?</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The D8 is one of several residence-visa routes Portugal offers. It targets remote workers and self-employed professionals with stable, foreign-sourced income who intend to live in Portugal. The visa is named after the Portuguese statute (Law n.º 23/2007, Decree-Law 63/2007) that created this residence category.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Critical distinction:</strong> Portugal also offers a temporary-stay visa (Type D short-stay visa, valid up to 120 days per year). This guide covers the residence visa (D8) only, which enables full-time residence and is substantially different in requirements, processing, and legal standing. Do not apply for the wrong visa type—the documents differ and misapplying for a temporary stay when you mean to reside will result in rejection.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">D8 visa income requirement</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          <strong>Minimum monthly income: €3,680 (2026)</strong>, calculated as 4× Portugal's national minimum wage. This threshold updates annually each January when Portugal adjusts its minimum wage (RMMG). The 2026 figure is based on a €920 minimum wage effective January 1, 2026.
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>
            <strong>For a single applicant:</strong> €3,680/month minimum
          </li>
          <li>
            <strong>With dependents:</strong> Add €460/month per spouse and €276/month per child under 18
          </li>
          <li>
            <strong>6-month average rule:</strong> Consulates increasingly require your average income over the past 6 months to meet the threshold—a single month dip below doesn't disqualify you if your average holds up
          </li>
          <li>
            <strong>Savings buffer:</strong> A savings account with €11,040 (~3× monthly threshold) helps if any month falls slightly short
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Income must be <strong>foreign-sourced</strong> (not earned in Portugal) and stable. Employees, freelancers, business owners, and investors with dividend income all qualify if they meet the threshold.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Full document requirement checklist</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The D8 application requires documents in four categories:
        </p>

        <div className="mt-4 space-y-5">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">1. Income & Employment</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
              <li>• <strong>Employment proof:</strong> For employees—a signed letter from your employer confirming remote work from Portugal, salary, and duration of employment</li>
              <li>• <strong>Recent payslips:</strong> Last 3–6 months, showing consistent income above the threshold</li>
              <li>• <strong>Bank statements:</strong> Last 6 months showing income deposits matching employment claims</li>
              <li>• <strong>For freelancers/business owners:</strong> Client contracts, invoices, tax returns or business registration, and bank statements</li>
              <li>• <strong>Income summary sheet:</strong> A one-page document listing your monthly income, employment type, and dates—generated by NomadPacket to ensure consistency across all application documents</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">2. Identity & Civil Documents</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
              <li>• <strong>Passport:</strong> Valid for at least 6 months beyond your intended stay</li>
              <li>• <strong>Passport photos:</strong> Typically 2–4 recent color photos (4×6 cm), depending on consulate</li>
              <li>• <strong>Criminal record certificate:</strong> From your home country, apostilled and often translated into Portuguese or English (process varies by country—see your country guide below)</li>
              <li>• <strong>Birth certificate:</strong> If your marital status differs from single, or if you have dependents</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">3. Portugal-Specific Evidence</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
              <li>• <strong>Accommodation proof:</strong> A signed rental agreement, property deed, or accommodation confirmation letter naming you as resident</li>
              <li>• <strong>Health insurance:</strong> Private or public Portuguese insurance valid for your stay, or proof of equivalent coverage</li>
              <li>• <strong>Motivation letter:</strong> A 1–2 page personal statement explaining your intention to live in Portugal, your income stability, and ties to the country (if relevant)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <h3 className="font-semibold text-stone-900">4. The Official Portuguese Form</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
              <li>• <strong>National visa application form:</strong> The MNE (Ministry of Foreign Affairs) visa application, pre-filled with your personal and income data</li>
              <li>• <strong>Supporting declarations:</strong> A one-page summary of supporting documents you're submitting</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step-by-step application timeline</h2>
        <ol className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-stone-600">
          <li>
            <strong>1. Confirm the visa type and your application location</strong> — Verify you want the D8 residence visa, not temporary-stay. Identify the Portuguese consulate or authorized visa-processing center responsible for your home country.
          </li>
          <li>
            <strong>2. Gather income evidence</strong> — Collect employment letters, payslips, and bank statements. This often takes 2–4 weeks if your employer needs to draft a confirmation letter.
          </li>
          <li>
            <strong>3. Obtain your criminal record certificate</strong> — Start this immediately—it typically takes 2–8 weeks depending on your country and processing method. Confirm whether it needs an apostille and/or translation.
          </li>
          <li>
            <strong>4. Secure accommodation and health insurance</strong> — Finalize your rental or property arrangement and arrange health coverage (private insurance is simpler and faster than public).
          </li>
          <li>
            <strong>5. Prepare your motivation letter and income summary</strong> — Write or generate these documents, ensuring dates and income figures match your employment letter and bank statements exactly.
          </li>
          <li>
            <strong>6. Complete the national visa form</strong> — Fill out the MNE application form with all personal details. Pre-filling helps catch errors early.
          </li>
          <li>
            <strong>7. Schedule your consulate appointment</strong> — Book your visa interview at the relevant Portuguese consulate. Availability and wait times vary widely (1–12 weeks depending on location).
          </li>
          <li>
            <strong>8. Attend your appointment and submit</strong> — Bring originals and copies of all documents. The consulate will review your packet on the spot.
          </li>
          <li>
            <strong>9. Wait for a decision</strong> — Processing after submission typically takes 2–6 weeks, though this varies by location.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">How long does the D8 process actually take?</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          <strong>Total time from start to visa issuance: 2–5 months</strong> in most cases. Here's how it breaks down:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>• Criminal record certificate: 2–8 weeks (often the slowest step)</li>
          <li>• Employer letter and income documentation: 1–4 weeks</li>
          <li>• Consulate appointment availability: 1–12 weeks (varies dramatically)</li>
          <li>• Consulate processing after submission: 2–6 weeks</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          The criminal record process is almost always the limiting factor. Start it immediately after confirming the visa type—don't wait until other documents are ready.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Apply by country: Country-specific guides</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The core requirements above are the same regardless of where you're applying from, but the criminal-record process, consulate appointment availability, and some local documentation rules differ by home country. Review the guide specific to your situation:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/us" className="rounded-lg border border-stone-200 bg-white p-3 text-sm hover:border-teal-700">
            <h3 className="font-medium text-stone-900">From the USA</h3>
            <p className="mt-1 text-xs text-stone-600">FBI clearance process, consulate location guidance</p>
          </Link>
          <Link href="/uk" className="rounded-lg border border-stone-200 bg-white p-3 text-sm hover:border-teal-700">
            <h3 className="font-medium text-stone-900">From the UK</h3>
            <p className="mt-1 text-xs text-stone-600">UK DBS process, post-Brexit visa center routing</p>
          </Link>
          <Link href="/ca" className="rounded-lg border border-stone-200 bg-white p-3 text-sm hover:border-teal-700">
            <h3 className="font-medium text-stone-900">From Canada</h3>
            <p className="mt-1 text-xs text-stone-600">RCMP clearance process, consulate locations</p>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Common reasons D8 applications fail (and how to avoid them)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Immigration consulates receive hundreds of D8 applications. The ones that get rejected or flagged for additional review almost always fail for the same handful of reasons:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">Income figures that don't match across documents</h3>
            <p className="mt-1 text-xs text-amber-800">
              Your employment letter says €4,200/month, but your income summary says €4,000, and your bank statements show an average of €3,900. Consulates flag these as red flags for fraud. The solution: gather all documents first, calculate your precise average, then ensure every document reflects that single agreed figure.
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">Criminal record certificate errors or omissions</h3>
            <p className="mt-1 text-xs text-amber-800">
              You ordered the wrong type of certificate (not the apostille version, or missing a required translation), or it expired before submission. This is the #1 cause of delays. Order early, confirm the exact requirement with your consulate in writing, and allow extra time.
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">Accommodation proof that doesn't meet requirements</h3>
            <p className="mt-1 text-xs text-amber-800">
              Your rental agreement is unsigned, or doesn't have an end date. Some consulates require proof of legal standing (e.g., a formal lease notarized or registered with Portuguese authorities). Confirm the exact standard before finalizing your rental.
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">Motivation letter that lacks specificity</h3>
            <p className="mt-1 text-xs text-amber-800">
              A generic, one-paragraph letter doesn't convince a consulate you're serious. A strong letter explains your income source, your ties to Portugal (if any), your accommodation plan, and what "residing" in Portugal means for your specific situation. NomadPacket generates these from your actual answers.
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">Health insurance that doesn't meet local rules</h3>
            <p className="mt-1 text-xs text-amber-800">
              Some consulates require Portuguese health insurance or have minimum coverage standards. Private insurance is usually simpler; public insurance requires residency you don't have yet. Confirm the requirement and arrange accordingly.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          <strong>The manual way, applicants fail because they juggle all these documents separately, forget to update one when they update another, and submit conflicting or missing information.</strong> NomadPacket assembles all your documents from one set of answers, ensuring every date, income figure, and supporting detail stays consistent across your motivation letter, income summary, and pre-filled visa form—eliminating the most common failure mode entirely.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Is the €3,680 income requirement net or gross?",
                answer:
                  "It is gross income (before taxes). The threshold is pegged to Portugal's minimum wage, which is stated as a gross figure. You must prove you earn at least €3,680/month in gross income.",
              },
              {
                question: "Can I include passive income or investment returns?",
                answer:
                  "Yes, if it's stable and verifiable. Dividend income from investments, rental income from properties, or royalties all count, as long as you can demonstrate they are consistent and likely to continue. Passive income is harder to prove than employment, so have multiple months of bank statements and source documentation.",
              },
              {
                question: "What if my income is in USD or GBP, not EUR?",
                answer:
                  "Convert using the average exchange rate from the past 6 months (or the rate your bank charges). Your bank statements will show the converted amount in EUR if you're paid to a Portuguese or EU account. Use your actual received amount, not a theoretical conversion.",
              },
              {
                question: "Do I need to have a NIF before I apply?",
                answer:
                  "No, but you need one before you arrive in Portugal (it's required for the bank account, rental agreement, and residency registration). Many applicants obtain a NIF remotely through a fiscal representative 4–6 weeks before their visa appointment. See the NIF guide for the three ways to get one.",
              },
              {
                question: "Can I apply for the D8 visa while still employed in my home country?",
                answer:
                  "Yes. Your employment doesn't need to be remote-work-only; your employer just needs to confirm they authorize you to work from Portugal. If your employer won't allow it, the D8 route may not be viable—you'd need to become a freelancer or business owner with your own clients.",
              },
              {
                question: "What happens after my D8 visa is approved?",
                answer:
                  "You'll receive a visa sticker in your passport valid for typically 1 year. Upon arrival in Portugal, you'll register for a residence permit (residência) at the AIMA office, and complete tax registration and health system enrollment. The visa gets you in the door; residency is a separate step.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading="Stop juggling inconsistent documents"
        body="Answer a short questionnaire once. NomadPacket writes your motivation letter, income summary, and pre-fills the official visa form—all from the same data, so every date and figure stays consistent."
      />
      <Disclaimer />
    </main>
  );
}