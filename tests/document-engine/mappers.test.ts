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

  // Regression test: currentCity used to be read from answers.currentCountry
  // (there was no currentCity question), so residingLocation could show a
  // country name — or whatever unrelated value ended up in that answer —
  // where a city belonged ("currently residing in USD, United States" was
  // an observed real output).
  it("combines currentCity and currentCountry into one location, not a duplicated or unrelated value", () => {
    const data = mapAnswersToMotivationLetterData(
      { ...(employeeUsFixture.answers as Answers), currentCity: "Austin", currentCountry: "United States" },
      { homeCountryLabel: "United States" },
    );
    expect(data.residingLocation).toBe("Austin, United States");
  });

  it("omits the city cleanly (no placeholder, no duplication) when currentCity is blank", () => {
    const answersWithoutCity: Answers = { ...(employeeUsFixture.answers as Answers) };
    delete answersWithoutCity.currentCity;
    const data = mapAnswersToMotivationLetterData(answersWithoutCity, {
      homeCountryLabel: "United States",
    });
    expect(data.residingLocation).toBe("United States");
    expect(data.residingLocation).not.toContain("United States, United States");
  });

  // Regression test: jobTitle used to resolve differently per document —
  // this one showed a generic "employee" derived from employmentType,
  // ignoring any actual job-title answer entirely.
  it("uses the applicant's actual jobTitle answer when provided, not a generic employmentType-derived label", () => {
    const data = mapAnswersToMotivationLetterData(
      { ...(employeeUsFixture.answers as Answers), jobTitle: "Senior Product Designer" },
      { homeCountryLabel: "United States" },
    );
    expect(data.jobTitleOrRole).toBe("Senior Product Designer");
  });

  it("falls back to a generic role description when jobTitle is skipped", () => {
    const data = mapAnswersToMotivationLetterData(employeeUsFixture.answers as Answers, {
      homeCountryLabel: "United States",
    });
    expect(data.jobTitleOrRole).toBe("employee");
  });
});

describe("mapAnswersToEmployerConfirmationData", () => {
  it("maps employee answers using a neutral they/them pronoun set (gender not collected)", () => {
    const data = mapAnswersToEmployerConfirmationData(employeeUsFixture.answers as Answers);
    expect(data.pronounSubject).toBe("They");
    expect(data.companyName).toBe(employeeUsFixture.answers.employerOrClientNames);
    expect(data.amountAndCurrency).toContain("5,000");
  });

  // Regression test: the template hardcoded "is" everywhere, producing
  // "They is a full-time remote employee" once "They" became the default
  // pronoun — a real subject-verb agreement bug, not a cosmetic one.
  it("pairs the 'they' pronoun with the plural verb 'are', not 'is'", () => {
    const data = mapAnswersToEmployerConfirmationData(employeeUsFixture.answers as Answers);
    expect(data.pronounSubject).toBe("They");
    expect(data.pronounVerb).toBe("are");
  });

  it("uses the applicant's actual jobTitle answer when provided, matching the motivation letter's resolution", () => {
    const data = mapAnswersToEmployerConfirmationData({
      ...(employeeUsFixture.answers as Answers),
      jobTitle: "Senior Product Designer",
    });
    expect(data.jobTitle).toBe("Senior Product Designer");
  });

  it("falls back to 'Professional' when jobTitle is missing", () => {
    const data = mapAnswersToEmployerConfirmationData(employeeUsFixture.answers as Answers);
    expect(data.jobTitle).toBe("Professional");
  });
});

describe("mapAnswersToFreelancerNarrativeData", () => {
  it("maps freelancer answers with composed intro and income paragraphs", () => {
    const data = mapAnswersToFreelancerNarrativeData(freelancerUkFixture.answers as Answers, {
      homeCountryLabel: "United Kingdom",
    });
    expect(data.introParagraph).toContain("independent freelancer");
    expect(data.introParagraph).toContain(freelancerUkFixture.answers.employerOrClientNames);
    expect(data.incomeParagraph).toContain("months");
    expect(data.reviewWarning).toBeUndefined();
  });

  it("uses 'business owner' role description for business_owner employment type", () => {
    const data = mapAnswersToFreelancerNarrativeData(
      businessCaDependentsFixture.answers as Answers,
      { homeCountryLabel: "Canada" },
    );
    expect(data.introParagraph).toContain("business owner");
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

  // Regression test: this document's whole job is a trustworthy EUR
  // comparison — it was silently converting USD to EUR with no visible
  // rate or methodology anywhere on the page, which undermines exactly
  // the thing the document exists to prove.
  it("states the exact conversion rate and methodology used, for a non-EUR applicant", async () => {
    const data = await mapAnswersToIncomeSummarySheetData(employeeUsFixture.answers as Answers, {
      thresholdEur: 3680,
    });
    expect(data.conversionNote).toContain("USD");
    expect(data.conversionNote).toContain("EUR");
    expect(data.conversionNote).toContain(FAKE_USD_TO_EUR_RATE.toString().slice(0, 4));
    expect(data.conversionNote.toLowerCase()).toContain("european central bank");
  });

  it("still states the methodology (as 'no conversion applied') for a EUR-reporting applicant, never silently skipped", async () => {
    const eurAnswers: Answers = {
      ...(employeeUsFixture.answers as Answers),
      incomeCurrency: "EUR",
    };
    const data = await mapAnswersToIncomeSummarySheetData(eurAnswers, { thresholdEur: 3680 });
    expect(data.conversionNote.length).toBeGreaterThan(0);
    expect(data.conversionNote.toLowerCase()).toContain("no currency conversion applied");
  });
});
