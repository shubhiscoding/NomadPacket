import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "D8 Visa Portugal Requirements: What You Need",
  description: "A practical guide to D8 visa Portugal requirements, including income, remote work, accommodation, insurance, and supporting documents.",
  alternates: { canonical: canonicalUrl("/resources/d8-visa-portugal-requirements") },
  openGraph: { title: "D8 Visa Portugal Requirements: What You Need", description: "Understand the documents and evidence needed for Portugal's D8 residence visa.", url: canonicalUrl("/resources/d8-visa-portugal-requirements"), type: "article" },
};

export default function D8VisaPortugalRequirementsPage() {
  return (
    <SeoGuidePage
      eyebrow="D8 eligibility guide"
      title="D8 Visa Portugal Requirements: What You Need to Prepare"
      intro={<>The D8 visa Portugal requirements are easier to manage when you separate eligibility evidence from application paperwork. This guide walks through both, so you can find gaps before booking an appointment.</>}
      sections={[
        { heading: "The core eligibility requirements", content: <p>You need to show that your income is earned remotely from outside Portugal and is sufficient for the current D8 threshold. You also need a valid identity document, a genuine plan to reside in Portugal, and a clean application history or an explanation for anything that needs context.</p> },
        { heading: "Income evidence for employees and freelancers", content: <><p>Employees usually combine an employment contract, recent payslips, bank statements, and an employer letter confirming remote work from Portugal. Freelancers and business owners may use contracts, invoices, client letters, business registration records, and bank statements. The goal is not one magic document; it is a consistent story supported by primary evidence.</p><p className="mt-3">Use the <Link href="/tools/income-calculator" className="text-teal-800 underline">D8 income calculator</Link> for the threshold math, then verify the current official figure and evidence expectations with the authority handling your application.</p></> },
        { heading: "The supporting documents you should expect", content: <ul className="flex flex-col gap-2"><li>Passport and completed national visa application form</li><li>Proof of accommodation in Portugal</li><li>Health insurance covering the relevant period</li><li>Criminal record certificate from the required country or countries</li><li>Motivation letter and evidence supporting your remote-income situation</li><li>Country-specific legalization, apostille, or translation documents where required</li></ul> },
        { heading: "A practical order for gathering documents", content: <p>Request the criminal record certificate and any employer-signed letter early because they can take the longest. At the same time, confirm accommodation and insurance requirements. Finish by checking that names, dates, addresses, and income figures are identical across your documents. A complete <Link href="/checklist" className="text-teal-800 underline">Portugal D8 visa requirements checklist</Link> makes that review much easier.</p> },
      ]}
      faqs={[
        { question: "What is the most important D8 requirement?", answer: "You must be able to demonstrate qualifying remote work and foreign-sourced income with credible, consistent evidence. The current threshold and supporting-document rules should be checked against the official source for your application location." },
        { question: "Do D8 visa requirements change by nationality?", answer: "The core D8 eligibility rules are shared, but criminal-record certificates, apostilles, translations, appointment channels, and local submission instructions can vary by country." },
        { question: "Can I apply before every document is ready?", answer: "You can research and start preparing early, but do not book or submit until you have confirmed the current appointment and document requirements for your application location." },
      ]}
      ctaHeading="Turn the requirements into a packet you can review"
      ctaBody="NomadPacket keeps the details you enter consistent across your motivation letter, income summary, and pre-filled visa form."
    />
  );
}
