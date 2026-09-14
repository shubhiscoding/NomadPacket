"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getVisibleGroups, validateAnswers } from "../engine";
import type { Answers, QuestionnaireConfig, ValidationError } from "../types";
import { Field } from "./fields/Field";
import { ProgressIndicator } from "./ProgressIndicator";

/**
 * One focused question group per screen, per AGENTS.md §2 design language.
 * Renders whatever `config` says — no country/visa-specific logic lives
 * here. Saves progress after every step (PATCH /api/applications/[id]),
 * so the user is never required to finish in one sitting.
 */
export function QuestionnaireRunner({
  applicationId,
  config,
  initialAnswers,
}: {
  applicationId: string;
  config: QuestionnaireConfig;
  initialAnswers: Answers;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [groupIndex, setGroupIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const visibleGroups = useMemo(() => getVisibleGroups(config, answers), [config, answers]);
  const currentGroup = visibleGroups[Math.min(groupIndex, visibleGroups.length - 1)];
  const isLastGroup = groupIndex >= visibleGroups.length - 1;

  const errorsByQuestion = useMemo(() => {
    const map: Record<string, string> = {};
    for (const err of errors) map[err.questionId] = err.message;
    return map;
  }, [errors]);

  function handleFieldChange(questionId: string, value: string | number | boolean) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function saveProgress(nextAnswers: Answers) {
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const data = await res.json();
      return (data.errors ?? []) as ValidationError[];
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    const currentQuestionIds = new Set(currentGroup.questions.map((q) => q.id));
    const stepErrors = validateAnswers(config, answers).filter((e) =>
      currentQuestionIds.has(e.questionId),
    );
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors([]);

    await saveProgress(answers);

    if (isLastGroup) {
      router.push(`/application/${applicationId}/checklist`);
    } else {
      setGroupIndex((i) => i + 1);
    }
  }

  function handleBack() {
    setGroupIndex((i) => Math.max(0, i - 1));
  }

  if (!currentGroup) return null;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <ProgressIndicator
        currentStep={groupIndex + 1}
        totalSteps={visibleGroups.length}
        title={currentGroup.title}
      />

      <div className="flex flex-col gap-6">
        {currentGroup.questions.map((question) => (
          <Field
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleFieldChange(question.id, value)}
            error={errorsByQuestion[question.id]}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={groupIndex === 0}
          className="rounded-lg px-4 py-3 text-sm font-medium text-slate-500 disabled:opacity-0"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={saving}
          className="rounded-lg bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
        >
          {saving ? "Saving…" : isLastGroup ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
