import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

/**
 * Per seo.md §2.2, with one correction: Next.js route groups like
 * `(auth)` are stripped from the actual URL (they're a file-organization
 * device, not a path segment) — the real authenticated URLs to disallow
 * are `/login` and `/verify`, not literal `/(auth)/`. `/waitlist` is also
 * disallowed: it's a dead-end capture page with no unique content per
 * visit, not something worth indexing.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/application/", "/login", "/verify", "/waitlist"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
