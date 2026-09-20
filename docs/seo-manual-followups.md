# SEO: manual follow-ups (not code)

Everything in `seo.md` that requires human action outside this codebase —
no agent/AI account can do these on your behalf.

## §4 — Off-page (do these yourself, in this order)

1. **Answer real questions where they're asked.** r/digitalnomad,
   r/PortugalExpats, the Nomad Compass Telegram group, expat.com forums.
   Answer genuinely; link to the specific relevant page (`/checklist`,
   `/us`, `/resources/nif-guide`, etc. — never the homepage) only when
   it's a natural fit, not on every reply.
2. **Get listed in nomad-visa directories** (Nomad List, remote-work tool
   directories, "best D8 visa resources" roundups). Short outreach email:
   "we built a free D8 document checklist + income calculator, thought
   your readers might find it useful" + the specific page URL.
3. **Guest content / quotes** with sites already ranking for these terms
   (Portugalist, Global Citizen Solutions, etc.) — not to compete, offer
   the free calculator as a resource link for their readers.
4. Do **not** buy links or use link farms.

## §6 — Tracking setup (one-time, in Google's/Vercel's dashboards)

1. **Google Search Console**: verify the domain (Settings > Ownership
   verification > HTML tag), then set `GOOGLE_SITE_VERIFICATION` in
   production env vars to the value Search Console gives you (see
   `.env.example`). Submit the sitemap URL from `app/sitemap.ts`
   (`https://nomadpacket.com/sitemap.xml` once deployed) inside Search
   Console — the `sitemap` field in `app/robots.ts` tells crawlers where
   it is, but Search Console submission is still worth doing directly.
2. **Vercel Analytics** is already wired (`app/layout.tsx`) — it activates
   automatically once deployed to Vercel; nothing further to configure.
3. **Monthly review cadence** (recurring, not a one-time setup): in
   Search Console, check (a) queries with high impressions but low
   click-through — rewrite that page's title/description — and (b) pages
   ranking positions 11-20 — best candidates for a content refresh, since
   they're closest to page 1.

## §3 Phase 3 — ongoing content (not built this pass)

Group C long-tail articles (e.g. "d8 visa employer won't write letter,"
"d8 visa rejected reasons") — write one every 1-2 weeks per `seo.md` §3.
Not built in this pass; add as `/resources/<slug>` pages following the
same pattern as the three that exist (`motivation-letter-sample`,
`employer-letter-sample`, `nif-guide`) — remember to add each new slug to
`app/sitemap.ts`'s `resourceSlugs` array.

## Every January (recurring)

When Portugal's minimum wage updates, `prisma/seed.ts` re-seeding
`country-config/portugal/eligibility.ts`'s new figures already propagates
to every page listed here automatically (they all read from
`CountryConfig` via `lib/marketing-content-data.ts`, never a hardcoded
number) — no content-page edits needed, just re-run the seed with updated
source figures.
