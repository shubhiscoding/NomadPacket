import { canonicalUrl } from "@/lib/seo";

/** Structured data for the free public income calculator. */
export function SoftwareApplicationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NomadPacket D8 Visa Income Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: canonicalUrl("/tools/income-calculator"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
