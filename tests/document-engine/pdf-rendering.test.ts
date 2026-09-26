import { describe, expect, it, beforeAll, vi } from "vitest";
import { PDFParse } from "pdf-parse";
import {
  mapAnswersToMotivationLetterData,
  mapAnswersToEmployerConfirmationData,
  mapAnswersToFreelancerNarrativeData,
  mapAnswersToIncomeSummarySheetData,
} from "@/document-engine/generate";
import {
  renderMotivationLetterPdf,
  renderEmployerConfirmationPdf,
  renderFreelancerNarrativePdf,
  renderIncomeSummarySheetPdf,
} from "@/document-engine/letters/render-to-pdf";
import { __clearFxCacheForTests } from "@/lib/fx";
import type { Answers } from "@/questionnaire-engine/types";
import employeeUsFixture from "../fixtures/us-employee-residence.json";
import freelancerUkFixture from "../fixtures/uk-freelancer-residence.json";
import businessCaDependentsFixture from "../fixtures/ca-business-owner-dependents.json";

// pdf-parse v2 exposes a PDFParse class (getText/getInfo/...) rather than
// v1's `pdf(buffer) -> {text}` function.
async function extractText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}

beforeAll(() => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { EUR: 1 } }), // 1:1 for simplicity in these PDF-content tests
    }),
  );
});

/**
 * These render actual PDFs end-to-end (mapper -> react-pdf -> buffer) and
 * assert on extracted text — real snapshot-style coverage for the
 * documents this product's entire value proposition rests on, per
 * AGENTS.md §4's higher testing bar for document-engine.
 */
describe("rendered PDF content matches fixture data (US employee, residence)", () => {
  const answers = employeeUsFixture.answers as Answers;

  it("motivation letter includes the applicant's name and never mentions NomadPacket", async () => {
    const data = mapAnswersToMotivationLetterData(answers, { homeCountryLabel: "United States" });
    const buffer = await renderMotivationLetterPdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Jane Doe");
    expect(text).toContain("Acme Inc");
    expect(text.toLowerCase()).not.toContain("nomadpacket");
  });

  // Regression test, end-to-end: the rendered letter previously showed
  // "currently residing in USD, United States" — a currency code leaked
  // into the city field because currentCity was read from
  // answers.currentCountry (no currentCity question existed at all).
  it("motivation letter never leaks a currency code into the residence location", async () => {
    const data = mapAnswersToMotivationLetterData(
      { ...answers, currentCity: "Austin" },
      { homeCountryLabel: "United States" },
    );
    const buffer = await renderMotivationLetterPdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Austin, United States");
    expect(text).not.toMatch(/residing in (USD|GBP|CAD|EUR)/);
  });

  it("employer confirmation letter includes the employer and salary, and uses neutral pronouns", async () => {
    const data = mapAnswersToEmployerConfirmationData(answers);
    const buffer = await renderEmployerConfirmationPdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Acme Inc");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("They");
    expect(text.toLowerCase()).not.toContain("nomadpacket");
  });

  // Regression test, end-to-end (not just on the mapper's output): the
  // rendered letter previously read "They is a full-time remote employee"
  // and "confirms that them is authorized" — wrong subject-verb agreement
  // AND the wrong pronoun case (object "them" used as a sentence subject).
  it("employer confirmation letter never contains 'They is' or 'them is' — grammatically correct pronoun agreement", async () => {
    const data = mapAnswersToEmployerConfirmationData(answers);
    const buffer = await renderEmployerConfirmationPdf(data);
    const text = await extractText(buffer);

    expect(text).not.toContain("They is");
    expect(text).not.toContain("them is");
    expect(text).toContain("They are");
  });

  it("income summary sheet includes the threshold comparison", async () => {
    const data = await mapAnswersToIncomeSummarySheetData(answers, { thresholdEur: 3680 });
    const buffer = await renderIncomeSummarySheetPdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Income Summary");
    expect(text.toLowerCase()).toContain("met");
  });
});

describe("rendered PDF content matches fixture data (UK freelancer, residence)", () => {
  it("freelancer narrative includes the applicant's name and client description, not an employer letter", async () => {
    const answers = freelancerUkFixture.answers as Answers;
    const data = mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel: "United Kingdom" });
    const buffer = await renderFreelancerNarrativePdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Alex Smith");
    expect(text).toContain("freelancer");
    expect(text.toLowerCase()).not.toContain("nomadpacket");
  });
});

describe("rendered PDF content matches fixture data (CA business owner, with dependents)", () => {
  it("freelancer narrative uses 'business owner' phrasing for a business_owner employment type", async () => {
    const answers = businessCaDependentsFixture.answers as Answers;
    const data = mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel: "Canada" });
    const buffer = await renderFreelancerNarrativePdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Morgan Lee");
    expect(text).toContain("business owner");
  });
});

describe("document hardening matrix", () => {
  const businessVariants: Array<{ type: string; answers: Answers; expected: string }> = [
    {
      type: "product revenue",
      answers: {
        ...(businessCaDependentsFixture.answers as Answers),
        businessIncomeType: "product_revenue",
        businessProductDescription: "a workflow automation platform",
        businessRevenueModel: "subscription",
        businessCustomerCount: 42,
        hasHealthInsurance: false,
      },
      expected: "workflow automation platform",
    },
    {
      type: "creator revenue",
      answers: {
        ...(businessCaDependentsFixture.answers as Answers),
        businessIncomeType: "creator_revenue",
        creatorPlatforms: "YouTube and Patreon",
        creatorIncomeType: "subscriptions and sponsorships",
      },
      expected: "YouTube and Patreon",
    },
    {
      type: "custom business",
      answers: {
        ...(businessCaDependentsFixture.answers as Answers),
        businessIncomeType: "other",
        businessOtherDescription: "online education",
      },
      expected: "APPLICANT REVIEW REQUIRED",
    },
  ];

  it.each(businessVariants)("renders the $type narrative without placeholders or branding", async ({ answers, expected }) => {
    const data = mapAnswersToFreelancerNarrativeData(answers, { homeCountryLabel: "Canada" });
    const buffer = await renderFreelancerNarrativePdf(data);
    const text = await extractText(buffer);

    expect(text).toContain(expected);
    expect(text).not.toMatch(/\{\{|\}\}|undefined|null/);
    expect(text.toLowerCase()).not.toContain("nomadpacket");
  });

  it("does not claim insurance is already arranged when the applicant says it is not", async () => {
    const answers = {
      ...(employeeUsFixture.answers as Answers),
      hasHealthInsurance: false,
    };
    const data = mapAnswersToMotivationLetterData(answers, { homeCountryLabel: "United States" });
    const text = await extractText(await renderMotivationLetterPdf(data));

    expect(text).toContain("I will provide comprehensive health insurance");
    expect(text).not.toContain("I have arranged comprehensive health insurance");
  });

  it("does not claim income is above the threshold for a low-income applicant", async () => {
    const answers = { ...(employeeUsFixture.answers as Answers), monthlyIncome: 1000 };
    const data = mapAnswersToMotivationLetterData(answers, { homeCountryLabel: "United States" });
    const text = await extractText(await renderMotivationLetterPdf(data));

    expect(text.replace(/\s+/g, " ")).toContain("stable monthly income");
    expect(text).not.toContain("well in excess");
  });
});
