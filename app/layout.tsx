import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Header } from "@/components/Header";
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
export const metadata: Metadata = {
  title: "NomadPacket — Portugal D8 Visa Document Packet",
  description:
    "Assemble the document packet for Portugal's D8 digital nomad residence visa.",
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
      </body>
    </html>
  );
}
