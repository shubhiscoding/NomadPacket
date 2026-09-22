"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { qualifierGateOptions } from "@/country-config/qualifier-gate";

/**
 * Step 1 (AGENTS.md build order): the qualifier gate. No auth required.
 * Renders whatever qualifierGateOptions holds — adding a second visa type
 * or country is a config change (country-config/qualifier-gate.ts), never a
 * change to this component.
 *
 * `?new=1` (only ever set by the checklist's "Fill new form" link) is
 * threaded through to /api/qualifier as `forceNew` — see
 * lib/gate-context.ts for why this explicit flag exists rather than
 * treating any valid gate-context cookie as "start fresh": every sign-in
 * passes through this same page, so cookie presence alone can't tell
 * "just logging in" apart from "explicitly starting over."
 *
 * `useSearchParams()` requires a Suspense boundary above it (Next.js App
 * Router build-time requirement, not optional) — the default export here
 * is just that boundary; StartForm below has the actual page.
 */
export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartForm />
    </Suspense>
  );
}

function StartForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceNew = searchParams.get("new") === "1";
  const [selected, setSelected] = useState(qualifierGateOptions[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/qualifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selected.country, visaType: selected.visaType, forceNew }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const data = await res.json();
      router.push(data.redirectTo);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex flex-1 max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-stone-500">NomadPacket · Portugal</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">
        Which are you applying for?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        This determines which documents we help you assemble. You can check
        this before creating an account.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {qualifierGateOptions.map((option) => {
          const isSelected =
            option.country === selected.country && option.visaType === selected.visaType;
          return (
            <button
              key={`${option.country}-${option.visaType}`}
              type="button"
              onClick={() => setSelected(option)}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                isSelected
                  ? "border-teal-700 bg-teal-50 text-teal-900"
                  : "border-stone-200 text-stone-700 hover:border-stone-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleContinue}
        disabled={submitting}
        className="mt-8 rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
      >
        {submitting ? "Continuing…" : "Continue"}
      </button>
    </main>
  );
}
