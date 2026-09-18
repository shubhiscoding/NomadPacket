"use client";

import { useState } from "react";

export function DeliveryActions({ applicationId }: { applicationId: string }) {
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleEmailPacket() {
    setEmailStatus("sending");
    try {
      const res = await fetch(`/api/applications/${applicationId}/email-packet`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("failed");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`/api/documents/${applicationId}/download`}
        className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
      >
        Download packet (.zip)
      </a>
      <button
        type="button"
        onClick={handleEmailPacket}
        disabled={emailStatus === "sending"}
        className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 disabled:opacity-60"
      >
        {emailStatus === "sending"
          ? "Sending…"
          : emailStatus === "sent"
            ? "Emailed ✓"
            : "Email me my packet"}
      </button>
      {emailStatus === "error" && (
        <p className="text-sm text-red-600">Couldn&apos;t send the email. Try again.</p>
      )}
    </div>
  );
}
