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
 * government forms. fill.ts overlays text at these measured coordinates
 * instead of setting named fields. Coordinates were extracted with
 * pdfjs-dist's positioned text API (per-character bounding boxes) against
 * the actual downloaded PDF, then hand-adjusted to sit just below or
 * beside each numbered field's printed label.
 *
 * Only fields with a direct, unambiguous questionnaire answer are mapped.
 * Deliberately NOT filled (left blank for the applicant to complete by
 * hand, not fabricated):
 *   - Every checkbox field (sex, civil status, passport type, purpose of
 *     journey, number of entries) — pdf-lib can draw an "X" over a
 *     checkbox glyph, but that needs its own coordinate per option and
 *     wasn't built in this pass.
 *   - Date of birth, place/country of birth, home address, email, phone
 *     — not asked by the current questionnaire.
 *   - Signature and "Place and date" (page 3) — never fabricate a
 *     signature or claim to know where the applicant will physically
 *     sign.
 *
 * TODO(before launch — visual QA, not "source the form" anymore):
 *   1. Render a filled sample and visually confirm every value lands
 *      inside its printed cell, not overlapping a neighboring label —
 *      coordinates here are a careful first pass, not pixel-verified.
 *   2. fullLegalName is split into surname/given-names by a last-word
 *      heuristic (see derive-overlay-values.ts) because the questionnaire
 *      collects one name field but this form wants two — replace with a
 *      proper surname/given-names question pair.
 *   3. Confirm the Canadian submission channel/form version (see
 *      country-config/portugal/criminal-record-branches/ca.ts) — this
 *      form was sourced via the US/UK VFS Global portals; Canada's
 *      channel is unconfirmed.
 */
export const nationalVisaFormFieldMapping: FormFieldMapping = {
  formAssetPath: "document-engine/form-fill/assets/pt-d8-national-visa-form.pdf",
  isStub: false,
  fields: [
    // Page 1 (index 0)
    { page: 0, x: 50, y: 587, source: { questionId: "surname" } }, // below "1. Surname (Family name):"
    { page: 0, x: 57, y: 535, source: { questionId: "givenNames" } }, // below "3. First name(s) (Given name(s)):"
    { page: 0, x: 355, y: 513, source: { questionId: "nationality" } }, // inline after "7. Current nationality:"
    { page: 0, x: 48, y: 222, source: { questionId: "passportNumber" } }, // below "13. Number of travel document:"
    { page: 0, x: 267, y: 237, source: { questionId: "passportExpiry" }, fontSize: 8 }, // below "15. Valid until:"

    // Page 2 (index 1)
    { page: 1, x: 66, y: 714, source: { questionId: "occupationLabel" } }, // below "*21. Current occupation:"
    { page: 1, x: 48, y: 671, source: { questionId: "employerOrClientNames" } }, // below "*22. Employer and employer's address..."
    { page: 1, x: 48, y: 491, source: { questionId: "intendedMoveDate" }, fontSize: 8 }, // below "Intended date of arrival..."
  ],
};
