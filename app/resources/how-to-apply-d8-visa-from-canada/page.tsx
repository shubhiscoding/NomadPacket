import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "How to Apply for Portugal D8 Visa from Canada: Complete Guide 2026",
  description: "Step-by-step Canada guide to apply for Portugal's D8 visa: RCMP police certificate, Canadian consulate routing, income proof, processing timeline, and full requirements.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-canada") },
  openGraph: {
    title: "How to Apply for Portugal D8 Visa from Canada",
    description: "Complete Canada guide for applying for the Portugal D8 residence visa, including RCMP clearance and consulate routing.",
    url: canonicalUrl("/resources/how-to-apply-d8-visa-from-canada"),
    type: "article",
  },
};

export default function HowToApplyD8FromCanadaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Canada Applicant Guide</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        How to Apply for Portugal D8 Visa from Canada: Complete Guide
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>Canadian applicants follow the same core D8 requirements as US and UK applicants, but the RCMP criminal record process, provincial consulate routing, and submission location are Canada-specific.</strong> This guide walks through the steps, timelines, and details unique to Canadian applicants.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 1: Identify your Portuguese consulate (by province)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Canada has two Portuguese consulates, each serving specific provinces. Your application goes to the one responsible for your province of residence.
        </p>
        <div className="mt-4 rounded-lg border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-900">Portuguese Consulates in Canada</p>
          <div className="mt-3 space-y-3 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-900">Toronto (Ontario)</p>
              <p className="mt-1">
                Serves Ontario and all provinces east of Ontario. Website: <span className="font-mono">consulado.toronto@mne.pt</span>
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-900">Vancouver (British Columbia)</p>
              <p className="mt-1">
                Serves British Columbia, Alberta, Saskatchewan, Manitoba, and all provinces west. Website: <span className="font-mono">consulado.vancouver@mne.pt</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Action item:</strong> Contact your relevant consulate's visa section email, introduce yourself, and ask for the current D8 visa requirement list, processing timeline, and appointment availability. Procedures can change seasonally.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 2: Request the Canadian police certificate (start immediately)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Canada's criminal record certificate is called the <strong>RCMP Police Information Check (PIC)</strong> or (if your consulate requires it) a <strong>vulnerable sector check</strong>. For visa purposes, a standard RCMP PIC is almost always sufficient.
        </p>

        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">How to request an RCMP Police Information Check:</p>
          <ol className="mt-2 flex flex-col gap-2 text-xs text-amber-800">
            <li>1. Visit the RCMP's official portal: <span className="font-mono">RCMP-GRC.gc.ca</span> (search "police information check")</li>
            <li>2. Order online (preferred—faster) or by mail through the RCMP's fingerprint services.</li>
            <li>3. For online orders, you'll submit your fingerprints digitally (LiveScan if available at your local police station).</li>
            <li>4. Processing time: typically 2–4 weeks for online orders; 4–8 weeks for mail-in requests.</li>
            <li>5. Cost: approximately CAD $25–50, depending on method and service level.</li>
            <li>6. Request <strong>2–3 certified copies</strong> to have extras.</li>
          </ol>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Faster option:</strong> If you're near a police station that offers LiveScan fingerprinting, submit your fingerprints in person—this speeds processing from 4–8 weeks to 1–3 weeks and is more reliable.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 3: Apostille and translation of the RCMP certificate</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Once the RCMP sends the police certificate, you need to authenticate it for Portuguese use:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Apostille</p>
            <p className="mt-1 text-xs text-stone-600">
              To apostille an RCMP certificate, contact the <strong>Government of Canada's Global Affairs Canada (GAC)</strong> office or use an apostille service (search "Canada apostille service near me" or "Secretary of State apostille"). Cost: CAD $10–30. Processing: 1–2 weeks by mail, 1–3 days in person if you can visit a GAC office.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Translation into Portuguese (if required)</p>
            <p className="mt-1 text-xs text-stone-600">
              Check with your Portuguese consulate whether translation is required. Some accept English certificates; others require Portuguese. If needed, hire a certified translator (search "certified Portuguese translator Canada"). Cost: approximately CAD $75–200. Turnaround: 3–7 days.
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Timeline:</strong> RCMP certificate (2–8 weeks) + apostille (1–2 weeks) + translation if needed (3–7 days) = 6–12 weeks for the complete criminal record package.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 4: Gather Canadian income evidence (parallel with RCMP process)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          While waiting for the RCMP certificate, gather your income documentation:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For employees</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Email your HR department for an employment confirmation letter with job title, hire date, gross monthly salary in CAD, and explicit authorization to work remotely from Portugal</li>
              <li>• Gather 6 months of recent pay stubs (from your employer or payroll system)</li>
              <li>• Download 6 months of bank statements from the account where salary deposits arrive (PDF)</li>
              <li>• Convert CAD salary to EUR using a 6-month average exchange rate (check xe.com or your bank)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For freelancers and business owners</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Gather client contracts or engagement letters showing scope and payment</li>
              <li>• Collect 6–12 months of invoices showing consistent billing to clients</li>
              <li>• Provide prior-year Canadian tax return (T1 General + Schedule 8 if self-employed, or corporate return if incorporated)</li>
              <li>• Download 6–12 months of business bank statements showing client deposits</li>
              <li>• Calculate average monthly income in CAD and convert to EUR (~CAD $4,200+ equivalent to €3,680)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Critical:</strong> The Portuguese consulate will verify consistency between your employment letter, payslips, and bank statements. Inconsistencies lead to additional scrutiny or rejection.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 5: Arrange Canadian accommodation and health insurance</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          You don't need to already be in Portugal, but you need to show where you'll live and how you'll be insured:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Accommodation in Portugal</p>
            <p className="mt-1 text-xs text-stone-600">
              A signed rental agreement or notarized letter from a property owner confirming you have the right to occupy an address in Portugal. Many Canadian applicants book rentals online from abroad (Airbnb long-term, Booking.com, or Portuguese sites like Idealista, Imovirtual). The lease must be signed before your consulate appointment.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Health insurance</p>
            <p className="mt-1 text-xs text-stone-600">
              Most Canadian applicants use private health insurance. Options: international health insurance (Allianz, Cigna Global), travel insurance with residence coverage, or direct Portuguese private insurance. Your proof must show coverage valid for your visa period.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 6: Prepare remaining documents</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          With RCMP certificate and income evidence in hand, prepare:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>• <strong>Passport:</strong> Valid for at least 6 months beyond your intended arrival date in Portugal</li>
          <li>• <strong>Passport photos:</strong> 2–4 recent color photos, 4×6 cm (confirm exact requirement with your consulate)</li>
          <li>• <strong>Motivation letter:</strong> 1–2 pages in English or Portuguese explaining your intention to reside in Portugal and your financial stability</li>
          <li>• <strong>Income summary sheet:</strong> One-page document listing monthly income in EUR, employment type, and start date (generated by NomadPacket to ensure alignment with your employment letter)</li>
          <li>• <strong>National visa form (MNE):</strong> The official Portuguese visa application form, completed in full (available from your consulate website or MNE portal)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 7: Contact your consulate and submit</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Once all documents are ready (especially the RCMP certificate), email your Portuguese consulate's visa section with details of your application and request an appointment or submission method. Some consulates accept documents by mail; others require in-person submission at the consulate office.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>At submission, bring or send:</strong>
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
          <li>• All originals: passport, RCMP certificate, employment letter, bank statements, accommodation proof</li>
          <li>• Color copies of every document</li>
          <li>• Completed visa form</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Your consulate will review the packet, either approve on the spot or request clarification (usually within 2–4 weeks), and process your visa (2–6 weeks after approval).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Canada-specific timeline summary</h2>
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          <div className="flex items-start justify-between">
            <span>RCMP police certificate</span>
            <span className="font-semibold">2–8 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Apostille + translation (if needed)</span>
            <span className="font-semibold">2–3 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Income documentation</span>
            <span className="font-semibold">1–2 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Consulate appointment/submission</span>
            <span className="font-semibold">1–6 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Consulate processing after submission</span>
            <span className="font-semibold">2–6 weeks</span>
          </div>
          <div className="border-t border-stone-200 pt-2 flex items-start justify-between font-semibold">
            <span>Total (best to worst case)</span>
            <span>3–5 months</span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Do I apply to the Toronto or Vancouver consulate?",
                answer:
                  "Apply to the consulate responsible for your province of residence: Toronto consulate serves Ontario and provinces east; Vancouver serves British Columbia, Alberta, and provinces west. If you're unsure, email both and they'll direct you to the correct one.",
              },
              {
                question: "Can I use an RCMP police clearance I already have from a previous application?",
                answer:
                  "Only if it's recent (usually within the last 3–6 months, depending on consulate requirements). Consulates want fresh clearances. If yours is older, request a new one.",
              },
              {
                question: "Does the RCMP certificate need to be translated into Portuguese?",
                answer:
                  "Check with your specific consulate—some accept English, others require Portuguese. A quick email to your consulate's visa section clarifies this before you order the certificate.",
              },
              {
                question: "What if I recently moved provinces and my RCMP certificate is from another province?",
                answer:
                  "If you've recently moved, order a new RCMP certificate reflecting your current province. Use your current province for consulate routing (where you currently reside).",
              },
              {
                question: "Can I submit my application by mail or do I need to visit the consulate in person?",
                answer:
                  "This varies by consulate. Some accept mail submissions; others require in-person appointments. Check your specific consulate's requirements before preparing your documents.",
              },
              {
                question: "What if my employer won't write an employment letter?",
                answer:
                  "For freelancers or those whose employers hesitate, a combination of tax returns, invoices, client contracts, and 6–12 months of bank statements can substitute. However, if you're a traditional employee, the employment letter is expected—see the employer letter guide for a script to use with HR.",
              },
            ]}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">After your visa is approved</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Your D8 visa is typically valid for 1 year. Upon arrival in Portugal, you'll register for a residence permit (residência) at the AIMA office, obtain a NIF (Portuguese tax ID), and arrange health insurance enrollment.
        </p>
      </section>

      <MarketingCta
        heading="Prepare your Canadian D8 packet with confidence"
        body="Generate your income summary and pre-filled visa form from one set of answers, ensuring consistency between your employment letter, bank statements, and motivation letter before you submit to the consulate."
      />
      <Disclaimer />
    </main>
  );
}
