import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Apply for D8 Visa from Canada: Portugal Guide",
  description: "Learn how to apply for a Portugal D8 visa from Canada, including remote-income evidence, Canadian criminal record steps, and document preparation.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-canada") },
  openGraph: { title: "How to Apply for D8 Visa from Canada", description: "A practical Canada-specific preparation guide for Portugal's D8 visa.", url: canonicalUrl("/resources/how-to-apply-d8-visa-from-canada"), type: "article" },
};

export default function HowToApplyD8FromCanadaPage() {
  return <SeoGuidePage eyebrow="Canada applicant guide" title="How to Apply for the Portugal D8 Visa from Canada" intro={<>Canadian applicants follow the standard D8 eligibility rules, but the criminal record certificate and local submission instructions deserve their own preparation plan. Use this guide to organize the application before you book.</>} sections={[
    { heading: "Confirm your route and place of application", content: <p>Make sure you are applying for the D8 residence visa and check the current Portuguese authority or authorized visa-processing instructions for your Canadian residence. Do not assume the same appointment route applies in every province.</p> },
    { heading: "Document your remote work", content: <p>Employees should obtain a letter confirming employment, salary, and authorization to work remotely from Portugal. Self-employed applicants should connect contracts, invoices, business records, and bank evidence into a clear explanation of stable foreign-sourced income.</p> },
    { heading: "Plan the Canadian criminal record step", content: <p>Confirm which Canadian police certificate is accepted, along with any fingerprinting, authentication, apostille, translation, and freshness rules. Begin early. The <Link href="/ca" className="text-teal-800 underline">Canada applicant guide</Link> contains the country-specific preparation details.</p> },
    { heading: "Review the complete packet", content: <p>Gather accommodation, insurance, passport materials, the national visa application, and your motivation letter. Before submission, compare names, dates, addresses, and income amounts across every document using the <Link href="/checklist" className="text-teal-800 underline">Portugal D8 checklist</Link>.</p> },
  ]} faqs={[{ question: "Where do Canadians apply for the Portugal D8 visa?", answer: "Use the current official instructions for the Portuguese consular or authorized processing channel responsible for your Canadian residence. The correct route can change." }, { question: "How early should I request the Canadian police certificate?", answer: "Request it early enough to allow for processing and any authentication, while keeping the certificate within the freshness period required at submission." }, { question: "Do I need a motivation letter?", answer: "A clear personal statement is commonly part of a D8 application file. It should match your income evidence, accommodation plan, and intended residence dates." }]} ctaHeading="Prepare your Canadian D8 packet in one pass" ctaBody="NomadPacket keeps your generated letters, income summary, and visa form aligned while you work through the official checklist." />;
}
