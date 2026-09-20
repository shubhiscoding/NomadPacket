import Link from "next/link";
import { Faq } from "@/components/Faq";

/**
 * Landing page — rebuilt for conversion, not just presence. Structure
 * follows what actually moves anxious, high-intent B2C traffic (per
 * landing-page-conversion research, 2026): one named outcome in the
 * headline (not a product category), one CTA above the fold, a
 * product-forward visual instead of illustration, and trust built from
 * specificity/process transparency rather than testimonials — deliberate,
 * since this is a pre-launch product with zero real customers yet, and
 * AGENTS.md forbids anything resembling fabricated trust signals as much
 * as it forbids fabricated legal claims. Tone stays "calm, precise,
 * professional" throughout (AGENTS.md §2) — no urgency countdowns, no
 * gamification, even though those are common high-conversion patterns
 * elsewhere; they'd read as exploitative for an anxious visa applicant.
 */
export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-6 pt-20 pb-16 text-center">
        <p className="text-sm font-medium text-teal-800">Portugal D8 Residence Visa</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-medium leading-tight text-stone-900 sm:text-5xl">
          Your D8 visa documents, done correctly — not just done fast.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Answer one questionnaire. NomadPacket writes your motivation letter, employer or
          freelancer income letter, and income summary, pre-fills the official national visa
          form, and tells you exactly what else your consulate needs — based on whether
          you&apos;re applying from the US, UK, or Canada.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/start"
            className="inline-flex items-center rounded-lg bg-teal-800 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal-900"
          >
            Start your application
          </Link>
          <p className="text-xs text-stone-400">
            Free to preview your documents. Pay once, only when you download.
          </p>
        </div>

        {/* Product-forward visual: a stylized preview of the checklist screen,
            built from real UI primitives (no stock illustration). */}
        <div className="mx-auto mt-14 max-w-md rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
            Your document packet
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            {[
              { label: "Motivation letter", status: "done" },
              { label: "Employer confirmation letter", status: "done" },
              { label: "Income summary cover sheet", status: "done" },
              { label: "National visa form (pre-filled)", status: "done" },
              { label: "Criminal record certificate", status: "action" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2"
              >
                <span className="text-sm text-stone-700">{item.label}</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    item.status === "done"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {item.status === "done" ? "Done" : "Action Needed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specificity bar — trust through precision, not logos/testimonials
          we don't have yet. */}
      <section className="border-y border-stone-100 bg-stone-50/60 py-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-center text-sm text-stone-500">
          <span>Built for US, UK &amp; Canadian applicants</span>
          <span className="hidden sm:inline">·</span>
          <span>Every threshold sourced and dated</span>
          <span className="hidden sm:inline">·</span>
          <span>Document assembly, not legal advice</span>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-2xl font-medium text-stone-900">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Answer once",
              body: "A short questionnaire about your job, income, family, and move date — one focused question at a time.",
            },
            {
              step: "2",
              title: "We write your documents",
              body: "Your motivation letter, income letter, and income summary are generated from your answers — and the official visa form is pre-filled to match.",
            },
            {
              step: "3",
              title: "Get your full checklist",
              body: "See exactly what's left to gather yourself, with country-specific guidance for your criminal record certificate, NIF, and more.",
            },
          ].map((item) => (
            <div key={item.step}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-sm font-semibold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-base font-medium text-stone-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why this instead of a blank template */}
      <section className="border-t border-stone-100 bg-stone-50/60 py-16">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-medium text-stone-900">
            Why not just copy a template?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-stone-600">
            A blank template gets you the right structure. It doesn&apos;t know your job
            title, your exact income figure, whether you&apos;re an employee or a
            freelancer, or your actual move date — and it definitely doesn&apos;t keep
            those details consistent across your motivation letter, your income summary,
            and your visa form. A mismatch between documents is exactly the kind of small
            inconsistency that draws a follow-up request from a consulate. NomadPacket
            generates every document from the same answers, so they can&apos;t drift out
            of sync with each other.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-2xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq
            items={[
              {
                question: "Is this legal advice?",
                answer:
                  "No. NomadPacket assembles documents based on publicly available Portuguese consulate and AIMA requirements — it doesn't provide legal advice and can't guarantee visa approval. If your situation involves a criminal record, a prior visa refusal, or unusual income sources, talk to an immigration lawyer.",
              },
              {
                question: "What do I need to pay for?",
                answer:
                  "You can preview every generated document for free. Payment is required once, to download and receive your complete packet by email.",
              },
              {
                question: "Which countries does this support?",
                answer:
                  "Portugal's D8 residence visa only, for applicants from the US, UK, or Canada. Other countries and the temporary-stay visa variant aren't supported yet.",
              },
            ]}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stone-100 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-medium text-stone-900">
            Ready to start your D8 packet?
          </h2>
          <Link
            href="/start"
            className="mt-6 inline-flex items-center rounded-lg bg-teal-800 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal-900"
          >
            Start your application
          </Link>
          <p className="mx-auto mt-10 max-w-md text-xs leading-relaxed text-stone-400">
            This tool assembles documents based on publicly available Portuguese consulate
            and AIMA requirements. It does not provide legal advice and cannot guarantee
            visa approval — no service can.
          </p>
        </div>
      </section>
    </main>
  );
}
