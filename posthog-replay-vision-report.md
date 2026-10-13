# Replay Vision Setup Report

## Recording status

Session replay was already enabled on this project, and the client-side PostHog init (`components/PostHogAnalytics.tsx`) doesn't disable it — it only configures PII masking (`maskAllInputs: true`, `recordCrossOriginIframes: false`). Recordings will capture normally as soon as real users hit the site.

NomadPacket is pre-launch: there's no live traffic yet, so all scanners below show **0 matched sessions / 0 projected credits** for now. That's expected — they'll start producing observations the moment real recordings come in.

## Scanners created

All three are new (no scanners existed on this project before this run).

### 1. Broken packet delivery (monitor)
- **Watches:** the application flow — questionnaire and checklist pages — for signs the document-packet delivery breaks: generation stuck on "Action Needed," "Pay to unlock download" failing to redirect to checkout, packet still showing locked after payment, the `.zip` download link failing, "Email me my packet" erroring, or preview fields showing blank.
- **Query scope:** `$current_url` contains `/application` (covers both `/application/[id]/questionnaire` and `/application/[id]/checklist`).
- **Sampling:** 50% of matching sessions, comprehensive mode, `gemini-3-flash-preview`.
- **Estimated spend:** 0 credits/month currently (no traffic yet).
- [View scanner](https://us.posthog.com/project/204162/replay-vision/01a13590-424a-73af-b611-c9597ec2fc20)

### 2. Document packet frustration (monitor)
- **Watches:** rage-click moments — retrying "Continue" after a generic error on the visa-type screen, re-clicking "Next" against a blocked questionnaire validation step, hammering the pay/checkout button, retrying after hitting the edit-limit cooldown or the daily email limit, or hunting the checklist for how to get a document (e.g. criminal record certificate, NIF).
- **Query scope:** `$rageclick` events only — no URL filter, so it stays disjoint from the delivery scanner above.
- **Sampling:** 100% of matching sessions, `gemini-3-flash-preview`.
- **Estimated spend:** 0 credits/month currently (no rage-clicks yet).
- [View scanner](https://us.posthog.com/project/204162/replay-vision/01a13590-1781-7952-9009-dc18c461f836)

### 3. Applicant session recaps (summarizer)
- **Watches:** every session, producing a plain-language recap of what the applicant did — answering the questionnaire, reviewing the checklist, downloading the document packet (motivation letter, income letter, visa form).
- **Query scope:** unscoped — all recordings.
- **Sampling:** 10% of sessions, `gemini-3-flash-preview`.
- **Estimated spend:** 0 credits/month currently (no sessions yet).
- [View scanner](https://us.posthog.com/project/204162/replay-vision/01a1358f-dbd2-7832-993e-5363f4a6afea)

## Nothing skipped

All three scanners were created without needing your confirmation — quota was healthy (2500 credits remaining, 0 used) and projected spend was 0 for each.

## Where to look

Results appear on the [Replay vision page](https://us.posthog.com/project/204162/replay-vision) in PostHog. Since the product hasn't launched yet, expect the first real observations once actual users start completing the questionnaire → checklist → payment flow.
