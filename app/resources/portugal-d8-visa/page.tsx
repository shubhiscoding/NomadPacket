import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Portugal D8 Visa: Requirements and Application Guide",
  description: "Looking for the Portugal D8 visa? This guide explains the digital nomad residence visa, core requirements, documents, and next steps.",
  alternates: { canonical: canonicalUrl("/resources/portugal-d8-visa") },
  openGraph: { title: "Portugal D8 Visa: Requirements and Application Guide", description: "A practical guide to Portugal's D8 residence visa for remote workers.", url: canonicalUrl("/resources/portugal-d8-visa"), type: "article" },
};

export default function PortugalD8VisaPage() {
  return <SeoGuidePage eyebrow="Portugal D8 visa guide" title="Portugal D8 Visa: Requirements, Documents, and Next Steps" intro={<>If you searched for Portugal&apos;s D8 visa, you are likely looking for the Portugal digital nomad residence visa. This guide explains the requirements, documents, and next steps in one place.</>} sections={[
    { heading: "What the Portugal D8 visa is", content: <p>The D8 is Portugal&apos;s residence route for eligible remote workers with foreign-sourced income. It is not a shortcut around the official application and it is separate from the temporary-stay option, so confirm the intended visa type before preparing documents.</p> },
    { heading: "What you will need", content: <p>Prepare evidence of remote income, accommodation, health insurance, identity, a criminal record certificate, the national visa form, and a motivation letter. The exact certificate and legalization path depends on where you apply.</p> },
    { heading: "Your next step", content: <p>Start with the <Link href="/checklist" className="text-teal-800 underline">Portugal D8 requirements checklist</Link>, then open the guide for your country: <Link href="/us" className="text-teal-800 underline">USA</Link>, <Link href="/uk" className="text-teal-800 underline">UK</Link>, or <Link href="/ca" className="text-teal-800 underline">Canada</Link>.</p> },
  ]} faqs={[{ question: "What is the Portugal D8 visa?", answer: "The Portugal D8 visa is a residence route for eligible remote workers with foreign-sourced income. It is often called the Portugal digital nomad visa." }, { question: "Can I apply online?", answer: "Research and some appointment steps may be online, but the official submission process depends on your application location and may require an in-person appointment." }, { question: "Does this page provide legal advice?", answer: "No. It provides document-assembly guidance based on published requirements. Confirm the current official instructions and seek professional advice for unusual circumstances." }]} ctaHeading="Turn your search into a clear starting point" ctaBody="Choose your country and visa type first, then prepare a consistent document packet for your own application." />;
}