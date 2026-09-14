import type {
  Answers,
  BranchCondition,
  Question,
  QuestionGroup,
  QuestionnaireConfig,
  ValidationError,
} from "./types";

/**
 * Evaluates a declarative BranchCondition against the current answers.
 * This is the ONLY place branching logic is interpreted — no component or
 * route should ever inspect `answers.employmentType` directly to decide
 * what to show; it should be expressed as a `visibleWhen` in a question's
 * config instead.
 */
export function evaluateBranch(condition: BranchCondition, answers: Answers): boolean {
  if ("all" in condition) {
    return condition.all.every((c) => evaluateBranch(c, answers));
  }
  if ("any" in condition) {
    return condition.any.some((c) => evaluateBranch(c, answers));
  }
  const actual = answers[condition.questionId];
  if ("equals" in condition) {
    return actual === condition.equals;
  }
  return condition.in.includes(actual as string | number | boolean);
}

function isQuestionVisible(question: Question, answers: Answers): boolean {
  if (!question.visibleWhen) return true;
  return evaluateBranch(question.visibleWhen, answers);
}

/** Flat list of every question currently visible given the answers so far. */
export function getVisibleQuestions(
  config: QuestionnaireConfig,
  answers: Answers,
): Question[] {
  return config.groups
    .flatMap((group) => group.questions)
    .filter((q) => isQuestionVisible(q, answers));
}

/** Groups with at least one currently-visible question, in config order. */
export function getVisibleGroups(
  config: QuestionnaireConfig,
  answers: Answers,
): QuestionGroup[] {
  return config.groups
    .map((group) => ({
      ...group,
      questions: group.questions.filter((q) => isQuestionVisible(q, answers)),
    }))
    .filter((group) => group.questions.length > 0);
}

function validateQuestion(question: Question, answers: Answers): ValidationError | null {
  const value = answers[question.id];

  if (question.required && (value === undefined || value === null || value === "")) {
    return { questionId: question.id, message: `${question.label} is required.` };
  }

  if (value === undefined || value === null || value === "") return null;

  for (const rule of question.validation ?? []) {
    switch (rule.type) {
      case "minLength":
        if (typeof value === "string" && value.length < rule.value) {
          return {
            questionId: question.id,
            message: `${question.label} must be at least ${rule.value} characters.`,
          };
        }
        break;
      case "pattern":
        if (typeof value === "string" && !new RegExp(rule.value).test(value)) {
          return { questionId: question.id, message: rule.message };
        }
        break;
      case "min":
        if (typeof value === "number" && value < rule.value) {
          return {
            questionId: question.id,
            message: `${question.label} must be at least ${rule.value}.`,
          };
        }
        break;
      case "minDate":
        if (rule.value === "today" && typeof value === "string") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (new Date(value) < today) {
            return { questionId: question.id, message: `${question.label} cannot be in the past.` };
          }
        }
        break;
    }
  }

  return null;
}

/**
 * Validates only the currently-visible questions (branched-away questions
 * are neither required nor checked). Called identically client-side (for
 * immediate feedback) and server-side (before persisting answers) — same
 * function, so server-side validation always mirrors client-side per
 * AGENTS.md §4.
 */
export function validateAnswers(
  config: QuestionnaireConfig,
  answers: Answers,
): ValidationError[] {
  const visible = getVisibleQuestions(config, answers);
  const errors: ValidationError[] = [];
  for (const question of visible) {
    const error = validateQuestion(question, answers);
    if (error) errors.push(error);
  }
  return errors;
}

/** True once every currently-visible required question has a valid answer. */
export function isQuestionnaireComplete(
  config: QuestionnaireConfig,
  answers: Answers,
): boolean {
  return validateAnswers(config, answers).length === 0;
}
