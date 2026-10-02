import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Portugal D8 Visa Requirements: Step-by-Step Guide",
  description: "Understand Portugal D8 visa requirements from eligibility through submission, with a clear document-by-document preparation plan.",
  alternates: { canonical: canonicalUrl("/resources/portugal-d8-visa-requirements") },
  openGraph: { title: "Portugal D8 Visa Requirements: Step-by-Step Guide", description: "A clear preparation plan for the Portugal D8 residence visa.", url: canonicalUrl("/resources/portugal-d8-visa-requirements"), type: "article" },
};

export default function PortugalD8VisaRequirementsPage() {
  return (
    <SeoGuidePage
      eyebrow="Portugal D8 preparation"
      title="Portugal D8 Visa Requirements: A Step-by-Step Preparation Plan"
      intro={<>The Portugal D8 visa requirements are a mix of eligibility tests, official forms, and documents you must obtain yourself. Use this guide as a planning sequence, then confirm the final list with the Portuguese authority handling your application.</>}
      sections={[
        { heading: "Step 1: Confirm the visa route", content: <p>Portugal has more than one visa route that may appear in online searches. The D8 residence visa is the route for eligible remote workers intending to reside in Portugal. Do not use a D8 residence-visa document packet for a temporary-stay application; confirm the route before creating an account or paying a fee.</p> },
        { heading: "Step 2: Prove remote work and income", content: <p>Your evidence should make it easy to answer three questions: what work do you do, where does the income come from, and can you keep doing it from Portugal? An employment letter, client contracts, invoices, tax records, and bank statements can work together, but they should not contradict one another.</p> },
        { heading: "Step 3: Collect identity and civil documents", content: <p>Prepare your passport, photographs if required, application form, criminal record certificate, and any civil-status documents relevant to your application. Check validity periods before requesting time-sensitive certificates and follow the legalization and translation instructions for your country.</p> },
        { heading: "Step 4: Prepare Portugal-specific evidence", content: <p>Accommodation, health insurance, and proof of your intended residence are central parts of the file. Requirements and acceptable formats can change, so check the current instructions rather than relying on an old checklist or an applicant forum post.</p> },
        { heading: "Step 5: Do a consistency review", content: <p>Before submission, compare every date, monthly income figure, employer or client name, and address across the packet. The <Link href="/checklist" className="text-teal-800 underline">public D8 checklist</Link> helps you see what is generated, what is pre-filled, and what you still need to source.</p> },
      ]}
      faqs={[
        { question: "Are Portugal D8 visa requirements the same for everyone?", answer: "The core route is shared, but local submission instructions and home-country documents differ. Your criminal record process and appointment channel are especially likely to depend on where you apply." },
        { question: "How early should I start preparing?", answer: "Start as soon as you know the route, especially if you need an employer signature, a criminal record certificate, an apostille, or a translation. Time-sensitive documents should be requested with the appointment timeline in mind." },
        { question: "Can a checklist guarantee approval?", answer: "No. A checklist helps organize evidence against published requirements, but only the relevant authority decides an application. Unusual income, prior refusals, or criminal-record issues may justify professional advice." },
      ]}
      ctaHeading="Ready to work through the checklist?"
      ctaBody="Start with your country and visa type, then assemble the documents that fit your own employment and income situation."
    />
  );
}
