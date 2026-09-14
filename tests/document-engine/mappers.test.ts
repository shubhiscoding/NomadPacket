import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  mapAnswersToMotivationLetterData,
  mapAnswersToEmployerConfirmationData,
  mapAnswersToFreelancerNarrativeData,
  mapAnswersToIncomeSummarySheetData,
} from "@/document-engine/generate";
import { __clearFxCacheForTests } from "@/lib/fx";
import type { Answers } from "@/questionnaire-engine/types";
import employeeUsFixture from "../fixtures/us-employee-residence.json";
import freelancerUkFixture from "../fixtures/uk-freelancer-residence.json";
import businessCaDependentsFixture from "../fixtures/ca-business-owner-dependents.json";

// mapAnswersToIncomeSummarySheetData converts to EUR via lib/fx.ts (live
// Frankfurter API) — mock fetch so these tests are deterministic and don't
// depend on network access. 1 USD = 0.92 EUR is an arbitrary fixed test
// rate, not a real quoted rate.
const FAKE_USD_TO_EUR_RATE = 0.92;

beforeEach(() => {
  __clearFxCacheForTests();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { EUR: FAKE_USD_TO_EUR_RATE } }),
    }),
  );
});

describe("mapAnswersToMotivationLetterData", () => {
  it("maps an employee's answers, using the employer as the employment descriptor", () => {
    const data = mapAnswersToMotivationLetterData(employeeUsFixture.answers as Answers, {
      homeCountryLabel: "United States",
    });
    expect(data.homeCountry).toBe("United States");
    expect(data.fullName).toBe(employeeUsFixture.answers.fullLegalName);
    expect(data.employmentDescriptor).toContain(employeeUsFixture.answers.employerOrClientNames);
    expect(data.employmentDescriptor.startsWith("at ")).toBe(true);
  });

  it("maps a freelancer's answers, using the freelancer descriptor phrasing", () => {
    const data = mapAnswersToMotivationLetterData(freelancerUkFixture.answers as Answers, {
      homeCountryLabel: "United Kingdom",
    });
    expect(data.employmentDescriptor).toContain("independent freelancer");
    expect(data.employmentDescriptor).toContain(freelancerUkFixture.answers.employerOrClientNames);
  });

  it("falls back to a generic personalReason when the optional field is blank", () => {
    const answersWithoutReason: Answers = { ...(employeeUsFixture.answers as Answers) };
    delete answersWithoutReason.personalReason;
    const data = mapAnswersToMotivationLetterData(answersWithoutReason, {
      homeCountryLabel: "United States",
    });
    expect(data.personalReason.length).toBeGreaterThan(0);
  });

  it("includes an accommodation clause only when accommodation details are provided", () => {
    const withAccommodation = mapAnswersToMotivationLetterData(
      employeeUsFixture.answers as Answers,
      { homeCountryLabel: "United States" },
    );
    expect(withAccommodation.accommodationClause).toContain("reside at");

    const withoutAccommodation = mapAnswersToMotivationLetterData(
      { ...(employeeUsFixture.answers as Answers), hasAccommodation: false, accommodationDetails: undefined },
      { homeCountryLabel: "United States" },
    );
    expect(withoutAccommodation.accommodationClause).toBe("");
  });
});

describe("mapAnswersToEmployerConfirmationData", () => {
  it("maps employee answers using a neutral they/them pronoun set (gender not collected)", () => {
    const data = mapAnswersToEmployerConfirmationData(employeeUsFixture.answers as Answers);
    expect(data.pronounSubject).toBe("They");
    expect(data.companyName).toBe(employeeUsFixture.answers.employerOrClientNames);
    expect(data.amountAndCurrency).toContain("5,000");
  });
});

describe("mapAnswersToFreelancerNarrativeData", () => {
  it("maps freelancer answers", () => {
    const data = mapAnswersToFreelancerNarrativeData(freelancerUkFixture.answers as Answers, {
      homeCountryLabel: "United Kingdom",
    });
    expect(data.roleDescriptor).toBe("freelancer");
    expect(data.clientNamesOrTypes).toBe(freelancerUkFixture.answers.employerOrClientNames);
  });

  it("uses 'business owner' descriptor for business_owner employment type", () => {
    const data = mapAnswersToFreelancerNarrativeData(
      businessCaDependentsFixture.answers as Answers,
      { homeCountryLabel: "Canada" },
    );
    expect(data.roleDescriptor).toBe("business owner");
  });
});

describe("mapAnswersToIncomeSummarySheetData", () => {
  it("computes rows, average, and threshold status using the resolved threshold (not a client value)", async () => {
    const data = await mapAnswersToIncomeSummarySheetData(employeeUsFixture.answers as Answers, {
      thresholdEur: 3680,
    });
    expect(data.rows.length).toBeGreaterThan(0);
    expect(data.thresholdStatus).toBe("met");
    expect(data.thresholdFormatted).toContain("3,680");
  });

  it("converts the reported currency to EUR before comparing against the EUR threshold", async () => {
    // 5000 USD * 0.92 (fake test rate) = 4600 EUR, still above 3680.
    const data = await mapAnswersToIncomeSummarySheetData(employeeUsFixture.answers as Answers, {
      thresholdEur: 3680,
    });
    expect(data.averageFormatted).toContain("4,600");
  });

  it("reports 'not met' when the reported income is below the threshold", async () => {
    const lowIncomeAnswers: Answers = {
      ...(employeeUsFixture.answers as Answers),
      monthlyIncome: 1000,
      incomeStabilityMonths: 3,
    };
    const data = await mapAnswersToIncomeSummarySheetData(lowIncomeAnswers, { thresholdEur: 3680 });
    expect(data.thresholdStatus).toBe("not met");
  });
});
