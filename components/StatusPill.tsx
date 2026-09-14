export type StatusPillValue = "done" | "action_needed" | "optional";

const STYLES: Record<StatusPillValue, { label: string; className: string }> = {
  done: { label: "Done", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  action_needed: { label: "Action Needed", className: "bg-amber-50 text-amber-800 border-amber-200" },
  optional: { label: "Optional", className: "bg-slate-50 text-slate-500 border-slate-200" },
};

/**
 * The one reusable status pill component per AGENTS.md §2 design
 * language: Done (green) / Action Needed (amber) / Optional (neutral).
 * Every checklist item — Bucket 1, 2, or 3 — renders through this, so the
 * visual language stays consistent across the whole checklist screen.
 */
export function StatusPill({ status }: { status: StatusPillValue }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
