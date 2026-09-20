import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("sitemap", () => {
  it("includes the homepage, checklist, calculator, resources, and all 3 country pages", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls.some((u) => u.endsWith("/checklist"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/tools/income-calculator"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/resources/nif-guide"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/us"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/uk"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/ca"))).toBe(true);
  });

  it("uses NEXT_PUBLIC_SITE_URL, never a hardcoded domain", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url).not.toContain("nomadpacket.app"); // seo.md's own placeholder domain
    }
  });
});

describe("robots", () => {
  it("disallows authenticated/application routes and points at the sitemap", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule?.disallow).toContain("/application/");
    expect(rule?.disallow).toContain("/api/");
    // Route groups like (auth) never appear in the real URL — the actual
    // paths to disallow are /login and /verify, not literal "/(auth)/".
    expect(rule?.disallow).not.toContain("/(auth)/");
    expect(rule?.disallow).toContain("/login");
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
