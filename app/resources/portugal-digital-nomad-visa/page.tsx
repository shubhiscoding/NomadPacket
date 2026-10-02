import type { Metadata } from "next";
import Link from "next/link";
import { SeoGuidePage } from "@/components/SeoGuidePage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Portugal Digital Nomad Visa: Complete D8 Guide",
  description:
    "Learn how the Portugal digital nomad visa works, what the D8 application requires, and how to prepare a complete document packet.",
  alternates: { canonical: canonicalUrl("/resources/portugal-digital-nomad-visa") },
  openGraph: {
    title: "Portugal Digital Nomad Visa: Complete D8 Guide",
    description: "A practical guide to Portugal's D8 residence visa for remote workers.",
    url: canonicalUrl("/resources/portugal-digital-nomad-visa"),
    type: "article",
  },
};

export default function PortugalDigitalNomadVisaPage() {
  return (
    <SeoGuidePage
      eyebrow="Portugal visa guide"
      title="Portugal Digital Nomad Visa: How the D8 Visa Works"
      intro={
        <>
          Portugal&apos;s digital nomad visa is the D8 residence visa for people who earn
          income remotely from outside Portugal. This guide explains the decision points
          that matter before you start collecting paperwork: eligibility, evidence, the
          application route, and what happens after approval.
        </>
      }
      sections={[
        {
          heading: "What is the Portugal digital nomad visa?",
          content: (
            <p>
              The D8 residence visa is designed for non-EU/EEA remote workers who want to
              live in Portugal while continuing work for employers, clients, or businesses
              outside Portugal. It is different from a short tourist stay and different
              from Portugal&apos;s D7 passive-income route. Choose the path that matches your
              real source of income and intended stay before preparing documents.
            </p>
          ),
        },
        {
          heading: "Who is the D8 visa for?",
          content: (
            <>
              <p>
                The strongest fit is an applicant who can show stable, foreign-sourced
                remote income and a genuine plan to reside in Portugal. Employees normally
                document their role, salary, and permission to work remotely. Freelancers
                and business owners document their business activity, clients, contracts,
                and income history instead.
              </p>
              <p className="mt-3">
                          Review the current{" "}
                          <Link href="/checklist" className="text-teal-800 underline">
                            D8 visa requirements and document checklist
                          </Link>{" "}
                          before you begin. It separates the documents you can prepare from the
                          records you must request from an employer, bank, insurer, or government
                          authority.
                        </p>
                      </>
                    ),
                  },
                  {
                    heading: "What documents are usually part of the application?",
                    content: (
                      <>
                        <p>
                          Expect a personal statement or motivation letter, proof of remote income,
                          accommodation evidence, health insurance, a criminal record certificate,
                          identity documents, and the Portuguese national visa application form.
                          The exact presentation and local criminal-record steps depend on your
                          nationality and the consulate or visa center handling your application.
                        </p>
                        <p className="mt-3">
                          A useful preparation order is to request the slowest documents first,
                          confirm the certificate legalization rules, and then make sure every
                          income figure and date matches across the packet.
                        </p>
                      </>
                    ),
                  },
                  {
                    heading: "How to prepare without making the process harder",
                    content: (
                      <p>
                        Start with the official instructions for the place where you will apply,
                        then use a checklist to track documents and freshness windows. Keep clean
                        scans of originals, avoid booking around documents that have not arrived,
                        and confirm any changing consular instructions before submission. NomadPacket
                        can assemble the documents based on your answers, but it does not replace
                        the official requirements or legal advice.
                      </p>
                    ),
                  },
                ]}
                faqs={[
                  {
                    question: "Is the Portugal digital nomad visa the same as the D8 visa?",
                    answer:
                      "Yes. The term Portugal digital nomad visa commonly refers to the D8 residence visa for remote workers. Portugal also has a separate temporary-stay route, so confirm which visa type matches your intended stay.",
                  },
                  {
                    question: "Can employees apply for the Portugal digital nomad visa?",
                    answer:
                      "Yes, if they can document qualifying remote work and foreign-sourced income. An employer confirmation letter should clearly state the role, income, and authorization to work remotely from Portugal.",
                  },
                  {
                    question: "Where should I start my D8 application?",
                    answer:
                      "Start by confirming your visa type, application location, and current official document list. Then gather the country-specific criminal-record document and income evidence before completing the rest of the packet.",
                  },
                ]}
                ctaHeading="Have the overview? Build your own D8 packet"
                ctaBody="Answer a short questionnaire once and use the resulting draft documents alongside the official checklist for your application."
              />
            );
          }