/**
 * Slug -> country-config homeCountry code mapping for the programmatic
 * /us, /uk, /ca pages (seo.md §3 Phase 2). Kept as its own small config —
 * adding a 4th home country page is one entry here, matching the
 * "add a country is a config change" spirit of country-config/ itself.
 */
export interface CountryPageConfig {
  slug: string;
  homeCountryCode: string;
  label: string;
}

export const countryPagesConfig: CountryPageConfig[] = [
  { slug: "us", homeCountryCode: "US", label: "the United States" },
  { slug: "uk", homeCountryCode: "UK", label: "the United Kingdom" },
  { slug: "ca", homeCountryCode: "CA", label: "Canada" },
];

export function getCountryPageConfig(slug: string): CountryPageConfig | undefined {
  return countryPagesConfig.find((c) => c.slug === slug);
}
