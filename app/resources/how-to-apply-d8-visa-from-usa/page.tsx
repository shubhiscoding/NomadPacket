import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Apply for D8 Visa from USA: Portugal Guide",
  description: "Learn how to apply for a Portugal D8 visa from the USA, including income evidence, the US criminal record process, and document preparation.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-usa") },
  openGraph: { title: "How to Apply for D8 Visa from USA", description: "A practical USA-specific preparation guide for Portugal's D8 visa.", url: canonicalUrl("/resources/how-to-apply-d8-visa-from-usa"), type: "article" },
};

export default function HowToApplyD8FromUsaPage() {
  return <SeoGuidePage eyebrow="USA applicant guide" title="How to Apply for the Portugal D8 Visa from the USA" intro={<>Applying for the Portugal D8 visa from the USA involves the same core eligibility test as other applicants, plus a US-specific criminal record and submission process. Here is the order that keeps the work manageable.</>} sections={[
    { heading: "1. Confirm your D8 route and application location", content: <p>Confirm that you want the D8 residence visa and identify the Portuguese consular or visa-processing channel responsible for your US residence. Local appointment instructions can change, so use the current official source before scheduling.</p> },
    { heading: "2. Prepare US income evidence", content: <p>Employees should prepare an employer letter confirming remote work from Portugal alongside salary and bank evidence. Freelancers and business owners should gather contracts, invoices, tax or registration records, and statements showing stable foreign-sourced income.</p> },
    { heading: "3. Request the required US criminal record certificate", content: <p>The correct certificate, authentication, apostille, and translation path depends on the current instructions for your application. Begin this step early and check the certificate freshness window so it does not expire before submission. The <Link href="/us" className="text-teal-800 underline">USA applicant guide</Link> has the country-specific details maintained for this flow.</p> },
    { heading: "4. Assemble and review the packet", content: <p>Prepare accommodation, insurance, identity documents, the national visa form, and your motivation letter. Compare every date and income figure across the files before your appointment. The <Link href="/checklist" className="text-teal-800 underline">full D8 checklist</Link> is useful for this final pass.</p> },
  ]} faqs={[{ question: "Where do I apply for the D8 visa from the USA?", answer: "Use the current Portuguese consular or authorized visa-processing instructions for the state where you legally reside. The correct channel and appointment availability can change." }, { question: "How long does the US criminal record step take?", answer: "Timing varies by certificate type, processing method, authentication, and apostille. Start it early and confirm the current freshness rule before ordering." }, { question: "Can NomadPacket submit my application?", answer: "No. It assembles draft documents and guidance. You remain responsible for checking official instructions, booking the appointment, and submitting the application." }]} ctaHeading="Make the USA document work easier to track" ctaBody="Answer once and review your generated motivation letter, income summary, and pre-filled form against the official USA checklist." />;
}
