"use client";

import { useState } from "react";
import { RateLimitNotice } from "@/components/RateLimitNotice";

/**
 * Download + email as one cohesive unit — the email button's send-status
 * and "N left" feedback render on their own full-width line below both
 * buttons, not nested under just the email button (which previously made
 * them look like a stray, disconnected fragment next to Download).
 */
export function PaidDeliveryActions({ applicationId }: { applicationId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleEmailClick() {
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}/email-packet`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`/api/documents/${applicationId}/download`}
          className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
        >
          Download packet (.zip)
        </a>
        <button
          type="button"
          onClick={handleEmailClick}
          disabled={status === "sending"}
          className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Email me my packet"}
        </button>
      </div>
      {status === "sent" && <p className="text-sm text-teal-800">Sent — check your inbox.</p>}
      {status === "error" && message && <p className="text-sm text-red-600">{message}</p>}
      {remaining !== null && remaining <= 2 && (
        <RateLimitNotice>
          {remaining} email{remaining === 1 ? "" : "s"} left for this packet today.
        </RateLimitNotice>
      )}
    </div>
  );
}
