import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEnv } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// AGENTS.md §2: "one well-crafted heading typeface (serif or confident
// sans, not a default system font, as a trust signal)". Fraunces is a
// serif with just enough character to feel considered without tipping
// into decorative — paired with Geist (sans) for body copy.
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
});

// AGENTS.md §2: brand name is a plain-text wordmark, no logo yet — used in the
// page title/header, never inside generated document content.
//
// metadataBase resolves every page's relative canonical/OG URL against
// NEXT_PUBLIC_SITE_URL (never a hardcoded domain, per seo.md §2.5 and the
// project-wide rule). No title.template here — every page (incl. the
// marketing/resource pages added for SEO) writes its own complete,
// keyword-specific title including the "| NomadPacket" suffix where it
// wants one, rather than having one silently appended twice.
export const metadata: Metadata = {
  metadataBase: new URL(getEnv().NEXT_PUBLIC_SITE_URL),
  title: "NomadPacket — Portugal D8 Visa Document Packet",
  description:
    "Assemble the document packet for Portugal's D8 digital nomad residence visa.",
  // seo.md §6: Search Console verification, optional — set this env var
  // once you verify the domain in Search Console (Settings > Ownership
  // verification > HTML tag). Not part of lib/env.ts's required schema
  // since the site must still run before this is set up.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-stone-900">
        <Header />
        {children}
        <Footer />
        {/* seo.md §6: pageview + conversion-funnel tracking. Vercel
            Analytics tracks navigation only — never document content,
            per AGENTS.md §4's "no third-party analytics touching
            document content" rule. No-ops harmlessly off-Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
