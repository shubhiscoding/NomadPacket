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
          id: "hasChangedEmployerRecently",
          section: "B",
          label: "Have you changed employers in the past 6 months?",
          fieldType: "boolean",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "employee" },
        },
        {
          id: "previousEmployerName",
          section: "B",
          label: "Previous employer name",
          fieldType: "text",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "previousEmployerJobTitle",
          section: "B",
          label: "Job title at previous employer (optional)",
          fieldType: "text",
          required: false,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "previousEmployerStartDate",
          section: "B",
          label: "When did you start at the previous employer?",
          fieldType: "date",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "previousEmployerEndDate",
          section: "B",
          label: "When did you leave the previous employer?",
          fieldType: "date",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "previousEmployerMonthlyIncome",
          section: "B",
          label: "Monthly income at previous employer (before tax)",
          fieldType: "currency",
          required: true,
          validation: [{ type: "min", value: 0 }],
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "previousEmployerIncomeCurrency",
          section: "B",
          label: "Currency for previous employer income",
          fieldType: "select",
          required: true,
          options: [
            { value: "USD", label: "USD" },
            { value: "GBP", label: "GBP" },
            { value: "CAD", label: "CAD" },
            { value: "EUR", label: "EUR" },
          ],
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "hadEmploymentGap",
          section: "B",
          label: "Was there a gap between jobs?",
          fieldType: "boolean",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
            ],
          },
        },
        {
          id: "employmentGapExplanation",
          section: "B",
          label: "Why was there a gap? (optional)",
          fieldType: "textarea",
          required: false,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "employee" },
              { questionId: "hasChangedEmployerRecently", equals: true },
              { questionId: "hadEmploymentGap", equals: true },
            ],
          },
        },
        {
          id: "employmentStartDate",
          section: "B",
          label: "Employment start date",
          helpText: "When you started at your current employer",
          fieldType: "date",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "employee" },
        },
        {
          id: "employerOrClientNames",
          section: "B",
          label: "Employer name",
          helpText: "Your current employer",
          fieldType: "text",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "employee" },
        },
        {
          id: "freelancerClientBase",
          section: "B",
          label: "Do you have a few named clients, or too many to list?",
          fieldType: "radio",
          required: true,
          options: [
            { value: "few_named", label: "A few named clients" },
            { value: "many_unnamed", label: "Too many clients to name (marketplace, gig work, etc.)" },
          ],
          visibleWhen: { questionId: "employmentType", equals: "freelancer" },
        },
        {
          id: "freelancerClientCount",
          section: "B",
          label: "Approximately how many client engagements in the past 6 months?",
          fieldType: "number",
          required: true,
          validation: [{ type: "min", value: 1 }],
          visibleWhen: {
            any: [
              {
                all: [
                  { questionId: "employmentType", equals: "freelancer" },
                  { questionId: "freelancerClientBase", equals: "many_unnamed" },
                ],
              },
              {
                all: [
                  { questionId: "employmentType", equals: "business_owner" },
                  { questionId: "businessIncomeType", equals: "many_clients" },
                ],
              },
            ],
          },
        },
        {
          id: "freelancerClientPlatforms",
          section: "B",
          label: "Where do you find your clients? (e.g., Upwork, direct referrals, app marketplace)",
          fieldType: "text",
          required: true,
          visibleWhen: {
            any: [
              {
                all: [
                  { questionId: "employmentType", equals: "freelancer" },
                  { questionId: "freelancerClientBase", equals: "many_unnamed" },
                ],
              },
              {
                all: [
                  { questionId: "employmentType", equals: "business_owner" },
                  { questionId: "businessIncomeType", equals: "many_clients" },
                ],
              },
            ],
          },
        },
        {
          id: "freelancerNotableClients",
          section: "B",
          label: "Any notable clients you'd like to mention? (optional)",
          fieldType: "text",
          required: false,
          visibleWhen: {
            any: [
              {
                all: [
                  { questionId: "employmentType", equals: "freelancer" },
                  { questionId: "freelancerClientBase", equals: "many_unnamed" },
                ],
              },
              {
                all: [
                  { questionId: "employmentType", equals: "business_owner" },
                  { questionId: "businessIncomeType", equals: "many_clients" },
                ],
              },
            ],
          },
        },
        {
          id: "employerOrClientNames",
          section: "B",
          label: "Client names (or the type of clients you work with)",
          fieldType: "text",
          required: true,
          visibleWhen: {
            any: [
              { questionId: "freelancerClientBase", equals: "few_named" },
              {
                all: [
                  { questionId: "employmentType", equals: "business_owner" },
                  { questionId: "businessIncomeType", equals: "few_clients" },
                ],
              },
            ],
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
        {
          id: "businessIncomeType",
          section: "B",
          label: "How does your business generate income?",
          fieldType: "radio",
          required: true,
          options: [
            { value: "few_clients", label: "Client services (few named clients)" },
            { value: "many_clients", label: "Client services (too many to name)" },
            { value: "product_revenue", label: "SaaS or digital product sales" },
            { value: "creator_revenue", label: "Content creation (YouTube, Patreon, etc.)" },
            { value: "other", label: "Other business model" },
          ],
          visibleWhen: { questionId: "employmentType", equals: "business_owner" },
        },
        {
          id: "businessIsRegisteredEntity",
          section: "B",
          label: "Is your business a registered legal entity?",
          fieldType: "boolean",
          required: true,
          visibleWhen: { questionId: "employmentType", equals: "business_owner" },
        },
        {
          id: "businessRegisteredCountry",
          section: "B",
          label: "Country where the business is registered",
          fieldType: "text",
          required: false,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIsRegisteredEntity", equals: true },
            ],
          },
        },
        {
          id: "businessProductDescription",
          section: "B",
          label: "What is your product or service?",
          fieldType: "textarea",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "product_revenue" },
            ],
          },
        },
        {
          id: "businessCustomerCount",
          section: "B",
          label: "Approximately how many customers or paying users?",
          fieldType: "number",
          required: true,
          validation: [{ type: "min", value: 1 }],
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "product_revenue" },
            ],
          },
        },
        {
          id: "businessRevenueModel",
          section: "B",
          label: "Revenue model",
          fieldType: "select",
          required: true,
          options: [
            { value: "subscription", label: "Subscription / recurring" },
            { value: "one_time", label: "One-time purchases" },
            { value: "other", label: "Mixed or other" },
          ],
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "product_revenue" },
            ],
          },
        },
        {
          id: "creatorPlatforms",
          section: "B",
          label: "Which platforms? (e.g., YouTube, Patreon, Substack, TikTok)",
          fieldType: "text",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "creator_revenue" },
            ],
          },
        },
        {
          id: "creatorIncomeType",
          section: "B",
          label: "Primary income source",
          fieldType: "select",
          required: true,
          options: [
            { value: "ad_revenue", label: "Ad revenue / platform monetization" },
            { value: "sponsorships", label: "Brand sponsorships" },
            { value: "subscriber_payments", label: "Direct subscriber payments" },
            { value: "mixed", label: "Mixed sources" },
          ],
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "creator_revenue" },
            ],
          },
        },
        {
          id: "businessOtherDescription",
          section: "B",
          label: "Please describe your business and how it generates income",
          fieldType: "textarea",
          required: true,
          visibleWhen: {
            all: [
              { questionId: "employmentType", equals: "business_owner" },
              { questionId: "businessIncomeType", equals: "other" },
            ],
          },
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
          id: "wantToProvideHomeAddress",
          section: "E",
          label: "Would you like to provide your home address now?",
          helpText:
            "We'll pre-fill it on your visa application form (Field 19). You can skip this and fill it in by hand later.",
          fieldType: "radio",
          required: false,
          options: [
            { value: "yes", label: "Yes, provide it now" },
            { value: "skip", label: "Skip for now" },
          ],
        },
        {
          id: "homeAddress",
          section: "E",
          label: "Your current home address",
          fieldType: "text",
          required: false,
          visibleWhen: { questionId: "wantToProvideHomeAddress", equals: "yes" },
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
