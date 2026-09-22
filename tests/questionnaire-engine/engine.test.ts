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
  it("shows the employer question only for employees, not freelancers/business owners", () => {
    const employeeAnswers: Answers = { employmentType: "employee" };
    const employeeVisible = getVisibleQuestions(portugalD8ResidenceQuestionnaire, employeeAnswers);
    const employerQuestion = employeeVisible.find(
      (q) => q.id === "employerOrClientNames" && q.label === "Employer name",
    );
    expect(employerQuestion).toBeDefined();

    const freelancerAnswers: Answers = { employmentType: "freelancer" };
    const freelancerVisible = getVisibleQuestions(
      portugalD8ResidenceQuestionnaire,
      freelancerAnswers,
    );
    expect(
      freelancerVisible.find((q) => q.id === "employerOrClientNames" && q.label === "Employer name"),
    ).toBeUndefined();
    expect(
      freelancerVisible.find(
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

  it("is complete for an employee once employerOrClientNames and employmentStartDate are set", () => {
    const answers: Answers = { ...baseAnswers, employmentType: "employee", employerOrClientNames: "Acme Inc", employmentStartDate: "2020-01-15" };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a freelancer once employerOrClientNames is set", () => {
    const answers: Answers = { ...baseAnswers, employmentType: "freelancer", employerOrClientNames: "Various clients" };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is complete for a business owner with dependents once all dependents fields are set", () => {
    const answers: Answers = {
      ...baseAnswers,
      employmentType: "business_owner",
      employerOrClientNames: "My Consulting LLC",
      hasDependents: true,
      dependentsSpouseIncluded: true,
      dependentsChildrenCount: 2,
    };
    expect(isQuestionnaireComplete(portugalD8ResidenceQuestionnaire, answers)).toBe(true);
  });

  it("is incomplete if a dependents sub-question is missing", () => {
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
});

describe("getVisibleGroups", () => {
  it("drops groups with no currently-visible questions and preserves config order", () => {
    const groups = getVisibleGroups(portugalD8ResidenceQuestionnaire, {});
    expect(groups.map((g) => g.section)).toEqual(["A", "B", "C", "D", "E"]);
  });
});
