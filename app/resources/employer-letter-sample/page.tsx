import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "D8 Visa Employer Letter: Sample + What to Say If HR Pushes Back",
  description:
    "A real D8 visa employer remote-work confirmation letter example, plus a script for " +
    "asking HR to sign it and what to say if they hesitate.",
  alternates: { canonical: canonicalUrl("/resources/employer-letter-sample") },
  openGraph: {
    title: "D8 Visa Employer Letter: Sample + What to Say If HR Pushes Back",
    description: "A real example, plus a script for the HR conversation.",
    url: canonicalUrl("/resources/employer-letter-sample"),
    type: "article",
  },
};

export default function EmployerLetterSamplePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">D8 Visa Documents</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        D8 Visa Employer Confirmation Letter: Sample, and What to Do If HR Hesitates
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        If you&apos;re an employee (rather than a freelancer or business owner), the
        consulate wants written confirmation — from your employer, not from you — that
        your role is genuinely remote and that they&apos;re authorizing you to work
        from Portugal. This is the one D8 document you can&apos;t generate entirely
        yourself: someone at your company has to sign it. Below is what a good one
        looks like, and what to do if your HR department hesitates.
      </p>

      <section className="mt-10 rounded-xl border border-stone-200 bg-stone-50 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Example — fictional company
        </p>
        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-stone-700">
          <p>[Halcyon Software — Company Letterhead]</p>
          <p>To Whom It May Concern,</p>
          <p>
            This letter confirms that Sarah Mitchell has been employed by Halcyon
            Software as a Senior Product Designer since June 2021. She is a full-time
            remote employee, and her role does not require physical presence at any
            company location.
          </p>
          <p>
            Sarah Mitchell&apos;s current gross monthly salary is $6,200. Halcyon
            Software confirms that she is authorized to continue performing her duties
            remotely from Portugal for the duration of her employment.
          </p>
          <p>Please contact the undersigned with any questions regarding this confirmation.</p>
          <p>
            Priya Anand, Director of People Operations
            <br />
            Halcyon Software
            <br />
            priya.anand@halcyon.example · (512) 555-0134
            <br />
            September 20, 2026
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">What the letter needs to say</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>Your job title and how long you&apos;ve been employed there</li>
          <li>An explicit statement that your role is remote and doesn&apos;t require physical presence</li>
          <li>Your gross monthly salary, in the currency you&apos;re paid in</li>
          <li>Explicit authorization to work remotely from Portugal specifically, not just &quot;remote work in general&quot;</li>
          <li>A named signatory (usually HR or your direct manager) with contact details, on letterhead if possible</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Note what it deliberately doesn&apos;t need: a lawyer, a notary, or company
          legal review in most cases. It&apos;s a factual confirmation, not a contract
          amendment — treat the request to HR accordingly, which matters for the
          conversation below.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          If HR hesitates: a script that actually works
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          This is genuinely the most common friction point in the whole D8 process —
          not because companies object to remote work, but because an unfamiliar
          request framed as &quot;immigration paperwork&quot; sounds bigger than it is. Most
          hesitation clears up once HR sees the actual letter (it&apos;s short and
          asks the company to confirm facts it already knows), so lead with the draft
          rather than the ask.
        </p>
        <div className="mt-4 rounded-lg border border-stone-200 p-4 text-sm leading-relaxed text-stone-600">
          <p className="font-medium text-stone-900">Try this framing:</p>
          <p className="mt-2">
            &quot;I&apos;m applying for a Portugal digital nomad visa, which requires a
            short letter from my employer confirming my role, salary, and that it&apos;s
            remote. I&apos;ve drafted it already — it&apos;s three short paragraphs and
            doesn&apos;t commit the company to anything beyond confirming what&apos;s
            already true. Could you (or whoever&apos;s appropriate) review and sign
            it?&quot;
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          If they push back specifically on liability or precedent concerns: point out
          the letter doesn&apos;t change your employment terms, doesn&apos;t commit the
          company to permanent remote work beyond your stated visa period, and is a
          factual statement rather than a contractual one. If your company genuinely
          can&apos;t or won&apos;t provide it — some larger companies route this through
          legal and it takes weeks, or a company policy simply prohibits it — that&apos;s
          worth knowing early, since it may affect whether the employee-letter path or a
          different visa approach makes sense for you.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "What if I'm a freelancer or business owner, not an employee?",
                answer:
                  "You don't need an employer letter at all — a freelancer/business income narrative replaces it, describing your client base and income stability instead. NomadPacket generates whichever one applies based on how you answer the employment-type question.",
              },
              {
                question: "Does the employer letter need to be notarized or apostilled?",
                answer:
                  "Generally no — unlike your criminal record certificate, this is a standard business letter on letterhead, not a document requiring legalization. Confirm with your specific consulate if you're unsure.",
              },
              {
                question: "What if my employer will only confirm employment, not the remote-work part?",
                answer:
                  "Push for the remote-work confirmation specifically — it's the detail the consulate actually needs. A generic employment-verification letter (the kind used for loan applications) usually won't state that your role is location-independent, which is the whole point for a D8 application.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading="Generate the draft to send to your HR team"
        body="NomadPacket writes the employer confirmation letter from your answers — ready to send as a starting draft for your employer to review and sign."
      />
      <Disclaimer />
    </main>
  );
}
