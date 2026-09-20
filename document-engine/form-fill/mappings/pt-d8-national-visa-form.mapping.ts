import type { FormFieldMapping } from "@/country-config/types";

/**
 * REAL government form, coordinate-mapped — no longer a stub.
 *
 * Source: "PORTUGAL — APPLICATION FOR NATIONAL VISA (Residence and
 * Temporary Stay)" — the actual harmonized EU/Schengen-style national visa
 * application form Portugal uses. Downloaded 2026-09-20 from VFS Global's
 * UK portal (vfsglobal.com/one-pager/portugal/uk/english/pdf/Portugal-
 * National-Visa-Application-Form.pdf — VFS Global is Portugal's official
 * outsourced visa partner), and cross-checked against the identical form
 * on Portugal's own government visa portal (vistos.mne.gov.pt/images/
 * formulario_visto_nacional_pt.pdf, Portuguese-language original) — same
 * 3-page, 32-field layout, confirming this is the real, current form and
 * not a VFS-specific variant.
 *
 * This form has NO fillable AcroForm fields (verified: pdf-lib reports 0
 * form fields) — it's a flat, print-and-hand-fill PDF like most official
 * government forms. fill.ts overlays text/checkmarks at these measured
 * coordinates instead of setting named fields. Coordinates were extracted
 * with pdfjs-dist's positioned text API (per-character bounding boxes)
 * against the actual downloaded PDF, then visually verified and adjusted
 * against rendered samples (2026-09-20 and again 2026-09-21 after
 * widening coverage) — every field below has been checked in an actual
 * rendered PDF, not just calculated.
 *
 * Every text field carries a `maxWidth` so fill.ts shrinks the font
 * rather than overflow into a neighboring cell if a value runs long
 * (long employer names, long addresses) — coordinates alone aren't
 * enough of a guarantee given real-world input length varies.
 *
 * Deliberately still NOT filled — genuinely ambiguous or sensitive, not
 * a coverage gap:
 *   - Sex, civil status (fields 8, 9) — sensitive personal categorization
 *     we don't collect and won't guess.
 *   - Purpose of journey (field 23) — none of the printed checkbox
 *     options (Study/Training/Work/...) cleanly describes "D8 remote
 *     work visa"; ticking "Work" risked misrepresenting the visa type.
 *   - Intended date of departure (field, page 2) — not applicable to a
 *     residence-track visa; the form has no "N/A" checkbox for it.
 *   - Signature and "Place and date" (page 3) — never fabricate a
 *     signature or claim to know where the applicant will physically
 *     sign.
 *   - National identity number (field 11) — most applicants don't have
 *     a Portuguese-relevant one; not worth a new question for the rare
 *     case that does.
 *
 * TODO(before launch):
 *   1. fullLegalName is split into surname/given-names by a last-word
 *      heuristic (see derive-overlay-values.ts) because the questionnaire
 *      collects one name field but this form wants two — replace with a
 *      proper surname/given-names question pair.
 *   2. "Ordinary passport" (field 12) is checked by default for every
 *      applicant — not asked separately, since diplomatic/service
 *      passports are rare for this audience. Flagged, not verified.
 *   3. Confirm the Canadian submission channel/form version (see
 *      country-config/portugal/criminal-record-branches/ca.ts) — this
 *      form was sourced via the US/UK VFS Global portals; Canada's
 *      channel is unconfirmed.
 */
export const nationalVisaFormFieldMapping: FormFieldMapping = {
  formAssetPath: "document-engine/form-fill/assets/pt-d8-national-visa-form.pdf",
  isStub: false,
  fields: [
    // ---- Page 1 (index 0) ----
    { page: 0, x: 57, y: 587, source: { questionId: "surname" }, maxWidth: 360 }, // "1. Surname (Family name):"
    { page: 0, x: 57, y: 535, source: { questionId: "givenNames" }, maxWidth: 360 }, // "3. First name(s) (Given name(s)):"
    {
      page: 0,
      x: 48,
      y: 483,
      source: { questionId: "dateOfBirth" },
      maxWidth: 97,
      fontSize: 8,
    }, // "4. Date of birth (day-month-year):"
    {
      page: 0,
      x: 357,
      y: 513,
      source: { questionId: "nationalityLabel" },
      maxWidth: 68,
      fontSize: 8,
      minFontSize: 6,
    }, // "7. Current nationality:" (inline — this sub-cell has 3 stacked lines, no vertical room)
    {
      page: 0,
      x: 156,
      y: 274,
      source: { questionId: "ordinaryPassportCheckbox" },
      kind: "checkbox",
    }, // "12. Type of travel document: ☐ Ordinary passport"
    {
      page: 0,
      x: 48,
      y: 220,
      source: { questionId: "passportNumber" },
      maxWidth: 100,
      fontSize: 8,
    }, // "13. Number of travel document:"
    {
      page: 0,
      x: 161,
      y: 220,
      source: { questionId: "passportIssueDate" },
      maxWidth: 80,
      fontSize: 7.5,
    }, // "14. Date of issue:"
    {
      page: 0,
      x: 263,
      y: 220,
      source: { questionId: "passportExpiry" },
      maxWidth: 74,
      fontSize: 7.5,
    }, // "15. Valid until:"
    {
      page: 0,
      x: 339,
      y: 220,
      source: { questionId: "passportIssuedByCountry" },
      maxWidth: 80,
      fontSize: 7.5,
    }, // "16. Issued by (country):"
    {
      page: 0,
      x: 62,
      y: 90,
      source: { questionId: "homeAddress" },
      maxWidth: 178,
      fontSize: 7.5,
      minFontSize: 6,
    }, // "19. Applicant's home address and e-mail address:"
    {
      page: 0,
      x: 253,
      y: 90,
      source: { questionId: "phoneNumber" },
      maxWidth: 170,
      fontSize: 8,
    }, // "19. Telephone no.:"

    // ---- Page 2 (index 1) ----
    {
      page: 1,
      x: 49,
      y: 771,
      source: { questionId: "residenceElsewhereNoCheckbox" },
      kind: "checkbox",
    }, // "20. ... ☐ No"
    {
      page: 1,
      x: 74,
      y: 771,
      source: { questionId: "residenceElsewhereYesCheckbox" },
      kind: "checkbox",
    }, // "20. ... ☐ Yes"
    {
      page: 1,
      x: 66,
      y: 714,
      source: { questionId: "occupationLabel" },
      maxWidth: 490,
      fontSize: 9,
      minFontSize: 7,
    }, // "*21. Current occupation:" — verified clean in an earlier rendered pass; do not move closer to the row divider below (688-710 range visually collides).
    {
      page: 1,
      x: 48,
      y: 674,
      source: { questionId: "employerOrClientNames" },
      maxWidth: 500,
      fontSize: 9,
      minFontSize: 7,
    }, // "*22. Employer and employer's address and telephone number..." — same note; y=663 visually collided with the "23. Purpose(s)" label below it.
    {
      page: 1,
      x: 267,
      y: 561,
      source: { questionId: "memberStateFirstEntry" },
      maxWidth: 155,
      fontSize: 8,
    }, // "26. Member State of first entry:"
    {
      page: 1,
      x: 49,
      y: 524,
      source: { questionId: "entriesResidencyCheckbox" },
      kind: "checkbox",
    }, // "27. ... ☐ Two entries (residency)"
    {
      page: 1,
      x: 48,
      y: 493,
      source: { questionId: "intendedMoveDate" },
      maxWidth: 335,
      fontSize: 7.5,
      minFontSize: 6,
    }, // "Intended date of arrival of the first intended stay in Portugal:"
  ],
};
