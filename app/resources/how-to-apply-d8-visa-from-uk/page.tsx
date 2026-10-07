import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "How to Apply for Portugal D8 Visa from UK: Complete Guide 2026",
  description: "Step-by-step UK guide to apply for Portugal's D8 visa: DBS clearance, UK visa center routing, income proof, processing timeline, and requirements.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-uk") },
  openGraph: {
    title: "How to Apply for Portugal D8 Visa from UK",
    description: "Complete UK guide for applying for the Portugal D8 residence visa, including DBS clearance and visa center routing.",
    url: canonicalUrl("/resources/how-to-apply-d8-visa-from-uk"),
    type: "article",
  },
};

export default function HowToApplyD8FromUkPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">UK Applicant Guide</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        How to Apply for Portugal D8 Visa from the UK: Complete Guide
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>UK applicants follow the same core D8 requirements as US and Canadian applicants, but the criminal record process, visa center routing (post-Brexit), and submission location differ significantly.</strong> This guide walks through the UK-specific steps, timelines, and the DBS process.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 1: Identify where you'll apply (UK visa center or Portuguese consulate)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Post-Brexit, UK applicants for Portuguese visas typically route applications through an authorized visa-processing center rather than directly to the Portuguese consulate. The main center serving the UK is:
        </p>
        <div className="mt-4 rounded-lg border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-900">VFS Global UK (Portugal Visa Center)</p>
          <p className="mt-2 text-xs text-stone-600">
            <strong>London Location:</strong> VFS Global handles Portuguese visa applications for UK residents. They accept documents on behalf of the Portuguese Ministry of Foreign Affairs (MNE) and route your application to Lisbon for processing.
          </p>
          <p className="mt-2 text-xs text-stone-600">
            <strong>Website:</strong> Check <span className="font-mono">https://www.vfsglobal.com/en/</span> for current contact details and appointment booking (location, hours, required appointment times).
          </p>
          <p className="mt-2 text-xs text-stone-600">
            <strong>Appointment booking:</strong> VFS typically allows you to book online. You'll select "Portugal" and "D8 residence visa" to get the right category. Wait times are usually 1–4 weeks for an appointment slot.
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Action item:</strong> Visit the VFS Global Portugal visa center website, confirm the current address, contact email, and appointment process. Requirements and procedures can change quarterly.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 2: Request the UK criminal record certificate (start immediately)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The UK criminal record certificate is called a <strong>Disclosure and Barring Service (DBS) Certificate</strong>, not a "police clearance." There are three types of DBS checks; for visa purposes, you typically need the <strong>DBS Standard or Enhanced certificate</strong>, depending on your specific consulate's requirement.
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">How to request a DBS certificate:</p>
            <ol className="mt-2 flex flex-col gap-2 text-xs text-amber-800">
              <li>1. Confirm with the VFS visa center whether you need Standard or Enhanced DBS. For most visa applications, Standard is sufficient.</li>
              <li>2. Visit <span className="font-mono">disclosure.gov.uk</span> to apply online or download the form.</li>
              <li>3. Order <strong>2–3 certified copies</strong> to have extras on hand.</li>
              <li>4. Processing time: typically 2–4 weeks for Standard DBS, 4–8 weeks for Enhanced (depending on checks required).</li>
              <li>5. Cost: approximately £15–30 per certificate, depending on the type.</li>
            </ol>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Freshness requirement:</strong> UK DBS certificates are usually valid for visa purposes if issued within 3–6 months of your visa application. Confirm this timing with VFS.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 3: Apostille and translation of the DBS certificate</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          UK DBS certificates for Portuguese visa purposes typically require:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Apostille</p>
            <p className="mt-1 text-xs text-stone-600">
              UK DBS certificates are issued by the Disclosure and Barring Service, a quasi-government body. To apostille a DBS certificate, contact the <strong>UK Foreign, Commonwealth &amp; Development Office (FCDO)</strong> or use an apostille service (search "UK apostille service"). Cost: approximately £20–50. Processing: 1–2 weeks by mail, 1–3 days in person at certain FCDO offices.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Translation into Portuguese</p>
            <p className="mt-1 text-xs text-stone-600">
              Check with VFS whether your DBS certificate needs to be translated into Portuguese. Some consulates accept the English version; others require Portuguese. A certified translator (search "certified Portuguese translator UK") can handle this. Cost: approximately £50–150. Turnaround: 3–7 days.
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Timeline:</strong> DBS (2–8 weeks) + apostille (1–2 weeks) + translation (3–7 days) = 6–12 weeks total for the full criminal record package.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 4: Gather UK income evidence (parallel with DBS process)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          While waiting for the DBS certificate, gather your income documentation:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For employees</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Email your HR department for an employment confirmation letter stating job title, hire date, gross monthly salary in GBP, and authorization to work remotely from Portugal</li>
              <li>• Gather 6 months of recent payslips</li>
              <li>• Download 6 months of bank statements from your main salary account (PDF)</li>
              <li>• Convert GBP salary to EUR using a 6-month average exchange rate (check xe.com or your bank's historical rates)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For freelancers and business owners</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Gather client contracts or engagement letters</li>
              <li>• Collect 6–12 months of invoices showing consistent billing</li>
              <li>• Get your prior-year tax return (Self Assessment summary or business accounts)</li>
              <li>• Download 6–12 months of bank statements showing client deposits</li>
              <li>• Calculate average monthly income in GBP and convert to EUR (~€3,680 equivalent)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Crucially:</strong> The Portuguese consulate will verify that your employment letter, payslips, and bank statements tell the same income story. Mismatches between stated salary and deposits trigger additional scrutiny.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 5: Secure UK accommodation and health insurance references</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          You don't need to already be in Portugal, but you need to show where you'll live and how you'll be insured:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Accommodation in Portugal</p>
            <p className="mt-1 text-xs text-stone-600">
              A signed rental agreement or notarized letter confirming you have the right to occupy an address in Portugal. Many UK applicants book rentals online from abroad (Airbnb long-term, Booking.com, or Portuguese sites like Idealista, Imovirtual). Ensure the lease is signed before your VFS appointment.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Health insurance</p>
            <p className="mt-1 text-xs text-stone-600">
              Most UK applicants use private health insurance. Options: international health insurance (e.g., Allianz, Cigna Global, Circle Health International), travel insurance with residence coverage, or direct Portuguese private insurance. Your proof of insurance must show coverage valid for your visa period.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 6: Prepare remaining documents</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          With DBS and income documentation in hand, prepare:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>• <strong>Passport:</strong> Valid for at least 6 months beyond your intended arrival date in Portugal</li>
          <li>• <strong>Passport photos:</strong> 2–4 color photos, 4×6 cm (confirm exact requirement with VFS)</li>
          <li>• <strong>Motivation letter:</strong> 1–2 pages in English or Portuguese, explaining your intention to reside in Portugal and your financial stability</li>
          <li>• <strong>Income summary sheet:</strong> One-page document with monthly income in EUR, employment type, and start date (generated by NomadPacket to ensure consistency)</li>
          <li>• <strong>National visa form (MNE):</strong> Official Portuguese visa application form, filled out completely (available from VFS or the MNE website)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 7: Book your VFS appointment and submit</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Once all documents are ready (especially the DBS certificate), book your appointment with VFS Global (Portugal) online or by phone. Appointment slots typically available 1–4 weeks out.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>At your VFS appointment, bring:</strong>
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
          <li>• All originals: passport, DBS certificate, employment letter, bank statements, etc.</li>
          <li>• Color copies of all documents</li>
          <li>• Completed visa form in full</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          VFS will collect your documents, verify they are complete, and forward them to the Portuguese MNE in Lisbon for processing. VFS will also provide you with a receipt and estimated collection/delivery date for your passport and visa.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">UK-specific timeline summary</h2>
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          <div className="flex items-start justify-between">
            <span>DBS criminal certificate</span>
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
            <span>VFS appointment availability</span>
            <span className="font-semibold">1–4 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Portuguese MNE processing (in Lisbon)</span>
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
                question: "Can I apply if I'm not a UK citizen but a UK resident?",
                answer:
                  "Yes, as long as you are lawfully resident in the UK and have a fixed address there. VFS will process your application as a UK-resident applicant. Non-citizenship is not a barrier, but you may need additional documentation proving your UK residency (e.g., council tax bill, lease agreement).",
              },
              {
                question: "Which type of DBS check do I need—Standard or Enhanced?",
                answer:
                  "For visa purposes, Standard DBS is usually sufficient. However, confirm directly with VFS Global or your consulate, as requirements can vary. Enhanced checks are more thorough and take longer; Standard is faster and cheaper.",
              },
              {
                question: "Do I need to get the DBS certificate translated into Portuguese?",
                answer:
                  "Check with VFS. Some consulates accept English DBS certificates; others require Portuguese translation. A brief email to VFS's visa inquiry address clarifies this.",
              },
              {
                question: "What if I've worked on a contract or fixed-term employment contract?",
                answer:
                  "As long as your employment ended less than 6 months ago and you now have a new remote role, the new employment is what matters. If you're between jobs, freelance income or a job offer letter (with start date) can suffice.",
              },
              {
                question: "Can I use a UK Self Assessment notice to prove income as a freelancer?",
                answer:
                  "Yes. Self Assessment tax returns (or a letter from your accountant confirming your annual income) count as income proof. Pair it with bank statements and invoices to show consistent, ongoing earnings.",
              },
              {
                question: "What if the DBS is delayed past my appointment date?",
                answer:
                  "Contact VFS immediately. In some cases, they allow you to reschedule, or you can submit without the DBS and follow up with it later (though this is not ideal). Start the DBS process as early as possible to avoid this scenario.",
              },
            ]}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">After your visa is approved</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Your D8 visa is typically valid for 1 year. Upon arrival in Portugal, you'll need to register for a residence permit (residência) at the AIMA office, obtain a NIF (Portuguese tax ID), and enroll in health insurance.
        </p>
      </section>

      <MarketingCta
        heading="Keep your UK application consistent"
        body="Generate your income summary and pre-filled visa form from one set of answers, ensuring your employment letter, bank statements, and motivation letter all align before your VFS appointment."
      />
      <Disclaimer />
    </main>
  );
}
