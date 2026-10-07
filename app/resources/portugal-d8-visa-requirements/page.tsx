import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Portugal D8 Visa Requirements Checklist 2026: Complete Document List",
  description: "Full Portugal D8 residence visa requirements checklist. Every document needed: income proof, criminal record, accommodation, health insurance, visa form, motivation letter.",
  alternates: { canonical: canonicalUrl("/resources/portugal-d8-visa-requirements") },
  openGraph: {
    title: "Portugal D8 Visa Requirements: Complete Checklist 2026",
    description: "Step-by-step checklist of all documents required for Portugal's D8 residence visa application.",
    url: canonicalUrl("/resources/portugal-d8-visa-requirements"),
    type: "article",
  },
};

export default function PortugalD8VisaRequirementsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal D8 Visa Checklist</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        Portugal D8 Visa Requirements: Complete Document Checklist
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>The D8 visa requires four categories of documents: income proof, identity documents, Portugal-specific evidence, and the official national visa application form.</strong> This checklist breaks down exactly what each consulate expects, why each document matters, and the order you should gather them to avoid delays.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Before you start: Income eligibility</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Every other requirement on this checklist is contingent on meeting the income threshold first. If you don't qualify financially, the rest of the paperwork is unnecessary.
        </p>
        <div className="mt-3 rounded-lg border border-teal-100 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-900">€3,680/month minimum (2026)</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-teal-800">
            <li>• This is 4× Portugal's minimum wage (€920 in 2026)</li>
            <li>• Must be gross income (before taxes)</li>
            <li>• Must be foreign-sourced (not earned in Portugal)</li>
            <li>• Assessed as a 6-month average; a single month below the threshold doesn't disqualify you if your average meets it</li>
            <li>• With dependents, add €460/month per spouse and €276/month per child under 18</li>
          </ul>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          If you're borderline, maintain a savings buffer of around €11,040 (3× the monthly threshold) to demonstrate financial stability.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Income & employment documents (Bucket 1)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          These prove you have qualifying income and that it will continue:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Employment letter (for employees only)</p>
            <p className="mt-1 text-xs text-stone-600">
              Signed by your employer or HR department. Must state your job title, hire date, current gross monthly salary, and explicit authorization to work remotely from Portugal. See the <Link href="/resources/employer-letter-sample" className="text-teal-800 underline">employer letter guide</Link> for an example.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Recent payslips</p>
            <p className="mt-1 text-xs text-stone-600">
              Last 3–6 months of payslips showing gross salary, deductions, and net pay. Must match the salary stated in the employment letter. If using an unusual pay cycle (e.g., quarterly bonuses), include a full 12 months to show your true average.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Bank statements</p>
            <p className="mt-1 text-xs text-stone-600">
              Last 6 months from the account where your salary is deposited. Must show regular income deposits matching your stated monthly income (within exchange-rate variation if paid in non-EUR currency). Consulates use this to verify your payslips are real.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For freelancers and business owners</p>
            <p className="mt-1 text-xs text-stone-600">
              Client contracts or engagement letters confirming work scope and compensation; invoices showing invoicing frequency and amounts; prior-year tax returns or business registration showing business legitimacy; and bank statements showing client deposits. Consistency across these documents is critical—a contract promising €5,000/month, invoices showing €4,000, and bank deposits of €3,500 will raise red flags.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Income summary sheet</p>
            <p className="mt-1 text-xs text-stone-600">
              A one-page document stating your monthly income in EUR, employment type (employee/freelancer/business owner), the date your current employment began, and any dependents. This is generated by NomadPacket to ensure consistency with your motivation letter and visa form.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Identity & civil documents (Bucket 2)</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Passport</p>
            <p className="mt-1 text-xs text-stone-600">
              Valid for at least 6 months beyond your intended date of entry to Portugal. Some consulates require 1 year of validity. Check your specific consulate's requirement.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Passport photos</p>
            <p className="mt-1 text-xs text-stone-600">
              2–4 recent color photos, 4×6 cm (1.6×2.4 in), taken within the last 6 months. Requirements vary by consulate; some accept digital passport photos, others require physical prints. Confirm in advance.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Criminal record certificate</p>
            <p className="mt-1 text-xs text-stone-600">
              Proof that you have no criminal record in your home country. The type of certificate, apostille requirement, translation requirement, and freshness requirement vary significantly by country. <strong>This is the slowest step in the process (2–8 weeks)—start immediately.</strong> See your country guide (USA, UK, Canada) for the exact certificate and process you need.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Birth certificate (if needed)</p>
            <p className="mt-1 text-xs text-stone-600">
              Required if you have dependents or if your marital status differs from single. Should be apostilled if requested by your consulate.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Marriage certificate or partnership documents (if applicable)</p>
            <p className="mt-1 text-xs text-stone-600">
              If applying with a spouse or legal partner, you'll need proof of the relationship and their income documentation separately. Dependencies increase the income threshold (see above).
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Portugal-specific documents (Bucket 3)</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Accommodation proof</p>
            <p className="mt-1 text-xs text-stone-600">
              A signed rental agreement (contrato de arrendamento), property deed if you own, or a notarized accommodation letter from a host confirming you have the right to reside at that address. Must include the full address, your name as a resident/tenant, and ideally a start date. Some consulates require the rental agreement to be notarized or registered with Portuguese authorities; confirm in advance.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Health insurance</p>
            <p className="mt-1 text-xs text-stone-600">
              Proof of valid health insurance covering your stay in Portugal. Most consulates accept private insurance (easier to arrange before arrival) or proof of enrollment in the Portuguese National Health Service (SNS). If using private insurance, it must explicitly state coverage in Portugal and be valid for your intended visa period.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Motivation letter</p>
            <p className="mt-1 text-xs text-stone-600">
              A 1–2 page personal statement (in Portuguese or English, depending on consulate) explaining your intention to reside in Portugal, your stable income situation, ties to the country if relevant, and your accommodation plan. This should not be a generic template letter; it should reflect your specific situation. See the <Link href="/resources/motivation-letter-sample" className="text-teal-800 underline">motivation letter guide</Link> for an example.
            </p>
          </div>
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Proof of NIF (optional but recommended)</p>
            <p className="mt-1 text-xs text-stone-600">
              A Portuguese Tax ID number. Not always required at visa submission, but you'll need one immediately after arrival. Many applicants obtain one remotely 4–6 weeks before their visa appointment. See the <Link href="/resources/nif-guide" className="text-teal-800 underline">NIF guide</Link> for how to get one as a non-resident.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">The official visa application form (Bucket 4)</h2>
        <div className="rounded-lg border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-900">MNE National Visa Application Form</p>
          <p className="mt-2 text-xs text-stone-600">
            The official form from the Portuguese Ministry of Foreign Affairs (MNE), completed in full with your personal information, travel dates, accommodation details, and income. NomadPacket pre-fills this form with your data to minimize errors and ensure consistency with your motivation letter and income summary.
          </p>
          <p className="mt-2 text-xs text-stone-600">
            The form is available on the MNE visa portal or your consulate's website. Confirm whether you need the Portuguese or English version.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">The ideal preparation sequence</h2>
        <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-stone-600">
          <li>
            <strong>Week 1–2:</strong> Confirm visa route and your application consulate. Request your employment/client confirmation letter and criminal record certificate simultaneously.
          </li>
          <li>
            <strong>Week 2–4:</strong> Once you have employment/income confirmation, collect 6 months of recent payslips and bank statements. Have a preliminary income calculation to verify you meet the threshold.
          </li>
          <li>
            <strong>Week 4–6:</strong> Secure accommodation (rental agreement) and arrange health insurance.
          </li>
          <li>
            <strong>Week 6–8:</strong> Write or generate your motivation letter and income summary sheet, ensuring all dates and figures match your employment letter exactly.
          </li>
          <li>
            <strong>Week 8–10:</strong> Gather remaining documents (passport, photos, birth certificate if needed). Confirm criminal record certificate has arrived and is in the correct format (apostilled, translated if needed).
          </li>
          <li>
            <strong>Week 10–12:</strong> Complete the MNE visa form. Do a full consistency check: compare every date, income figure, and name across all documents.
          </li>
          <li>
            <strong>Week 12+:</strong> Schedule your consulate appointment and prepare for submission.
          </li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Key insight:</strong> The criminal record certificate and employment confirmation letter are almost always the time-limiting factors. Start those immediately. The rest of the documents can be assembled more quickly once you have those two.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Document checklist by employment type</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="text-sm font-semibold text-stone-900">If you're an employee (W-2 equivalent)</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-stone-600">
              <li>✓ Employment letter (required)</li>
              <li>✓ 6 months of payslips</li>
              <li>✓ 6 months of bank statements</li>
              <li>✓ Income summary sheet</li>
              <li>✓ Criminal record certificate</li>
              <li>✓ Passport</li>
              <li>✓ Accommodation proof</li>
              <li>✓ Health insurance</li>
              <li>✓ Motivation letter</li>
              <li>✓ Visa form</li>
            </ul>
          </div>
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="text-sm font-semibold text-stone-900">If you're self-employed or a freelancer</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-stone-600">
              <li>✓ Client contracts or engagement letters</li>
              <li>✓ Prior-year tax return or business registration</li>
              <li>✓ 6–12 months of invoices</li>
              <li>✓ 6 months of bank statements showing deposits</li>
              <li>✓ Income summary sheet</li>
              <li>✓ Criminal record certificate</li>
              <li>✓ Passport</li>
              <li>✓ Accommodation proof</li>
              <li>✓ Health insurance</li>
              <li>✓ Motivation letter</li>
              <li>✓ Visa form</li>
            </ul>
          </div>
          <div className="rounded-lg border border-stone-200 p-4">
            <p className="text-sm font-semibold text-stone-900">If you're a business owner</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-stone-600">
              <li>✓ Business registration and tax documents</li>
              <li>✓ Prior-year business tax return</li>
              <li>✓ Recent accounting statement showing distributions or dividends to you</li>
              <li>✓ 6 months of bank statements (business account and personal account if funds are transferred)</li>
              <li>✓ Income summary sheet</li>
              <li>✓ Criminal record certificate</li>
              <li>✓ Passport</li>
              <li>✓ Accommodation proof</li>
              <li>✓ Health insurance</li>
              <li>✓ Motivation letter</li>
              <li>✓ Visa form</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">What consulates actually check</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Consulate staff reviewing your application will focus on three things:
        </p>
        <ol className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>
            <strong>1. Income consistency:</strong> Do your employment letter, payslips, bank statements, and income summary all tell the same story? If one says €4,000 and another says €3,800, they flag it.
          </li>
          <li>
            <strong>2. Criminal record compliance:</strong> Is your certificate the right type, properly apostilled, and translated if required? Is it recent enough (within 3–12 months depending on consulate)?
          </li>
          <li>
            <strong>3. Intent to reside:</strong> Does your accommodation proof (rental agreement with a lease term), motivation letter, and health insurance suggest you're genuinely planning to live in Portugal long-term, not just visit?
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Do I need an apostille for every document?",
                answer:
                  "No. An apostille is specifically required for documents issued by government authorities (birth certificates, criminal record certificates, educational diplomas). Employment letters and bank statements don't need apostilles. Confirm which documents your specific consulate requires to be apostilled.",
              },
              {
                question: "What if my documents are in a language other than Portuguese or English?",
                answer:
                  "Most consulates require key documents (criminal record certificate, employment letter, motivation letter) to be in Portuguese or English. Check your consulate's requirements—some accept English, others require Portuguese. If translation is needed, use a certified translator.",
              },
              {
                question: "Can I submit documents as PDFs or do I need originals?",
                answer:
                  "Bring originals and color copies to your appointment. Your consulate will verify the originals and keep the copies. Some documents (like bank statements) can be submitted as certified copies or originals. Ask your consulate in advance.",
              },
              {
                question: "How fresh does my criminal record certificate need to be?",
                answer:
                  "Most consulates require it to have been issued within the past 3–12 months (consulate-specific). Order with your appointment date in mind, and avoid ordering too early.",
              },
              {
                question: "What if I don't have 6 months of bank statements?",
                answer:
                  "If you've just started the job or recently changed banks, provide whatever you have and explain the gap. Have an additional letter from your employer confirming your salary history or an accountant's statement if available.",
              },
              {
                question: "Do I need to notarize or certify my documents?",
                answer:
                  "Government-issued documents (birth certificate, criminal record) should be apostilled if required, but you don't typically need notarization for employment letters, bank statements, or rental agreements—bring originals and certified copies.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading="Keep every document in sync"
        body="Generate your income summary sheet and pre-filled visa form from one set of answers. Update one figure, and everything updates automatically—no more accidental mismatches."
      />
      <Disclaimer />
    </main>
  );
}
