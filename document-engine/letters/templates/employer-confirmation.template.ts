/**
 * Employer Remote-Work Confirmation Letter — Product Spec (v1).md §4. Used
 * when the questionnaire's employmentType answer is "employee". This is a
 * DRAFT for the applicant to send to their own HR/manager to sign — we
 * never fabricate a signature. No "NomadPacket" mention (AGENTS.md §2).
 */
export interface EmployerConfirmationData {
  companyName: string;
  employeeFullName: string;
  jobTitle: string;
  startDate: string;
  /** "remote" | "hybrid-remote" */
  remoteDescriptor: string;
  /** he/she/they, matched consistently across the letter — always the SUBJECT case, never the object case ("them"), even in clauses like "confirms that {{pronounSubject}} ... is authorized" where it's easy to mistakenly reach for the object form. */
  pronounSubject: string;
  pronounPossessive: string;
  /**
   * "is" for he/she, "are" for they — a real grammar bug slipped through
   * an earlier pass: the template hardcoded "is" everywhere, producing
   * "They is a full-time remote employee" once they/them became the
   * default (gender isn't a collected question, so this is always
   * "they"/"are" in practice today, but the field exists so the template
   * stays correct if a gendered pronoun set is ever wired in).
   */
  pronounVerb: string;
  amountAndCurrency: string;
  date: string;
}

export const employerConfirmationTemplate = {
  id: "EMPLOYER_CONFIRMATION_LETTER" as const,
  paragraphs: [
    "[EMPLOYER LETTERHEAD / {{companyName}}]",
    "To Whom It May Concern,",
    "This letter confirms that {{employeeFullName}} has been employed by {{companyName}} as a {{jobTitle}} since {{startDate}}. {{pronounSubject}} {{pronounVerb}} a full-time {{remoteDescriptor}} employee, and {{pronounPossessive}} role does not require physical presence at any company location.",
    "{{employeeFullName}}'s current gross monthly salary is {{amountAndCurrency}}. {{companyName}} confirms that {{pronounSubject}} {{pronounVerb}} authorized to continue performing {{pronounPossessive}} duties remotely from Portugal for the duration of {{pronounPossessive}} employment.",
    "Please contact the undersigned with any questions regarding this confirmation.",
    "[MANAGER/HR NAME, TITLE]\n{{companyName}}\n[CONTACT EMAIL/PHONE]\n{{date}}",
  ],
};
