import { portugalD8ResidenceQuestionnaire } from "./configs/portugal-d8-residence.questionnaire";
import type { QuestionnaireConfig } from "./types";

/**
 * Registry of every questionnaire config this app knows how to render.
 * Adding country #2 (or a second visa type) means adding one entry here
 * pointing at a new config file — never touching engine.ts or the shared
 * runner component.
 */
const registry: QuestionnaireConfig[] = [portugalD8ResidenceQuestionnaire];

export function getQuestionnaireConfig(
  country: string,
  visaType: string,
): QuestionnaireConfig | undefined {
  return registry.find((c) => c.country === country && c.visaType === visaType);
}
