import type { QuestionnaireConfig } from "../types";

/**
 * Portugal D8 residence-visa questionnaire. Source: Product Spec (v1).md
 * §3, minus the original Q5 ("which visa are you applying for") — that
 * decision is now made by the qualifier gate (country-config/
 * qualifier-gate.ts) before an account even exists, so it's never asked
 * again here. `visaType` is fixed to "D8_RESIDENCE" on the Application row
 * at creation time.
 */
export const portugalD8ResidenceQuestionnaire: QuestionnaireConfig = {
  country: "PT",
  visaType: "D8_RESIDENCE",
  groups: [
    {
      section: "A",
      title: "Basics",
      questions: [
        {
          id: "fullLegalName",
          section: "A",
          label: "Full legal name",
          fieldType: "text",
          required: true,
          validation: [{ type: "minLength", value: 2 }],
        },
        {
          id: "nationality",
          section: "A",
          label: "Nationality / home country",
          helpText: "This determines your criminal-record and apostille guidance.",
          fieldType: "select",
          required: true,
          options: [
            { value: "US", label: "United States" },
            { value: "UK", label: "United Kingdom" },
            { value: "CA", label: "Canada" },
          ],
        },
        {
          id: "currentCity",
          section: "A",
          label: "Current city",
          helpText: "Used in your motivation letter (\"currently residing in [city], [country]\").",
          fieldType: "text",
          required: false,
        },
        {
          id: "currentCountry",
          section: "A",
          label: "Current country of residence (if different from your nationality)",
          fieldType: "text",
          required: false,
        },
        {
          id: "passportNumber",
          section: "A",
          label: "Passport number",
          fieldType: "text",
          required: true,
          validation: [{ type: "minLength", value: 5 }],
        },
        {
          id: "passportExpiry",
          section: "A",
          label: "Passport expiry date",
          fieldType: "date",
          required: true,
          validation: [{ type: "minDate", value: "today" }],
        },
      ],
    },
    {
      section: "B",
      title: "Work & income",
      questions: [
        {
          id: "employmentType",
          section: "B",
          label: "Are you an employee, a freelancer/contractor, or a business owner?",
          helpText: "This decides which letter we generate for you.",
          fieldType: "radio",
          required: true,
          options: [
            { value: "employee", label: "Employee of a company" },
            { value: "freelancer", label: "Freelancer / contractor" },
            { value: "business_owner", label: "Business owner" },
          ],
        },
        {
          id: "jobTitle",
          section: "B",
          label: "Job title / role",
          helpText:
            "Optional — used in your motivation letter and employer confirmation letter. " +
            "Skip it and we'll use a generic description instead.",
          fieldType: "text",
          required: false,
        },
        {
          id: "employmentStartDate",
          section: "B",
          label: "Employment start date",
          fieldType: "date",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "employee" },
        },
        {
          id: "employerOrClientNames",
          section: "B",
          label: "Employer name",
          fieldType: "text",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "employee" },
        },
        {
          id: "employerOrClientNames",
          section: "B",
          label: "Client names (or the type of clients you work with)",
          fieldType: "text",
          required: true,
          visibleWhen: {
            questionId: "employmentType",
            in: ["freelancer", "business_owner"],
          },
        },
        {
          id: "monthlyIncome",
          section: "B",
          label: "Monthly income (before tax)",
          fieldType: "currency",
          required: true,
          validation: [{ type: "min", value: 0 }],
        },
        {
          id: "incomeCurrency",
          section: "B",
          label: "Currency",
          fieldType: "select",
          required: true,
          options: [
            { value: "USD", label: "USD" },
            { value: "GBP", label: "GBP" },
            { value: "CAD", label: "CAD" },
            { value: "EUR", label: "EUR" },
          ],
        },
        {
          id: "incomeStabilityMonths",
          section: "B",
          label: "How many months has this income been stable?",
          fieldType: "number",
          required: true,
          validation: [{ type: "min", value: 0 }],
        },
        {
          id: "hasSavingsBuffer",
          section: "B",
          label: "Do you have savings you'd like to include as a buffer?",
          fieldType: "boolean",
          required: true,
        },
        {
          id: "savingsBufferAmount",
          section: "B",
          label: "Savings amount",
          fieldType: "currency",
          required: true,
          visibleWhen: { questionId: "hasSavingsBuffer", equals: true },
        },
      ],
    },
    {
      section: "C",
      title: "Family",
      questions: [
        {
          id: "hasDependents",
          section: "C",
          label: "Are you applying alone or with dependents (spouse, children)?",
          fieldType: "boolean",
          required: true,
        },
        {
          id: "dependentsSpouseIncluded",
          section: "C",
          label: "Is a spouse or partner included?",
          fieldType: "boolean",
          required: true,
          visibleWhen: { questionId: "hasDependents", equals: true },
        },
        {
          id: "dependentsChildrenCount",
          section: "C",
          label: "How many children are included?",
          fieldType: "number",
          required: true,
          validation: [{ type: "min", value: 0 }],
          visibleWhen: { questionId: "hasDependents", equals: true },
        },
      ],
    },
    {
      section: "D",
      title: "Logistics",
      questions: [
        {
          id: "hasAccommodation",
          section: "D",
          label: "Do you already have accommodation arranged in Portugal?",
          fieldType: "boolean",
          required: true,
        },
        {
          id: "accommodationDetails",
          section: "D",
          label: "Accommodation details (address, or booking reference)",
          fieldType: "text",
          required: false,
          visibleWhen: { questionId: "hasAccommodation", equals: true },
        },
        {
          id: "hasHealthInsurance",
          section: "D",
          label: "Do you already have health insurance, or need guidance choosing a policy?",
          fieldType: "boolean",
          required: true,
        },
        {
          id: "intendedMoveDate",
          section: "D",
          label: "Intended move date",
          fieldType: "date",
          required: true,
          validation: [{ type: "minDate", value: "today" }],
        },
        {
          id: "personalReason",
          section: "D",
          label: "In a sentence or two, why Portugal?",
          helpText:
            "Optional — used to personalize your motivation letter. Skip it and we'll " +
            "use a general statement instead.",
          fieldType: "textarea",
          required: false,
        },
      ],
    },
    {
      section: "E",
      title: "A few extra details (optional)",
      questions: [
        {
          id: "dateOfBirth",
          section: "E",
          label: "Date of birth",
          helpText:
            "Optional, but it lets us pre-fill one more field on the official visa form " +
            "instead of leaving it for you to write in by hand.",
          fieldType: "date",
          required: false,
        },
        {
          id: "passportIssueDate",
          section: "E",
          label: "Passport issue date",
          fieldType: "date",
          required: false,
        },
        {
          id: "homeAddress",
          section: "E",
          label: "Your current home address",
          fieldType: "text",
          required: false,
        },
        {
          id: "phoneNumber",
          section: "E",
          label: "Phone number",
          fieldType: "text",
          required: false,
        },
      ],
    },
  ],
};
