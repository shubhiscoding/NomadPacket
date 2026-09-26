import type { Metadata } from "next";
import { getD8EligibilityFigures } from "@/lib/marketing-content-data";
import { canonicalUrl } from "@/lib/seo";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";
import { IncomeCalculatorForm } from "./calculator-form";

export async function generateMetadata(): Promise<Metadata> {
  const { effectiveYear } = await getD8EligibilityFigures();
  const title = `D8 Visa Income Calculator: ${effectiveYear} Threshold`;
  const description =
    `Free calculator: check whether your monthly income meets Portugal's D8 visa ` +
    `requirement for ${effectiveYear}, in USD, GBP, CAD, or EUR.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl("/tools/income-calculator") },
    openGraph: { title, description, url: canonicalUrl("/tools/income-calculator"), type: "website" },
  };
}

export default async function IncomeCalculatorPage() {
  const { effectiveYear } = await getD8EligibilityFigures();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <SoftwareApplicationSchema />
      <p className="text-sm font-medium text-teal-800">Free Tool</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        D8 Visa Income Calculator
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        Portugal&apos;s D8 visa income threshold is pegged to the national minimum wage and
        updates every January. Enter your monthly income below to check it against the
        current {effectiveYear} figure — including the add-on for a spouse or children.
      </p>

      <section className="mt-8 rounded-xl border border-stone-200 p-6">
        <IncomeCalculatorForm />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Does this calculator use the exact same math as my visa application?",
                answer:
                  "It uses the same underlying threshold and family-size formula the NomadPacket questionnaire and income summary sheet use — the same versioned configuration, not a separate estimate.",
              },
              {
                question: "Why does it ask for my income in USD/GBP/CAD?",
                answer:
                  "Portugal's threshold is set in EUR, but most applicants earn in their home currency. The calculator converts using live exchange rates rather than a fixed rate, so the result reflects current conditions.",
              },
              {
                question: "What if my income varies month to month?",
                answer:
                  "Consulates generally want to see a 6-month average above the threshold, not just your current month. If your income fluctuates, run the calculator with your trailing 6-month average rather than your most recent paycheck.",
              },
            ]}
          />
        </div>
      </section>

      <Disclaimer />
    </main>
  );
}
