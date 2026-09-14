/**
 * Freelancer/Business Income Narrative — Product Spec (v1).md §4. Used
 * when employmentType is "freelancer" or "business_owner", instead of the
 * employer confirmation letter. No "NomadPacket" mention (AGENTS.md §2).
 */
export interface FreelancerNarrativeData {
  homeCountry: string;
  fullName: string;
  /** "freelancer" | "consultant" | "business owner" */
  roleDescriptor: string;
  industryOrService: string;
  clientNamesOrTypes: string;
  stabilityMonths: string;
  averageMonthlyIncomeFormatted: string;
  date: string;
}

export const freelancerNarrativeTemplate = {
  id: "FREELANCER_INCOME_NARRATIVE" as const,
  paragraphs: [
    "To the Consular Section, Embassy/Consulate of Portugal in {{homeCountry}},",
    "I, {{fullName}}, operate as an independent {{roleDescriptor}} in the field of {{industryOrService}}. My income is derived from clients located outside Portugal, including {{clientNamesOrTypes}}.",
    "Over the past {{stabilityMonths}}, my average monthly income has been {{averageMonthlyIncomeFormatted}}, as evidenced by the attached bank statements, invoices, and client contracts. My work is conducted entirely online and does not depend on physical presence in any single location, allowing me to continue serving my clients while residing in Portugal.",
    "{{fullName}}\n{{date}}",
  ],
};
