# Bucket 2 — official form pre-fill

**Status: real form, wired, 20 of 32 fields pre-filled.** `assets/pt-d8-
national-visa-form.pdf` is the actual "PORTUGAL — APPLICATION FOR NATIONAL
VISA (Residence and Temporary Stay)" form, downloaded 2026-09-20 from VFS
Global's UK portal and cross-checked against the identical Portuguese-
language original on Portugal's own government visa portal
(vistos.mne.gov.pt). This was a genuine blocker in an earlier pass (no copy
of the form was available in that build environment, and a self-authored
stub was used instead, clearly labeled as such) — it's resolved now.

## What's real

- The PDF itself: sourced from VFS Global (Portugal's official outsourced
  visa partner) and cross-checked against Portugal's own MNE visa portal
  — same 3-page, 32-field layout in both.
- `mappings/pt-d8-national-visa-form.mapping.ts`: coordinates measured
  against the real PDF's actual text positions (via pdfjs-dist's
  positioned-text extraction), for every field the questionnaire has a
  direct or derivable answer for — 14 text fields plus 5 checkboxes.
- `fill.ts`: draws overlay text/checkmarks at those coordinates. The real
  form has **no fillable AcroForm fields** (verified — it's a flat,
  print-and-hand-fill PDF, like most official government forms), so this
  is coordinate overlay, not `form.getTextField().setText()`. Every text
  field auto-shrinks its font to fit its cell (down to a floor), then
  hard-truncates with an ellipsis if it's still too wide — a value never
  overflows into a neighboring cell, which matters more than a long
  value being fully legible.

## Checkboxes — only where the answer is certain, never a guess

Five checkboxes are marked automatically, each for a reason that's either
a hard product-scope guarantee or a direct answer, not an inference:

- **"Ordinary passport"** — always checked. Not asked separately; flagged
  as an assumption (diplomatic/service passports are rare for this
  audience), not a verified per-applicant fact.
- **"Two entries (residency)"** — always checked. The qualifier gate
  guarantees every application that reaches document generation is
  `D8_RESIDENCE`, never `D8_TEMPORARY` — this isn't a guess.
- **"Residence in a country other than nationality: Yes/No"** — derived
  from the existing `currentCountry` answer (already collected in Section
  A), not a new question.

Sex, civil status, and purpose-of-journey are deliberately **not**
checkbox-filled — see below.

## Coverage added specifically for this pass (previously left blank)

Section E of the questionnaire (`dateOfBirth`, `passportIssueDate`,
`homeAddress`, `phoneNumber`) was added — all optional — specifically so
more of the real form's fields could be pre-filled instead of handed to
the applicant blank. Combined with fields already collected, the
following are now filled: surname, given names, date of birth, current
nationality, passport number/issue date/expiry/issuing country, home
address, phone, occupation, employer/client, member state of first
entry, and intended arrival date.

## What's still open — content gaps, not "we don't have the form"

1. **Coordinate visual QA — done, including a stress test.** Rendered
   and visually checked page-by-page twice: once with typical values, and
   again with deliberately long ones (a 37-character employer name, a
   very long address forced into the truncation fallback) on 2026-09-21.
   One real regression was caught and fixed in that second pass — two
   fields (`*21` occupation, `*22` employer) were originally placed too
   close to the row divider below them and visually collided; both were
   moved back to the offsets verified clean in the first pass.
2. **Name splitting.** The form wants Surname and First name(s) as
   separate fields; the questionnaire collects one `fullLegalName` string.
   `derive-overlay-values.ts` splits on the last word as a heuristic —
   works for "Jane Doe," breaks for compound surnames or name orders that
   don't match. Fix properly by adding two questionnaire questions
   (surname / given names) instead of guessing.
3. **Sex, civil status, and purpose-of-journey checkboxes are still
   blank, deliberately.** Sex/civil status are sensitive personal
   categorization we don't collect and won't guess. Purpose-of-journey's
   printed options (Study/Training/Work/Familiar Regrouping/...) don't
   cleanly describe "D8 remote-work visa" — ticking "Work" risked
   misrepresenting the visa type to a consular officer, so it's left for
   the applicant to decide/confirm.
4. **Canada's submission channel is unconfirmed.** This form was sourced
   via VFS Global's US/UK portals. No equivalent Portugal-from-Canada VFS
   channel was found — Canadian applicants likely go through a Portuguese
   consulate directly (see country-config/portugal/criminal-record-
   branches/ca.ts for the specific consulate lead). Confirm the exact form
   version Canada uses before assuming this one applies unchanged.
5. **Signature and "Place and date" (page 3), and intended departure
   date, are never filled** — the first two are intentional (never
   fabricate a signature); the departure date field genuinely doesn't
   apply to a residence-track visa and the form has no "N/A" checkbox for
   it, so it's left blank rather than filled with a placeholder.

None of the above requires touching `fill.ts` or `generate-packet.ts` —
they're all mapping-data or questionnaire-content changes, per the
original "swap in the real form without engine changes" design goal
(which held: the engine didn't need to change, only the *shape* of the
mapping did, since the real form turned out to need coordinates instead
of named fields — an update AGENTS.md's own §3.2 anticipated: "Official-
form pre-fill uses field-level coordinate/name mapping").
