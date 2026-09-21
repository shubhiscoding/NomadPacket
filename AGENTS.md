# AGENTS.md

**Project: NomadPacket** (nomadpacket.app)

This file is the standing contract for any AI agent (or human) working on this codebase. Read it in full before writing code. When a request conflicts with a rule here, follow this file and flag the conflict instead of silently picking one.

---

## 1. What this product is

NomadPacket is a self-serve web tool that assembles the document packet needed for Portugal's D8 (digital nomad) residence visa. The user answers a structured questionnaire once; the system then:

1. **Generates** composed documents (motivation letter, employer/freelancer income letter, income summary sheet) from their answers
2. **Pre-fills** the official Portuguese national visa application form
3. **Instructs** them, with country-of-origin-specific detail, on the remaining documents they must source themselves (criminal record certificate, NIF, health insurance, etc.)

This is **not** a legal advice product and must never present itself as one. It is a document-assembly tool, closer in spirit to TurboTax than to a law firm. See the product spec doc for the full document checklist, the questionnaire question list, and draft template text — this file does not repeat that content.

**v1 scope:** Portugal, D8 residence visa only, home countries US/UK/Canada only. Everything else (other countries, the D8 temporary-stay visa, the post-arrival AIMA stage, multi-language UI) is explicitly out of scope until v1 is live and validated. Do not build ahead of this scope without being asked.

**Standing rule — never silently degrade to a built path.** Portugal's D8 visa actually has two flavors (temporary stay vs. residence visa), and only the residence-visa path is built for v1. A user who wants the unbuilt path must never be funneled through the built path's logic — the generated documents state specific legal intent (e.g., the motivation letter explicitly claims residence intent), so applying the wrong path's content to someone would misrepresent their situation to a real consular officer. This isn't a v1-only concern: the same rule applies every time a new country or visa type is added and something is only partially built. The fix is always the same shape: gate the unsupported choice **before** the user enters the built flow (see the qualifier gate below), with a clear "not supported yet" message and an email capture for demand signal — never a fallback into whichever path happens to be implemented.

---

## 2. Design language

The product deals with people's immigration paperwork — money and anxiety are both high. The design should read as **calm, precise, and professional**, closer to a good accountant's site than a flashy startup landing page.

- **Tone:** plain language everywhere, no legal jargon, no hype copy, no gamification. Every screen should make the user feel more in control, not more anxious.
- **Color:** a muted, confident palette. One deep primary (navy or teal) for headers/CTAs, warm neutral grays for body/background, a single clear green for "complete" states and amber for "action needed" states. No bright/playful saturated colors, no decorative illustration.
- **Typography:** one well-crafted typeface for headings (a trust signal — think a serif or a confident sans, not a default system font), a clean readable sans for body text, generous line-height. Avoid dense walls of text — this audience is already reading enough bureaucratic text elsewhere.
- **Layout:** generous whitespace, clear single-column reading flow for the questionnaire, a persistent progress indicator (step X of Y) so users always know how much is left.
- **Core recurring components:**
  - A step-by-step questionnaire flow (one focused question group per screen, not a giant form)
  - A checklist view with clear per-item status pills (Done / Action Needed / Optional) — this is the product's "home base" screen users return to
  - Document preview cards before download, so nothing gets downloaded unseen
- **Motion:** minimal and purposeful only — loading states and success confirmations. No gratuitous animation.
- **Device priority:** must work on mobile, but optimize primarily for desktop. Reviewing generated letters and uploading scanned documents is a desktop-shaped task for most users.
- **Brand name:** the product is called **NomadPacket**. Use it as a plain-text wordmark in the header for v1 — no logo mark needed yet. Keep the brand name out of the generated document content itself (letters should read as the applicant's own words, not carry product branding) — it belongs in the app UI and in emails, not inside a motivation letter a consulate will read.

---

## 3. Architecture

### 3.1 Shape

A single Next.js (App Router, TypeScript) application — no separate backend service, no monorepo. API routes / server actions handle backend logic. Postgres via Prisma as the ORM.

### 3.2 Core modules — this is the extensibility spine

Everything below exists to make **"add country #2"** a data change, not a rewrite. Treat this as the single most important architectural constraint in the whole project.

```
/qualifier/                → pre-signup routing gate: country + visa-type choice, before any account exists
/country-config/          → structured data per country + visa type (see 3.3)
/questionnaire-engine/    → renders questionnaire from config, not hardcoded forms
/document-engine/
    /letters/              → composed-letter generation (Bucket 1)
    /form-fill/            → official-form pre-fill (Bucket 2), maps answers to PDF fields
/entitlement/              → Dodo Payments checkout + webhook handling, gates downloads
/auth/                      → magic-link email auth, no passwords
/notifications/            → transactional email (magic link, "packet ready")
```

- **Qualifier gate:** the very first screen anyone sees, before auth. It asks only "which country + which visa type," checks that against which paths are actually built (config-driven, not hardcoded), and either routes into the real flow or shows a "not supported yet" screen with an email-capture waitlist. No `applications` record is created for an unsupported selection — this is a marketing/routing concern, not part of the paid product.

- **Email sending domain:** transactional email should be sent from an @nomadpacket.app address once DNS is configured (e.g. `hello@nomadpacket.app`), with "NomadPacket" as the display name. Deliverability and a trustworthy sender identity matter more than usual here, since these emails carry sensitive document links.
- **Questionnaire engine:** driven entirely by a per-country-and-visa-type config object (question list, branching logic, validation rules). Adding or changing a question is a config edit. If you find yourself writing country-specific `if` branches inside a shared component, stop — that logic belongs in config.
- **Document engine:** takes `(answers, country_config) → documents`. Letter text templates live in their own files (see 3.4), never inline in component/route code. Official-form pre-fill uses field-level coordinate/name mapping stored per country, since every government PDF is laid out differently.
- **Country config is versioned by effective date.** Legal thresholds (like the income minimum, pegged to Portugal's minimum wage) change annually. Store them as `{value, effective_from, effective_to, source_url}` records, not constants, so old applications remain reproducible and new ones automatically pick up current figures.

### 3.3 Data model (starting point, expand as needed)

- `users` — email, created_at
- `sessions` — magic-link tokens, expiry
- `applications` — user_id, country, visa_type, status, answers (JSON), created_at
- `generated_documents` — application_id, type, file_url, generated_at
- `payments` — application_id, provider_ref, status, amount, currency
- `country_configs` — versioned legal/requirement data, keyed by country + effective date range

### 3.4 The "add a new country" contract

When this becomes relevant (not in v1), a new country must be addable by:
1. Adding one country-config data file matching the existing schema
2. Adding its home-country-branch data for Bucket 3 items
3. Adding template text variants only where wording must legally differ
4. Adding its official-form field mapping
5. Adding a test fixture that exercises every branch for that country

No changes to `document-engine`, `questionnaire-engine`, or shared UI components should be required to add a country. If they are, that's a signal something got hardcoded that shouldn't have been — fix the abstraction, not just the immediate case.

---

## 4. Coding rules

- **TypeScript strict mode.** No `any` without a comment explaining why.
- **No legal/eligibility numbers hardcoded inline, anywhere.** They come from versioned country config. An annual threshold update should never require a code deploy.
- **All generated document text lives in template files**, separated from application logic — this keeps "content that might need a careful re-read before shipping" clearly separate from "code that needs a developer's eyes."
- **Every country-config value and template gets a sourced-and-dated comment** (what source, what date it was verified) — traceability matters because this product's entire value proposition is being *correct*, not just functional.
- **Server-side validation always mirrors client-side validation.** Never trust the client for eligibility math or document content — recompute and re-validate server-side before generating anything.
- **Treat all user data as sensitive by default.** These are people's financial documents and immigration details. Encrypt at rest, no third-party analytics tools touching document content, and define an explicit data retention/deletion policy before launch, not after.
- **Write tests first for the document-engine and any eligibility/threshold calculation logic.** This is the code where a bug has real-world consequences for someone's visa application — it gets a higher bar than the rest of the app.
- **Config/feature-flags over hardcoded conditionals** for anything country- or visa-type-specific.
- **No secrets in code.** All API keys (Dodo Payments, Resend, database) via environment variables; keep `.env.example` current.
- **Small, single-purpose commits** with descriptive messages — this codebase will likely be revisited months apart between features, optimize for future-you (or a future agent) being able to reconstruct intent from history.

## 5. Explicitly out of scope for v1 — do not build these yet

- The AIMA / post-arrival residence-permit checklist (Stage 2)
- Any country other than Portugal
- Multi-language UI (English only)
- Native mobile apps
- Anything resembling AI-generated legal advice or case-outcome predictions — this product assembles documents based on published requirements, full stop

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->