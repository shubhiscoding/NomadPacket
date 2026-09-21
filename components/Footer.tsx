import Link from "next/link";

/**
 * Global footer — the only place /terms and /privacy are linked from, since
 * neither is part of the main conversion flow (AGENTS.md §2's minimal-nav
 * Header stays link-free for that reason).
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-100 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-400">
        <span>&copy; {new Date().getFullYear()} NomadPacket</span>
        <Link href="/terms" className="hover:text-stone-600">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-stone-600">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
