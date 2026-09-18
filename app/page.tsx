import Link from "next/link";

/**
 * Landing page. Tone per AGENTS.md §2: calm, precise, professional — "like
 * a good accountant's site," not a flashy startup. No hype copy, no
 * gamification. Plain-text wordmark already renders via the global
 * Header — this page is just the pitch and a single call to action into
 * the qualifier gate.
 */
export default function LandingPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-24">
      <p className="text-sm font-medium text-teal-800">Portugal D8 Residence Visa</p>
      <h1 className="mt-3 max-w-lg text-4xl font-medium leading-tight text-stone-900">
        Your document packet, assembled correctly.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-stone-600">
        NomadPacket puts together the motivation letter, income summary, and pre-filled
        national visa form you need for Portugal&apos;s D8 residence visa — then tells you
        exactly what else to gather, based on where you&apos;re applying from.
      </p>

      <Link
        href="/start"
        className="mt-8 inline-flex w-fit items-center rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
      >
        Start your application
      </Link>

      <p className="mt-12 max-w-md text-xs leading-relaxed text-stone-400">
        This tool assembles documents based on publicly available Portuguese consulate and
        AIMA requirements. It does not provide legal advice and cannot guarantee visa
        approval — no service can.
      </p>
    </main>
  );
}
