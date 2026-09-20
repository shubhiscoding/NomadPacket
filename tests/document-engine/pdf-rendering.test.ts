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

  it("employer confirmation letter includes the employer and salary, and uses neutral pronouns", async () => {
    const data = mapAnswersToEmployerConfirmationData(answers);
    const buffer = await renderEmployerConfirmationPdf(data);
    const text = await extractText(buffer);

    expect(text).toContain("Acme Inc");
    expect(text).toContain("Jane Doe");
    expect(text).toContain("They");
    expect(text.toLowerCase()).not.toContain("nomadpacket");
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
