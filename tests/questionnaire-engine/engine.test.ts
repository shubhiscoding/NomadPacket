import { describe, expect, it } from "vitest";
import {
  evaluateBranch,
  getVisibleGroups,
  getVisibleQuestions,
  isQuestionnaireComplete,
  validateAnswers,
} from "@/questionnaire-engine/engine";
import { portugalD8ResidenceQuestionnaire } from "@/questionnaire-engine/configs/portugal-d8-residence.questionnaire";
import type { Answers } from "@/questionnaire-engine/types";

describe("evaluateBranch", () => {
  it("equals condition", () => {
    expect(
      evaluateBranch({ questionId: "employmentType", equals: "employee" }, {
        employmentType: "employee",
      }),
    ).toBe(true);
    expect(
      evaluateBranch({ questionId: "employmentType", equals: "employee" }, {
        employmentType: "freelancer",
      }),
    ).toBe(false);
  });

  it("in condition", () => {
    expect(
      evaluateBranch(
        { questionId: "employmentType", in: ["freelancer", "business_owner"] },
        { employmentType: "business_owner" },
      ),
    ).toBe(true);
  });

  it("all/any composition", () => {
    const answers: Answers = { hasDependents: true, employmentType: "employee" };
    expect(
      evaluateBranch(
        {
          all: [
            { questionId: "hasDependents", equals: true },
            { questionId: "employmentType", equals: "employee" },
          ],
        },
        answers,
      ),
    ).toBe(true);
    expect(
      evaluateBranch(
        { any: [{ questionId: "hasDependents", equals: false }, { questionId: "employmentType", equals: "employee" }] },
        answers,
      ),
    ).toBe(true);
  });
});

describe("employment-type branch (Portugal D8 questionnaire)", () => {
  it("shows the employer question only for employees", () => {
    const employeeAnswers: Answers = { employmentType: "employee" };
    const employeeVisible = getVisibleQuestions(portugalD8ResidenceQuestionnaire, employeeAnswers);
    const employerQuestion = employeeVisible.find(
      (q) => q.id === "employerOrClientNames" && q.label === "Employer name",
    );
    expect(employerQuestion).toBeDefined();
  });

  it("shows client-base branch for freelancers, with client names shown only after selecting few_named", () => {
    const freelancerAnswers: Answers = { employmentType: "freelancer" };
    const freelancerVisible = getVisibleQuestions(
      portugalD8ResidenceQuestionnaire,
      freelancerAnswers,
    );
    // Client names should not be visible yet (freelancerClientBase not set)
    expect(
      freelancerVisible.find(
        (q) => q.id === "employerOrClientNames" && q.label.startsWith("Client names"),
      ),
    ).toBeUndefined();
    // But freelancerClientBase should be visible
    expect(
      freelancerVisible.find((q) => q.id === "freelancerClientBase"),
    ).toBeDefined();

    // After selecting few_named, client names should appear
    const freelancerFewNamed: Answers = { employmentType: "freelancer", freelancerClientBase: "few_named" };
    const freelancerFewNamedVisible = getVisibleQuestions(
      portugalD8ResidenceQuestionnaire,
      freelancerFewNamed,
    );
    expect(
      freelancerFewNamedVisible.find(
        (q) => q.id === "employerOrClientNames" && q.label.startsWith("Client names"),
      ),
    ).toBeDefined();
  });

  it("shows neither employer/client question before employmentType is answered", () => {
    const visible = getVisibleQuestions(portugalD8ResidenceQuestionnaire, {});
    expect(visible.find((q) => q.id === "employerOrClientNames")).toBeUndefined();
  });
});

describe("dependents branch (Portugal D8 questionnaire)", () => {
  it("hides dependents sub-questions until hasDependents is true", () => {
    const visible = getVisibleQuestions(portugalD8ResidenceQuestionnaire, {
      hasDependents: false,
    });
    expect(visible.find((q) => q.id === "dependentsSpouseIncluded")).toBeUndefined();
    expect(visible.find((q) => q.id === "dependentsChildrenCount")).toBeUndefined();
  });

  it("shows dependents sub-questions once hasDependents is true", () => {
    const visible = getVisibleQuestions(portugalD8ResidenceQuestionnaire, {
      hasDependents: true,
    });
    expect(visible.find((q) => q.id === "dependentsSpouseIncluded")).toBeDefined();
    expect(visible.find((q) => q.id === "dependentsChildrenCount")).toBeDefined();
  });
});

describe("validateAnswers", () => {
  it("only validates currently-visible required questions", () => {
    // Nothing answered at all — only the very first group's questions
    // should be flagged incomplete via getVisibleQuestions, but
    // validateAnswers checks ALL visible questions across the whole
    // config, so an empty answer set should report every required,
    // currently-visible question as missing.
    const errors = validateAnswers(portugalD8ResidenceQuestionnaire, {});
    expect(errors.length).toBeGreaterThan(0);
    // Dependents sub-questions aren't visible yet (hasDependents unanswered),
    // so they must not appear as errors.
    expect(errors.some((e) => e.questionId === "dependentsChildrenCount")).toBe(false);
  });

  it("passes minDate validation for a future intendedMoveDate", () => {
    const errors = validateAnswers(portugalD8ResidenceQuestionnaire, {
      intendedMoveDate: "2099-01-01",
    } as Answers);
    expect(errors.some((e) => e.questionId === "intendedMoveDate")).toBe(false);
  });

  it("fails minDate validation for a past intendedMoveDate", () => {
    const errors = validateAnswers(portugalD8ResidenceQuestionnaire, {
      intendedMoveDate: "2000-01-01",
    } as Answers);
    expect(errors.some((e) => e.questionId === "intendedMoveDate")).toBe(true);
  });
});

describe("isQuestionnaireComplete — full happy-path fixtures", () => {
  const baseAnswers: Answers = {
    fullLegalName: "Jane Doe",
    nationality: "US",
    currentCountry: "United States",
    passportNumber: "X1234567",
    passportExpiry: "2099-01-01",
    monthlyIncome: 5000,
    incomeCurrency: "USD",
    incomeStabilityMonths: 12,
    hasSavingsBuffer: false,
    hasDependents: false,
    hasAccommodation: false,
    hasHealthInsurance: false,
    intendedMoveDate: "2099-06-01",
  };

  it("is complete for an employee once all required fields including hasChangedEmployerRecently are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "employee",
      hasChangedEmployerRecently: false,
      employerOrClientNames: "Acme Inc",
      employmentStartDate: "2020-01-15",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a freelancer with few named clients once freelancerClientBase and employerOrClientNames are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "freelancer",
      freelancerClientBase: "few_named",
      employerOrClientNames: "Acme Corp, TechCo",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a freelancer with many unnamed clients once freelancerClientBase, count, and platforms are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "freelancer",
      freelancerClientBase: "many_unnamed",
      freelancerClientCount: 15,
      freelancerClientPlatforms: "Upwork, direct referrals",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a business owner with few clients once businessIncomeType, businessIsRegisteredEntity, and employerOrClientNames are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "business_owner",
      businessIncomeType: "few_clients",
      businessIsRegisteredEntity: false,
      employerOrClientNames: "My Consulting LLC",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a business owner with dependents once all fields including businessIncomeType are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "business_owner",
      businessIncomeType: "few_clients",
      businessIsRegisteredEntity: true,
      businessRegisteredCountry: "Ireland",
      employerOrClientNames: "My Consulting LLC",
      hasDependents: true,
      dependentsSpouseIncluded: true,
      dependentsChildrenCount: 2,
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is incomplete if a required dependents sub-question is missing", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "employee",
      employerOrClientNames: "Acme Inc",
      employmentStartDate: "2020-01-15",
      hasDependents: true,
      dependentsSpouseIncluded: true,
      // dependentsChildrenCount deliberately omitted
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(false);
  });

  it("is incomplete for a freelancer without freelancerClientBase", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "freelancer",
      // freelancerClientBase deliberately omitted
      employerOrClientNames: "Various clients",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(false);
  });

  it("is incomplete for a business owner without businessIncomeType", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "business_owner",
      // businessIncomeType deliberately omitted
      businessIsRegisteredEntity: false,
      employerOrClientNames: "My Business",
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(false);
  });
});

describe("getVisibleGroups", () => {
  it("drops groups with no currently-visible questions and preserves config order", () => {
    const groups = getVisibleGroups(portugalD8ResidenceQuestionnaire, {});
    expect(groups.map((g) => g.section)).toEqual(["A", "B", "C", "D", "E"]);
  });
});
