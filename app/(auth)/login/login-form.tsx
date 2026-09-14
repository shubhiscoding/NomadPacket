"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-700"
      />
      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
