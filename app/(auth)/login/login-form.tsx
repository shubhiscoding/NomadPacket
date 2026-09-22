"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RateLimitNotice } from "@/components/RateLimitNotice";

export function LoginForm({ showGoogleFallbackLink = true }: { showGoogleFallbackLink?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <label htmlFor="login-email" className="text-sm font-medium text-stone-700">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700"
      />
      {remaining !== null && remaining <= 2 && (
        <RateLimitNotice>
          {remaining} sign-in email{remaining === 1 ? "" : "s"} left before a short cooldown.
        </RateLimitNotice>
      )}
      {status === "error" && errorMessage && (
        <div>
          <p className="text-sm text-red-600">{errorMessage}</p>
          {showGoogleFallbackLink && (
            <Link
              href="/signin"
              className="mt-1 inline-block text-sm font-medium text-teal-800 hover:underline"
            >
              Sign in with Google instead
            </Link>
          )}
        </div>
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
