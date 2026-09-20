import Link from "next/link";

/**
 * The one recurring CTA banner across marketing/resource pages — always
 * into /start (the qualifier gate), never a direct shortcut into the
 * questionnaire, so the "never silently degrade to a built path" rule in
 * AGENTS.md §1 holds no matter which page someone lands on first.
 */
export function MarketingCta({
  heading = "Ready to start your D8 packet?",
  body = "Answer a short questionnaire once — NomadPacket generates your motivation letter, income summary, and pre-filled visa form.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <div className="mt-10 rounded-xl border border-teal-100 bg-teal-50/60 p-6">
      <h2 className="text-lg font-medium text-stone-900">{heading}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{body}</p>
      <Link
        href="/start"
        className="mt-4 inline-flex w-fit items-center rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
      >
        Start your application
      </Link>
    </div>
  );
}
