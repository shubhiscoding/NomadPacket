import { beforeAll, describe, expect, it, vi } from "vitest";
import { PDFParse } from "pdf-parse";
import type { Answers } from "@/questionnaire-engine/types";
import {
  mapAnswersToEmployerConfirmationData,
  mapAnswersToFreelancerNarrativeData,
  mapAnswersToIncomeSummarySheetData,
  mapAnswersToMotivationLetterData,
} from "@/document-engine/generate";
import {
  renderEmployerConfirmationPdf,
  renderFreelancerNarrativePdf,
  renderIncomeSummarySheetPdf,
  renderMotivationLetterPdf,
} from "@/document-engine/letters/render-to-pdf";
import { fillForm } from "@/document-engine/form-fill/fill";
import { nationalVisaFormFieldMapping } from "@/document-engine/form-fill/mappings/pt-d8-national-visa-form.mapping";
import { __clearFxCacheForTests } from "@/lib/fx";
import employeeUsFixture from "../fixtures/us-employee-residence.json";
import freelancerUkFixture from "../fixtures/uk-freelancer-residence.json";
import businessCaDependentsFixture from "../fixtures/ca-business-owner-dependents.json";

const REPO_ROOT = process.cwd();

async function extractText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text.replace(/\s+/g, " ");
}

beforeAll(() => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { EUR: 0.92 } }),
    }),
  );
});

const cases: Array<{
  name: string;
  homeCountryLabel: string;
  employmentType: "employee" | "freelancer" | "business_owner";
  answers: Answers;
}> = [
  {
    name: "US employee",
    homeCountryLabel: "United States",
    employmentType: "employee",
    answers: employeeUsFixture.answers as Answers,
  },
  {
    name: "US employee after employer transition with a gap",
    homeCountryLabel: "United States",
    employmentType: "employee",
    answers: {
      ...(employeeUsFixture.answers as Answers),
      hasChangedEmployerRecently: true,
      previousEmployerName: "Previous Co",
      previousEmployerJobTitle: "Product Designer",
      previousEmployerStartDate: "2023-01-01",
      previousEmployerEndDate: "2026-03-31",
      previousEmployerMonthlyIncome: 4800,
      previousEmployerIncomeCurrency: "USD",
      employmentStartDate: "2026-06-01",
      hadEmploymentGap: true,
      employmentGapExplanation: "A two-month transition between roles",
    },
  },
  {
    name: "UK freelancer with many unnamed clients",
    homeCountryLabel: "United Kingdom",
    employmentType: "freelancer",
    answers: {
      ...(freelancerUkFixture.answers as Answers),
      freelancerClientBase: "many_unnamed",
      freelancerClientCount: 14,
      freelancerClientPlatforms: "Upwork and direct referrals",
      freelancerNotableClients: "Northstar Studio",
    },
  },
  {
    name: "Canada business owner with named clients and dependents",
    homeCountryLabel: "Canada",
    employmentType: "business_owner",
    answers: businessCaDependentsFixture.answers as Answers,
  },
  {
    name: "Canada product business",
    homeCountryLabel: "Canada",
    employmentType: "business_owner",
    answers: {
      ...(businessCaDependentsFixture.answers as Answers),
      businessIncomeType: "product_revenue",
      businessProductDescription: "a workflow automation platform",
      businessRevenueModel: "subscription",
      businessCustomerCount: 42,
    },
  },
  {
    name: "Canada creator business",
    homeCountryLabel: "Canada",
    employmentType: "business_owner",
    answers: {
      ...(businessCaDependentsFixture.answers as Answers),
      businessIncomeType: "creator_revenue",
      creatorPlatforms: "YouTube and Patreon",
      creatorIncomeType: "subscriptions and sponsorships",
    },
  },
  {
    name: "Canada custom business requiring review",
    homeCountryLabel: "Canada",
    employmentType: "business_owner",
    answers: {
      ...(businessCaDependentsFixture.answers as Answers),
      businessIncomeType: "other",
      businessOtherDescription: "online education",
    },
  },
];

describe("production document matrix", () => {
  it.each(cases)("renders every document for $name", async ({ answers, employmentType, homeCountryLabel }) => {
    const motivation = await renderMotivationLetterPdf(
      mapAnswersToMotivationLetterData(answers, { homeCountryLabel }),
    );
    const workDocument =
      employmentType === "employee"
        ? await renderEmployerConfirmationPdf(mapAnswersToEmployerConfirmationData(answers))
        : await renderFreelancerNarrativePdf(
            mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel }),
          );
    const incomeSummary = await renderIncomeSummarySheetPdf(
      await mapAnswersToIncomeSummarySheetData(answers, { thresholdEur: 3680 }),
    );
    const visaForm = await fillForm(nationalVisaFormFieldMapping, answers, REPO_ROOT);

    for (const [documentName, buffer] of [
      ["motivation letter", motivation],
      ["work document", workDocument],
      ["income summary", incomeSummary],
      ["national visa form", visaForm],
    ] as const) {
      expect(buffer.length, `${documentName} should contain PDF bytes`).toBeGreaterThan(1000);
      const text = await extractText(buffer);
      expect(text, `${documentName} should not contain runtime placeholders`).not.toMatch(
        /undefined|null|\{\{|\}\}/,
      );
      expect(text.toLowerCase(), `${documentName} must not expose product branding`).not.toContain(
        "nomadpacket",
      );
    }
  });
});
