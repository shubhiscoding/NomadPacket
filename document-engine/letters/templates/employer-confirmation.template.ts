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
  /** he/she/they, matched consistently across the letter */
  pronounSubject: string;
  pronounObject: string;
  pronounPossessive: string;
  amountAndCurrency: string;
  date: string;
}

export const employerConfirmationTemplate = {
  id: "EMPLOYER_CONFIRMATION_LETTER" as const,
  paragraphs: [
    "[EMPLOYER LETTERHEAD / {{companyName}}]",
    "To Whom It May Concern,",
    "This letter confirms that {{employeeFullName}} has been employed by {{companyName}} as a {{jobTitle}} since {{startDate}}. {{pronounSubject}} is a full-time {{remoteDescriptor}} employee, and {{pronounPossessive}} role does not require physical presence at any company location.",
    "{{employeeFullName}}'s current gross monthly salary is {{amountAndCurrency}}. {{companyName}} confirms that {{pronounObject}} is authorized to continue performing {{pronounPossessive}} duties remotely from Portugal for the duration of {{pronounPossessive}} employment.",
    "Please contact the undersigned with any questions regarding this confirmation.",
    "[MANAGER/HR NAME, TITLE]\n{{companyName}}\n[CONTACT EMAIL/PHONE]\n{{date}}",
  ],
};
