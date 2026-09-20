import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

/**
 * Per seo.md §2.2. Uses NEXT_PUBLIC_SITE_URL, never a hardcoded domain —
 * same rule as everywhere else in this app (magic-link emails, canonical
 * tags). Route list intentionally mirrors app/robots.ts's `allow` set —
 * anything gated behind auth (/application/*, /login, /verify, /waitlist)
 * has nothing for Google to usefully index and isn't listed here either.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/checklist", priority: 0.9 },
    { path: "/tools/income-calculator", priority: 0.8 },
  ];

  const resourceSlugs = ["motivation-letter-sample", "employer-letter-sample", "nif-guide"];

  const countryPages = ["us", "uk", "ca"]; // matches country-config home-country keys

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...resourceSlugs.map((slug) => ({
      url: `${siteUrl}/resources/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...countryPages.map((code) => ({
      url: `${siteUrl}/${code}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
