import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "D8 Visa Motivation Letter: Sample + Generator",
  description:
    "See a real D8 visa motivation letter example, then generate your own " +
    "personalized version in minutes based on your job, income, and move date.",
  alternates: { canonical: canonicalUrl("/resources/motivation-letter-sample") },
  openGraph: {
    title: "D8 Visa Motivation Letter: Free Sample + Generator",
    description: "A real example, plus a tool that writes your personalized version.",
    url: canonicalUrl("/resources/motivation-letter-sample"),
    type: "article",
  },
};

export default function MotivationLetterSamplePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">D8 Visa Documents</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        D8 Visa Motivation Letter: Example and What Makes One Work
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        The motivation letter is the one document in your D8 packet that&apos;s
        entirely in your own words. Consulates read it to confirm three things:
        that your work is genuinely location-independent, that you understand
        what you&apos;re applying for, and that your move is deliberate rather
        than vague. Below is a realistic example (a fictional applicant), followed
        by what actually makes each part of it work — because copy-pasting a
        generic template is exactly what a consular officer is trained to spot.
      </p>

      <section className="mt-10 rounded-xl border border-stone-200 bg-stone-50 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          Example — fictional applicant
        </p>
        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-stone-700">
          <p>To the Consular Section, Embassy/Consulate of Portugal in the United States,</p>
          <p>
            I, Sarah Mitchell, a citizen of the United States currently residing in
            Austin, Texas, am writing to formally express my intention to relocate to
            Portugal under the D8 Residence Visa program.
          </p>
          <p>
            I work as a Senior Product Designer at Halcyon Software, earning income
            that is entirely sourced from outside Portugal. My work is fully remote
            and location-independent, allowing me to continue performing my
            professional duties without interruption while residing in Portugal.
          </p>
          <p>
            I intend to relocate to Portugal on or around March 1, 2027 and reside at
            Rua das Flores 12, Lisbon. I have arranged comprehensive health insurance
            valid in Portugal and can demonstrate a stable monthly income of $6,200,
            well in excess of the minimum threshold required for this visa category.
          </p>
          <p>
            I am drawn to Portugal for its balance of a rich cultural history and a
            genuinely livable pace of daily life, and I look forward to contributing
            to and being part of Portuguese life during my stay.
          </p>
          <p>
            Sincerely,
            <br />
            Sarah Mitchell
            <br />
            September 20, 2026
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Why this works, paragraph by paragraph</h2>
        <ul className="mt-3 flex flex-col gap-4 text-sm leading-relaxed text-stone-600">
          <li>
            <strong className="text-stone-900">The opening states intent, plainly.</strong>{" "}
            No throat-clearing — nationality, current location, and exactly which visa
            category, in the first sentence. A consular officer reading dozens of these
            should never have to guess what they&apos;re looking at.
          </li>
          <li>
            <strong className="text-stone-900">
              &quot;Entirely sourced from outside Portugal&quot; is doing real work.
            </strong>{" "}
            This is the specific legal condition the D8 visa depends on — remote,
            foreign-sourced income. Say it explicitly rather than assuming it&apos;s
            implied by your job title.
          </li>
          <li>
            <strong className="text-stone-900">Specific numbers, not vague ones.</strong>{" "}
            An exact move-in date and address (if known), an exact income figure. Vague
            language (&quot;sometime next year,&quot; &quot;sufficient income&quot;) reads as unprepared,
            not humble.
          </li>
          <li>
            <strong className="text-stone-900">
              The personal reason is short and genuine, not a paragraph of tourism-brochure
              language.
            </strong>{" "}
            One real sentence beats three generic ones about &quot;rich culture and beautiful
            beaches&quot; that could be copy-pasted into any applicant&apos;s letter.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          Why a generic template usually isn&apos;t enough
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          A blank template with bracketed placeholders gets you the right structure, but
          every one of the specific details above — your job title, your exact income
          figure formatted in your currency, whether you&apos;re an employee or
          freelancer (which changes an entire paragraph&apos;s phrasing), your actual
          move date — has to be filled in correctly and consistently with the rest of
          your packet. A mismatch between your motivation letter and your income summary
          sheet (different dates, different income figures) is exactly the kind of small
          inconsistency that draws a follow-up request from a consulate. NomadPacket
          generates the letter directly from the same answers that generate your income
          summary and pre-filled visa form, so the three documents can&apos;t drift out
          of sync with each other.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "How long should a D8 motivation letter be?",
                answer:
                  "One page is standard — the example above is close to the right length. Consulates process high volumes of applications; a letter that states its case clearly in a few paragraphs reads better than a long one that buries the key facts.",
              },
              {
                question: "Does the motivation letter need to be notarized?",
                answer:
                  "No — it's a personal statement, signed by the applicant, not a notarized legal document. Requirements can vary by consulate, so confirm with yours if you're unsure.",
              },
              {
                question: "Can I use the same motivation letter for a spouse or dependent?",
                answer:
                  "Each applicant should have their own letter reflecting their own circumstances — a dependent's letter typically references the primary applicant's income and the family's shared move rather than restating independent income they may not have.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta
        heading="Generate your own, personalized version"
        body="Answer a few questions about your job, income, and move date — NomadPacket writes your motivation letter (and the rest of your packet) to match."
      />
      <Disclaimer />
    </main>
  );
}
