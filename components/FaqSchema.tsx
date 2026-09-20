export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage JSON-LD (seo.md §2.3). Only render this alongside the exact same
 * Q&A text visibly on the page — Google penalizes structured data that
 * doesn't match visible content, so this component never generates markup
 * for anything the visitor can't also read.
 */
export function FaqSchema({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
