# Bucket 2 — official form pre-fill

**Status: real form, wired.** `assets/pt-d8-national-visa-form.pdf` is the
actual "PORTUGAL — APPLICATION FOR NATIONAL VISA (Residence and Temporary
Stay)" form, downloaded 2026-09-20 from VFS Global's UK portal and
cross-checked against the identical Portuguese-language original on
Portugal's own government visa portal (vistos.mne.gov.pt). This was a
genuine blocker in an earlier pass (no copy of the form was available in
that build environment, and a self-authored stub was used instead,
clearly labeled as such) — it's resolved now.

## What's real

- The PDF itself: sourced from VFS Global (Portugal's official outsourced
  visa partner) and cross-checked against Portugal's own MNE visa portal
  — same 3-page, 32-field layout in both.
- `mappings/pt-d8-national-visa-form.mapping.ts`: coordinates measured
  against the real PDF's actual text positions (via pdfjs-dist's
  positioned-text extraction), for every field the questionnaire has a
  direct answer for.
- `fill.ts`: draws overlay text at those coordinates. The real form has
  **no fillable AcroForm fields** (verified — it's a flat, print-and-
  hand-fill PDF, like most official government forms), so this is
  coordinate overlay, not `form.getTextField().setText()`.

## What's still open — content gaps, not "we don't have the form"

1. **Coordinate visual QA — done for typical values, not for edge cases.**
   A filled sample (short name, US passport number, "Acme Inc" as
   employer) was rendered and visually checked page-by-page on
   2026-09-20: every value lands cleanly inside its printed cell, no
   overlap with neighboring labels. Residual risk: `fill.ts` draws each
   value at a fixed point with no line-wrapping, so an unusually long
   employer name or a long free-text value could still run past its cell
   boundary — worth a second visual pass with deliberately long test
   values before launch.
2. **Name splitting.** The form wants Surname and First name(s) as
   separate fields; the questionnaire collects one `fullLegalName` string.
   `derive-overlay-values.ts` splits on the last word as a heuristic —
   works for "Jane Doe," breaks for compound surnames or name orders that
   don't match. Fix properly by adding two questionnaire questions
   (surname / given names) instead of guessing.
3. **Checkboxes aren't filled.** Sex, civil status, passport type,
   purpose of journey, number of entries — all checkbox fields on the
   real form. Left blank for the applicant to tick by hand rather than
   guessed at; filling them would need per-option coordinates and a
   "draw an X" helper, not built in this pass.
4. **Canada's submission channel is unconfirmed.** This form was sourced
   via VFS Global's US/UK portals. No equivalent Portugal-from-Canada VFS
   channel was found — Canadian applicants likely go through a Portuguese
   consulate directly (see country-config/portugal/criminal-record-
   branches/ca.ts for the specific consulate lead). Confirm the exact form
   version Canada uses before assuming this one applies unchanged.
5. **Signature and "Place and date" (page 3) are never filled** — that's
   intentional, not a gap. Never fabricate a signature.

None of the above requires touching `fill.ts` or `generate-packet.ts` —
they're all mapping-data or questionnaire-content changes, per the
original "swap in the real form without engine changes" design goal
(which held: the engine didn't need to change, only the *shape* of the
mapping did, since the real form turned out to need coordinates instead
of named fields — an update AGENTS.md's own §3.2 anticipated: "Official-
form pre-fill uses field-level coordinate/name mapping").
