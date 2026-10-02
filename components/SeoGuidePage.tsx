import type { ReactNode } from "react";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

type GuideSection = {
  heading: string;
  content: ReactNode;
};

type SeoGuidePageProps = {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  ctaHeading?: string;
  ctaBody?: string;
};

export function SeoGuidePage({
  eyebrow,
  title,
  intro,
  sections,
  faqs,
  ctaHeading,
  ctaBody,
}: SeoGuidePageProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">{intro}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-medium text-stone-900">{section.heading}</h2>
          <div className="mt-2 text-sm leading-relaxed text-stone-600">{section.content}</div>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq items={faqs} />
        </div>
      </section>

      <MarketingCta heading={ctaHeading} body={ctaBody} />
      <Disclaimer />
    </main>
  );
}
