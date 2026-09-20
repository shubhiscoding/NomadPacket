import { FaqSchema, type FaqItem } from "./FaqSchema";

/**
 * Renders the same Q&A pairs both as visible HTML and as FaqSchema JSON-LD
 * — kept together in one component so the two can never drift apart.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-6">
      <FaqSchema items={items} />
      {items.map((item) => (
        <div key={item.question}>
          <h3 className="text-base font-medium text-stone-900">{item.question}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
