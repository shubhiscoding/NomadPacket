import type { ReactNode } from "react";

/**
 * Shared "you're about to be rate-limited" / "you've been rate-limited"
 * notice — reused across magic-link sign-in, packet-email, and document
 * regeneration so the visual language for every limit stays consistent
 * (amber for "action needed"/warning, matching StatusPill's palette).
 */
export function RateLimitNotice({
  tone = "warning",
  children,
}: {
  tone?: "warning" | "blocked";
  children: ReactNode;
}) {
  const className =
    tone === "blocked"
      ? "rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
      : "text-xs text-amber-700";

  return <p className={className}>{children}</p>;
}
