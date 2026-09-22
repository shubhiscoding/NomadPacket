/**
 * Freelancer/Business Income Narrative — Product Spec (v1).md §4. Used
 * when employmentType is "freelancer" or "business_owner", instead of the
 * employer confirmation letter. No "NomadPacket" mention (AGENTS.md §2).
 *
 * Paragraphs are now fully composed strings built by the mapper rather than
 * interpolated from sub-fields, since wording differs substantially by branch
 * (few clients vs. many clients vs. product vs. creator vs. other).
 */
export interface FreelancerNarrativeData {
  homeCountry: string;
  fullName: string;
  introParagraph: string;
  incomeParagraph: string;
  reviewWarning?: string;
  date: string;
}

export const freelancerNarrativeTemplate = {
  id: "FREELANCER_INCOME_NARRATIVE" as const,
  paragraphs: [
    "{{reviewWarning}}",
    "To the Consular Section, Embassy/Consulate of Portugal in {{homeCountry}},",
    "{{introParagraph}}",
    "{{incomeParagraph}}",
    "{{fullName}}\n{{date}}",
  ],
};
