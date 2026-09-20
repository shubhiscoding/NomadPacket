# NomadPacket SEO Playbook — Agent Execution Doc

**Context for the agent:** NomadPacket is a Next.js (App Router) tool that helps
Portugal D8 visa applicants generate their consulate documents (motivation
letter, employer confirmation, income summary, pre-filled national visa form)
from a short questionnaire. The buyer is a US/UK/Canada remote worker, usually
finding this via Google search or a nomad community, in a high-anxiety,
high-intent moment (they're about to submit a real visa application). SEO here
works because the current top search results for these queries are law-firm
blogs and generic guides, not an interactive tool — we can out-rank them by
being genuinely more useful, not by being more "optimized."

This doc is organized so the agent can work through it top to bottom. Each
section says *why* before *what*, so decisions later in the doc make sense
without re-reading everything.

---

## 0. The core SEO thesis (read this before doing anything else)

Three things drive rankings for a query like "portugal d8 visa checklist":
1. **Relevance** — does the page actually answer the query better than
   competitors?
2. **Authority** — do other sites link to it / mention it?
3. **Technical health** — can Google crawl, render, and understand it fast?

We have a structural advantage on (1): the repo's `country-config/` pattern
(one config per home country: US, UK, CA) maps almost perfectly onto
**programmatic SEO** — instead of one generic "Portugal D8 visa" page, we can
generate a dedicated, genuinely different page per home country
("D8 Visa for US Citizens," "D8 Visa for UK Citizens," "D8 Visa for
Canadians"), each with real country-specific content already living in the
codebase (criminal record process, apostille rules, etc.). This is not
thin/duplicate content if each page pulls real, different config data — it's
exactly what Google wants: a specific answer to a specific query.

(2) and (3) are covered in Sections 4 and 2 respectively.

---

## 1. Keyword map (target these, in this priority order)

Group A — **highest intent, lowest volume, easiest to rank, closest to a sale.**
Build pages for these first.

| Keyword | Search intent | Target page |
|---|---|---|
| portugal d8 visa checklist | Ready to start gathering documents | `/checklist` (or home) |
| d8 visa motivation letter example | Needs a template right now | `/resources/motivation-letter-sample` |
| d8 visa motivation letter template | Same as above | same page, alt heading |
| portugal d8 visa income requirements 2026 | Verifying eligibility | `/eligibility` or home |
| d8 visa employer letter template | Needs a template right now | `/resources/employer-letter-sample` |
| portugal d8 visa documents required | Early research | `/checklist` |
| d8 visa criminal record certificate usa | Deep in the process, stuck | `/us/criminal-record` |
| d8 visa criminal record certificate uk | Same, UK | `/uk/criminal-record` |
| d8 visa apostille us | Deep in the process, stuck | `/us/criminal-record` (subsection) |
| nif number portugal non resident | Needs to solve a specific blocker | `/resources/nif-guide` |
| d8 visa income calculator | Wants to self-check eligibility | `/tools/income-calculator` (see §5) |

Group B — **broader, more competitive, higher volume. Target after Group A
pages exist and have some traction (3-6 months in).**

- portugal digital nomad visa requirements
- portugal d8 visa vs d7 visa
- how to apply for d8 visa from usa / uk / canada
- portugal d8 visa processing time
- portugal d8 visa income proof

Group C — **community/long-tail phrases people actually type when frustrated.**
These convert disproportionately well and are nearly uncontested.

- "d8 visa 6 month average income"
- "d8 visa savings requirement how much"
- "portugal visa freelancer income letter"
- "d8 visa employer wont write letter" (real pain point — write an article
  addressing this specifically, it has almost no competition)
- "d8 visa rejected reasons"

**How the agent should use this:** each keyword above should map to exactly
one primary page (avoid two pages competing for the same term — this is
called keyword cannibalization and actively hurts rankings). Put the target
keyword naturally in: the page's `<title>`, the H1, the first ~100 words, one
subheading, and the meta description. Do not keyword-stuff beyond that —
modern Google ranks for meaning/intent, not exact repetition count.

---

## 2. Technical SEO — Next.js App Router specifics

This section is implementation-level; hand it directly to whoever/whatever is
writing code.

### 2.1 Metadata (per page, not just root layout)
Every route that should rank needs its own `generateMetadata` (or static
`metadata` export) — do not rely solely on the root `layout.tsx` metadata,
since that becomes the fallback for every page and won't be query-specific.

```ts
// app/(marketing)/resources/motivation-letter-sample/page.tsx
export const metadata: Metadata = {
  title: "D8 Visa Motivation Letter: Free Sample + Generator | NomadPacket",
  description:
    "See a real D8 visa motivation letter example, then generate your own " +
    "personalized version in minutes based on your job, income, and move date.",
  alternates: { canonical: "https://nomadpacket.app/resources/motivation-letter-sample" },
  openGraph: {
    title: "D8 Visa Motivation Letter: Free Sample + Generator",
    description: "A real example, plus a tool that writes your personalized version.",
    url: "https://nomadpacket.app/resources/motivation-letter-sample",
    type: "article",
  },
};
```

Rules for every page's metadata:
- `title`: 50-60 characters, unique per page, target keyword near the front.
- `description`: 140-160 characters, written to make a human want to click
  (not just keyword-stuffed) — this doesn't directly affect ranking but
  directly affects click-through rate, which does.
- Always set `alternates.canonical` explicitly, even when it seems obvious —
  prevents duplicate-content issues if the same page becomes reachable via
  multiple URLs (trailing slash, query params, etc.).

### 2.2 Sitemap and robots
Next.js App Router supports these as code, not static files — use that.

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/checklist", "/pricing", "/tools/income-calculator"];
  const resourceSlugs = [
    "motivation-letter-sample",
    "employer-letter-sample",
    "nif-guide",
  ];
  const countryPages = ["us", "uk", "ca"]; // matches country-config keys

  return [
    ...staticRoutes.map((route) => ({
      url: `https://nomadpacket.app${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    })),
    ...resourceSlugs.map((slug) => ({
      url: `https://nomadpacket.app/resources/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...countryPages.map((code) => ({
      url: `https://nomadpacket.app/${code}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/application/", "/(auth)/"] },
    ],
    sitemap: "https://nomadpacket.app/sitemap.xml",
  };
}
```

Important: `/application/` and any authenticated/questionnaire routes should
be disallowed — there's nothing for Google to usefully index behind a login,
and letting it crawl dynamic per-user pages wastes crawl budget and can create
thin/duplicate-content pages Google might view unfavorably.

### 2.3 Structured data (JSON-LD)
Structured data doesn't directly boost rankings but unlocks rich results
(FAQ dropdowns, star ratings, etc. in search) which meaningfully improve
click-through rate. Use `FAQPage` on any page with genuine Q&A content, and
`SoftwareApplication` or `Product` on the pricing/tool pages.

```tsx
// Example: FAQ schema for the checklist page
export function ChecklistFaqSchema() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much income do I need for the D8 visa in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, the D8 visa requires average monthly income of at least €3,680 (4x Portugal's minimum wage), plus a recommended savings buffer of around €11,040.",
        },
      },
      // ...more Q&A pairs, sourced from real questions in Group C keywords
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  );
}
```

Only mark up content that's genuinely visible on the page — Google penalizes
structured data that doesn't match visible content.

### 2.4 Performance (Core Web Vitals)
Google uses real-world page speed as a ranking signal. Next.js gets you most
of the way there by default, but check:
- Use `next/image` for every image (automatic lazy-loading, correct sizing,
  modern formats) — never a raw `<img>` tag on a marketing page.
- Use `next/font` (already in use per the repo's README) — avoids
  render-blocking font loads.
- Avoid client-side data fetching for content that should be indexed —
  marketing/resource pages should be Server Components rendering real HTML
  on first load, not client-fetched after JS runs. Reserve `"use client"`
  for the interactive questionnaire/generator itself, not the surrounding
  content pages.
- Run `next build` and check the output — flag any marketing page that isn't
  statically generated (should show as `○` or `●` in the build output, not
  `λ`/dynamic, unless it genuinely needs to be dynamic).

### 2.5 URL structure
- Lowercase, hyphenated, no query params for canonical content:
  `/resources/motivation-letter-sample`, not `/resources?id=motivation-letter`.
- Keep it shallow — 2-3 levels deep max from the root.
- Once a URL is published and indexed, **never change it** without a 301
  redirect in `next.config.ts` — a changed URL with no redirect loses all
  accumulated ranking signal for that page.

---

## 3. Content plan — what pages to actually write, and in what order

### Phase 1 (weeks 1-3): the pages that convert
1. **Home / `/checklist`** — the full D8 document checklist as real,
   readable content (not gated), with the tool/generator as the clear CTA
   throughout. This is your Group A anchor page.
2. **`/resources/motivation-letter-sample`** — show a genuinely good,
   realistic (fictional-applicant) example letter, explain what makes a
   good one, then CTA into the generator. Long-form, at least 1,200 words —
   this is a "why not just copy-paste a template" page, so it needs to
   demonstrate the value of personalization.
3. **`/resources/employer-letter-sample`** — same pattern, for the employer
   confirmation letter. This one has a specific angle worth writing into
   the content directly: many applicants' employers are hesitant to write
   this letter, so address that friction head-on (script for how to ask
   HR, what to say if they push back).
4. **`/resources/nif-guide`** — standalone article on getting a Portuguese
   NIF as a non-resident. High search volume, genuinely confusing topic,
   and it's Bucket-3 content you've already researched for the product —
   low incremental effort to turn into a public page.

### Phase 2 (weeks 4-8): the programmatic country pages
5. **`/us`, `/uk`, `/ca`** — one dedicated landing page per home country,
   pulling directly from `country-config/portugal/criminal-record-branches/`.
   Each page should read as a genuinely tailored "D8 Visa Guide for
   [Country] Citizens" — income requirements (same across countries, state
   once), then the criminal-record process specific to that country, NIF
   guidance, and a CTA into the generator pre-selected for that home
   country. **This is the single highest-leverage content investment in
   this plan** — three pages, each targeting real distinct search volume
   ("d8 visa from usa," "d8 visa uk citizens," "d8 visa canada"), built
   almost entirely from data that already exists in the codebase.

### Phase 3 (ongoing): the long-tail/community pages
6. Group C articles — one at a time, roughly one every 1-2 weeks. These are
   cheap to write (shorter, more specific), rank faster (less competition),
   and tend to convert well because they're answering a real, specific fear
   ("what if my employer won't write the letter," "why was my D8 visa
   rejected").
7. **When Portugal's minimum wage updates each January**, update the
   `eligibility.ts` config *and* republish/update-date every page that cites
   the figure — Google favors freshness on content tied to a number that's
   known to change annually, and an outdated number actively hurts trust
   with real visitors.

### Content quality bar (apply to every page above)
- Minimum ~800 words for resource pages, ~1,200+ for the pillar
  checklist/country pages — thin content doesn't rank for competitive terms.
- Every page should answer the question a title implies within the first
  200 words, then go deeper — don't bury the answer.
- Write for the actual anxious applicant, not for search engines — e.g.,
  acknowledge explicitly that this isn't legal advice, that outcomes aren't
  guaranteed, and where to go for edge cases. This isn't just a compliance
  nicety — Google's guidance (E-E-A-T: Experience, Expertise,
  Authoritativeness, Trust) explicitly rewards content that handles
  high-stakes topics (immigration, legal, financial, medical — "Your Money
  or Your Life" topics) with visible care and appropriate caveats.

---

## 4. Off-page: links and community distribution

Rankings need external signals too, not just good on-page content. In order
of effort-to-impact:

1. **Answer real questions where they're already being asked.** Search
   Reddit (r/digitalnomad, r/PortugalExpats), the Nomad Compass Telegram
   group, and expat.com forums for people actively asking D8 visa
   questions. Answer genuinely helpfully in your own words; link to the
   specific relevant page (not the homepage) only when it's a natural,
   earned fit — not on every reply. This drives direct traffic and,
   over time, some of these threads get indexed and cited themselves,
   passing along authority.
2. **Get listed in nomad-visa directories and comparison sites** —
   sites like Nomad List, remote-work tool directories, and "best D8 visa
   resources" roundup posts. A short, genuine outreach email to site owners
   ("we built a free D8 document checklist, thought your readers might find
   it useful") often works for resource pages like this.
3. **Guest content / quotes**: reach out to the immigration-content sites
   already ranking (Portugalist, Global Citizen Solutions, etc.) — not to
   compete, but occasionally these sites accept guest contributions or will
   link to a genuinely useful free tool as a resource for their readers.
4. Do **not** buy links or use link-farms — Google's spam algorithms
   specifically target this and the risk (a manual action / ranking
   penalty) heavily outweighs any short-term gain, especially for a small
   site with no ranking history to absorb a penalty.

---

## 5. The single highest-leverage build: a public income calculator

Recommendation: build `/tools/income-calculator` as a **free, ungated**
tool (input: monthly income, currency, family size → output: does this meet
the 2026 D8 threshold, using the same `computeDependentsAdjustedThreshold`
and `meetsThreshold` logic already in `lib/eligibility.ts`).

Why this matters disproportionately for SEO specifically:
- It's inherently linkable — bloggers, forum commenters, and directory sites
  link to free calculators far more readily than to a generic landing page,
  because it's genuinely useful to link to.
- It naturally targets "d8 visa income calculator" (Group A) while
  functioning as top-of-funnel lead generation for the full product.
- It reuses logic you've already built and tested — this is a content asset
  that costs you almost nothing extra to build.

---

## 6. Tracking and measurement

Set these up before publishing anything, not after:

1. **Google Search Console** — verify the domain, submit the sitemap from
   §2.2. This is non-negotiable and free; it's the only way to see actual
   query-level impressions/clicks/position data (analytics tools never
   show you the real search terms people used).
2. **A basic analytics tool** (Vercel Analytics, since you're already on
   Vercel, or Plausible/Umami if you prefer privacy-first/GDPR-simpler —
   relevant since your audience is EU-adjacent) — track pageviews and,
   critically, the conversion funnel from a resource page → questionnaire
   start → purchase.
3. **Monthly review cadence**: check Search Console for (a) which queries
   are bringing impressions but low click-through (fix the title/meta
   description), and (b) which pages rank on page 2 (positions 11-20) —
   those are your best candidates for a content refresh, since they're
   closest to breaking onto page 1.

---