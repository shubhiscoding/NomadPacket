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
  /** Capitalized pronoun for sentence-initial position (e.g., "They are...") */
  pronounSubject: string;
  /** Lowercase pronoun for mid-sentence use (e.g., "confirms that they are...") */
  pronounSubjectLowercase: string;
  pronounPossessive: string;
  /**
   * "is" for he/she, "are" for they — always "are" since gender isn't
   * collected and they/them is the default pronoun set.
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
    "{{employeeFullName}}'s current gross monthly salary is {{amountAndCurrency}}. {{companyName}} confirms that {{pronounSubjectLowercase}} {{pronounVerb}} authorized to continue performing {{pronounPossessive}} duties remotely from Portugal for the duration of {{pronounPossessive}} employment.",
    "Please contact the undersigned with any questions regarding this confirmation.",
    "[MANAGER/HR NAME, TITLE]\n{{companyName}}\n[CONTACT EMAIL/PHONE]\n{{date}}",
  ],
};
