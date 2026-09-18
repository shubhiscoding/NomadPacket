/**
 * Persistent "step X of Y" indicator per AGENTS.md §2 design language.
 * Total steps are recomputed from currently-visible groups, so it stays
 * accurate as branching (e.g. dependents sub-questions) changes what's
 * ahead.
 */
export function ProgressIndicator({
  currentStep,
  totalSteps,
  title,
}: {
  currentStep: number;
  totalSteps: number;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
        Step {currentStep} of {totalSteps}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-stone-900">{title}</h2>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-teal-700 transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
