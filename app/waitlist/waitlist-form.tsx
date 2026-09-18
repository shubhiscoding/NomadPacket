"use client";

import { useState } from "react";

export function WaitlistForm({ country, visaType }: { country: string; visaType: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, country, visaType }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="mt-8 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Thanks — we&apos;ll email you when this is ready.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <label htmlFor="waitlist-email" className="text-sm font-medium text-stone-700">
        Email
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700"
      />
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Notify me"}
      </button>
    </form>
  );
}
