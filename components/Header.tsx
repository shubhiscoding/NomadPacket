import Link from "next/link";

/**
 * Plain-text wordmark header (AGENTS.md §2: "no logo mark yet"). Global —
 * appears on every screen so the brand stays visible throughout the flow,
 * but stays minimal (no nav links) since v1 has no dashboard beyond a
 * single in-progress application.
 */
export function Header() {
  return (
    <header className="border-b border-stone-100 px-6 py-4">
      <Link href="/" className="font-heading text-lg font-semibold text-stone-900">
        NomadPacket
      </Link>
    </header>
  );
}
