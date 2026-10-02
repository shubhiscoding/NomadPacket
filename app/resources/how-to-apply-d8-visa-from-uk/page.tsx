import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Apply for D8 Visa from UK: Portugal Guide",
  description: "Learn how to apply for a Portugal D8 visa from the UK, including remote-income evidence, criminal record steps, and application preparation.",
  alternates: { canonical: canonicalUrl("/resources/how-to-apply-d8-visa-from-uk") },
  openGraph: { title: "How to Apply for D8 Visa from UK", description: "A practical UK-specific preparation guide for Portugal's D8 visa.", url: canonicalUrl("/resources/how-to-apply-d8-visa-from-uk"), type: "article" },
};

export default function HowToApplyD8FromUkPage() {
  return <SeoGuidePage eyebrow="UK applicant guide" title="How to Apply for the Portugal D8 Visa from the UK" intro={<>The Portugal D8 application from the UK combines the standard remote-income evidence with UK-specific criminal record and submission steps. This guide gives you a sensible preparation order without treating an old checklist as permanent.</>} sections={[
    { heading: "Start with the right visa and submission channel", content: <p>Confirm the D8 residence visa rather than the temporary-stay route, then check the current Portuguese authority or authorized visa center instructions for UK residents. Requirements, appointment systems, and document handling can change.</p> },
    { heading: "Build a clear remote-income file", content: <p>Employees should request a signed confirmation of employment, salary, and permission to work from Portugal. Freelancers and business owners should connect contracts or client letters to invoices, tax records, and bank statements. Consistency matters more than a large pile of unrelated files.</p> },
    { heading: "Handle the UK criminal record certificate carefully", content: <p>Confirm which UK certificate is accepted for your application and whether it needs an apostille or translation. Order it with the submission date in mind. The <Link href="/uk" className="text-teal-800 underline">UK applicant guide</Link> contains the maintained country-specific steps.</p> },
    { heading: "Finish the Portugal documents", content: <p>Prepare accommodation, health insurance, passport materials, the national visa form, and a concise motivation letter. Use the <Link href="/checklist" className="text-teal-800 underline">D8 document checklist</Link> to catch missing items before the appointment.</p> },
  ]} faqs={[{ question: "Can I apply for the Portugal D8 visa from the UK if I am not a UK citizen?", answer: "Usually the key question is lawful residence and the application channel responsible for your address, not citizenship alone. Check the current official instructions for your status." }, { question: "Does a UK criminal record certificate need an apostille?", answer: "That depends on the certificate and current submission instructions. Confirm the exact certificate, apostille, translation, and freshness requirements before ordering." }, { question: "What is the best first step?", answer: "Confirm the visa route and application channel, then start the criminal record and employer-letter steps because they often take longer than filling out the form." }]} ctaHeading="Keep your UK application consistent" ctaBody="Generate the draft documents from one set of answers, then check them against the current UK and Portugal requirements before submission." />;
}
