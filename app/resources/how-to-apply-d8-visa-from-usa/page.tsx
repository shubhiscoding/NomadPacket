import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "How to Apply for Portugal D8 Visa from USA: Complete Guide 2026",
  description: "Step-by-step USA guide to apply for Portugal's D8 visa: FBI criminal record certificate, income proof, US consulate locations, processing timeline, and visa requirements.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-usa") },
  openGraph: {
    title: "How to Apply for Portugal D8 Visa from USA",
    description: "Complete USA guide for applying for the Portugal D8 residence visa, including the FBI clearance process and consulate details.",
    url: canonicalUrl("/resources/how-to-apply-d8-visa-from-usa"),
    type: "article",
  },
};

export default function HowToApplyD8FromUsaPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">USA Applicant Guide</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        How to Apply for Portugal D8 Visa from the USA: Complete Guide
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <strong>US applicants follow the same core D8 requirements as UK and Canadian applicants, but the criminal record process and consulate routing are USA-specific.</strong> The FBI criminal clearance letter is the slowest step (often 4–8 weeks), so starting it immediately is critical. This guide walks through the sequence and the US-specific details.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 1: Identify your Portuguese consulate</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Portugal maintains multiple consulates across the USA, each serving specific geographic regions. Your application goes to the consulate responsible for the state where you legally reside (based on your driver's license address).
        </p>
        <div className="mt-4 rounded-lg border border-stone-200 p-4">
          <p className="text-sm font-semibold text-stone-900">Major Portuguese Consulates in the USA</p>
          <ul className="mt-2 flex flex-col gap-2 text-xs text-stone-600">
            <li>• <strong>New York:</strong> Serves the Northeast (NY, NJ, PA, CT, VT, NH, ME, MA, RI). Website: <span className="font-mono">www.consuladoportugues-ny.org</span></li>
            <li>• <strong>Boston:</strong> Serves parts of New England. Consulate website for details.</li>
            <li>• <strong>Los Angeles:</strong> Serves California, Nevada, Hawaii. Website: <span className="font-mono">www.consuladoportugues-la.org</span></li>
            <li>• <strong>San Francisco:</strong> Serves Northern California, Nevada. Website: <span className="font-mono">www.consuladoportugues-sf.org</span></li>
            <li>• <strong>Miami:</strong> Serves Florida and nearby states. Website: <span className="font-mono">www.consuladoportugues-miami.org</span></li>
            <li>• <strong>Washington D.C.:</strong> Embassy (handles some Midwest/regional routing). Website: <span className="font-mono">www.embaixadadeportugal.org</span></li>
            <li>• <strong>Other locations:</strong> Consulates also in Chicago, Houston, Providence. Check <span className="font-mono">mne.gov.pt</span> for the most current list.</li>
          </ul>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Action item:</strong> Go to your consulate's website now and note the visa appointment email, the current visa processing timeline (posted on their site), and whether they're using an external visa-processing center. Some consulates route D8 visa applications through VFS (Visa Facilitation Services), adding an extra step.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 2: Request the FBI criminal record certificate (start immediately)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          This is your time-limiting step. The FBI Identity History Summary (the official name of the US criminal clearance) takes 4–8 weeks to arrive, and you cannot apply for the D8 visa without it.
        </p>

        <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">How to request:</p>
          <ol className="mt-2 flex flex-col gap-2 text-xs text-amber-800">
            <li>1. Visit <span className="font-mono">fbi.gov/services/cjis/identity-history-summary-checks</span></li>
            <li>2. Order online (preferred—faster) or by mail. Online ordering typically takes 2–4 weeks.</li>
            <li>3. You'll provide fingerprints (either digitally if you submit a Live Scan card from a local police station, or manually if ordering by mail).</li>
            <li>4. Request <strong>2–3 certified copies</strong> (not just one), as you may need extras for other countries or in case the first gets lost.</li>
            <li>5. Do NOT request translation or apostille from the FBI—order the English version, then handle apostille and translation separately (detailed below).</li>
          </ol>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Pro tip:</strong> If you're near a US police station or FBI field office, you can submit your fingerprints in person for a Live Scan card, which speeds up processing to 1–2 weeks instead of 4–8. Check your local police department's website for Live Scan availability.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 3: Get the FBI certificate apostilled and translated</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Once the FBI sends you the Identity History Summary, you need two more steps before the Portuguese consulate will accept it:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Apostille</p>
            <p className="mt-1 text-xs text-stone-600">
              An official authentication confirming the FBI document is real. To apostille the FBI certificate, contact the <strong>US State Department</strong> (the state where the FBI issues the certificate) or use an apostille service (search "apostille services near me"). Cost is typically $10–30. Processing takes 1–2 weeks if done by mail, or 1–3 days if done in person at your state's Secretary of State office.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Translation into Portuguese</p>
            <p className="mt-1 text-xs text-stone-600">
              Your consulate will specify whether they want the certificate translated into Portuguese. Some accept English; others require Portuguese. Use a certified translator (search your city for "certified Portuguese translator"). Cost is typically $50–150 per document. Turnaround is 3–7 days.
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Timing:</strong> These steps add another 2–3 weeks total. Combined with the FBI certificate (4–8 weeks) + apostille (1–2 weeks) + translation (3–7 days), expect the full criminal record package to take 8–12 weeks from start to finish.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 4: Gather US income evidence (parallel with criminal record process)</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          While waiting for the FBI certificate, start gathering your income documentation. This is much faster:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For employees</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Email your HR department: "I'm applying for a Portugal work visa. Can you provide a signed employment confirmation letter stating my job title, hire date, gross monthly salary in USD, and that I'm authorized to work remotely from Portugal?"</li>
              <li>• Gather 6 months of recent payslips (PDF from payroll system if possible)</li>
              <li>• Download 6 months of bank statements from your checking account (PDF format)</li>
              <li>• If your salary is paid in USD but you want to show EUR for the visa, convert using a 6-month average exchange rate (check xe.com or your bank's historical rate)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">For freelancers and business owners</p>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-stone-600">
              <li>• Gather client contracts or engagement letters showing project scope and payment terms</li>
              <li>• Collect 6–12 months of invoices showing consistent billing to clients</li>
              <li>• Get your prior-year tax return (1040 + Schedule C if self-employed, or business tax return if you have an LLC/S-corp)</li>
              <li>• Download 6–12 months of bank statements showing deposits from clients</li>
              <li>• Calculate your average monthly income (gross, before taxes) over the past 6 months to verify it meets the €3,680 threshold (~$4,000 USD)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong>Key insight:</strong> The Portuguese consulate will cross-check these documents. If your employment letter says $5,000/month, but your bank statements show $3,500/month average, they'll request clarification or reject the application. Make sure everything is internally consistent before submitting.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 5: Arrange accommodation and health insurance</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          You don't need to have already moved to Portugal, but you need proof of where you'll live:
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Accommodation</p>
            <p className="mt-1 text-xs text-stone-600">
              A signed rental agreement, lease, or notarized letter from a landlord/property owner confirming you have the right to occupy a specific address in Portugal. Many US applicants book a rental from abroad (Airbnb, Booking.com for longer terms, or Portuguese rental sites like Idealista, Imovirtual). Ensure the agreement is signed and dated before your visa appointment.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 p-3">
            <p className="text-sm font-semibold text-stone-900">Health insurance</p>
            <p className="mt-1 text-xs text-stone-600">
              Most US applicants use private health insurance (easier to arrange before moving). Options include: international health insurance (e.g., Allianz, Cigna Global), travel insurance with residence coverage, or direct enrollment in Portuguese private insurance if the company accepts non-residents. Your consulate may ask to see proof at the appointment.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 6: Prepare the remaining documents</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          With criminal record and income documents in hand, prepare:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>• <strong>Passport:</strong> Valid for at least 6 months beyond your intended arrival date</li>
          <li>• <strong>Passport photos:</strong> 2–4 color photos, 4×6 cm (check your consulate's exact requirement)</li>
          <li>• <strong>Motivation letter:</strong> 1–2 pages explaining your intention to live in Portugal, your income, and ties to the country (see the motivation letter sample)</li>
          <li>• <strong>Income summary sheet:</strong> One-page document with your monthly income, employment type, and hire date (generated by NomadPacket)</li>
          <li>• <strong>National visa form (MNE):</strong> The official Portuguese visa application form, filled out completely (available on your consulate's website or MNE site)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Step 7: Schedule your consulate appointment and submit</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Contact your consulate's visa section via email (address on their website) with all documents ready. Book your appointment—wait times vary from 2 weeks to 3 months depending on consulate and season.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          At your appointment, bring:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-sm text-stone-600">
          <li>• All originals (passport, criminal record, employment letter, etc.)</li>
          <li>• Color copies of everything</li>
          <li>• Any documents in non-English languages (they may ask you to provide a translation on the spot)</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          The consulate will review everything and either approve on the spot or request additional clarification (usually within 2–4 weeks).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">USA-specific timeline summary</h2>
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          <div className="flex items-start justify-between">
            <span>FBI criminal certificate</span>
            <span className="font-semibold">4–8 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Apostille + translation</span>
            <span className="font-semibold">2–3 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Income documentation</span>
            <span className="font-semibold">1–2 weeks</span>
          </div>
          <div className="flex items-start justify-between">
            <span>Consulate appointment availability</span>
            <span className="font-semibold">2–12 weeks</span>
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
                question: "Do I need to apply at the consulate in the state where I was born?",
                answer:
                  "No. You apply at the consulate responsible for your current state of residence (where your driver's license is from). If you move to a different state before your visa appointment, contact your original consulate to determine whether you need to transfer your application.",
              },
              {
                question: "What if I don't have an FBI clearance yet when I want to book my appointment?",
                answer:
                  "You typically can't submit without it. Some consulates allow you to book an appointment while the criminal record is pending, but you won't be able to submit until you have the FBI certificate, apostille, and translation. Plan to have all three complete before your appointment date.",
              },
              {
                question: "Can I use an expedited FBI service?",
                answer:
                  "The FBI does not offer expedited processing. However, submitting your fingerprints in person via Live Scan at a local police station speeds up processing from 4–8 weeks to 1–3 weeks. This is your fastest option.",
              },
              {
                question: "What if I've moved and have multiple state residences?",
                answer:
                  "Apply at the consulate for the state where you currently have your primary residence (driver's license, voter registration, etc.). If it's unclear, contact your consulate's visa section for guidance.",
              },
              {
                question: "Do I need to translate my employment letter into Portuguese?",
                answer:
                  "Check your specific consulate's requirement. Some accept English employment letters; others want them in Portuguese. A short email to your consulate's visa email clarifies this.",
              },
              {
                question: "What if my employment letter says 'remote work authorized' but doesn't mention Portugal specifically?",
                answer:
                  "Ask your employer to revise it to explicitly state 'authorized to work remotely from Portugal.' Consulates want to see explicit authorization for Portugal, not just 'remote work in general.'",
              },
            ]}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">After your visa is approved</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Your visa is valid for typically 1 year. Upon arrival in Portugal, you'll need to:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
          <li>• Register for a residence permit (residência) at the AIMA office</li>
          <li>• Enroll in the Portuguese tax system and obtain a NIF (tax ID)</li>
          <li>• Register for health insurance (if not already done)</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          These are separate processes from the visa application, but they happen immediately after arrival.
        </p>
      </section>

      <MarketingCta
        heading="Sync your USA documents seamlessly"
        body="Build your income summary and pre-filled visa form from one set of answers. Ensure your employment letter, income figures, and motivation letter all align before your appointment."
      />
      <Disclaimer />
    </main>
  );
}
