"use client";

import type { Question } from "../../types";

/**
 * Generic field renderer, dispatching on `question.fieldType` only — no
 * question ever hardcodes UI logic per country/visa-type. Adding a new
 * question to a config file (any country) renders through this same
 * component automatically.
 */
export function Field({
  question,
  value,
  onChange,
  error,
}: {
  question: Question;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
  error?: string;
}) {
  const inputClasses =
    "w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-teal-700";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={question.id} className="text-sm font-medium text-stone-700">
        {question.label}
        {!question.required && <span className="ml-1 text-stone-400">(optional)</span>}
      </label>
      {question.helpText && (
        <p className="text-xs leading-relaxed text-stone-500">{question.helpText}</p>
      )}

      {renderInput(question, value, onChange, inputClasses)}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function renderInput(
  question: Question,
  value: string | number | boolean | undefined,
  onChange: (value: string | number | boolean) => void,
  inputClasses: string,
) {
  switch (question.fieldType) {
    case "text":
      return (
        <input
          id={question.id}
          type="text"
          className={inputClasses}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          id={question.id}
          className={inputClasses}
          rows={3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "date":
      return (
        <input
          id={question.id}
          type="date"
          className={inputClasses}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          id={question.id}
          type="number"
          className={inputClasses}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "currency":
      return (
        <input
          id={question.id}
          type="number"
          step="0.01"
          className={inputClasses}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "select":
      return (
        <select
          id={question.id}
          className={inputClasses}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "radio":
      return (
        <div className="flex flex-col gap-2">
          {question.options?.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700"
            >
              <input
                type="radio"
                name={question.id}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      );
    case "boolean":
      return (
        <div className="flex gap-3">
          {[
            { label: "Yes", val: true },
            { label: "No", val: false },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.val)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                value === option.val
                  ? "border-teal-700 bg-teal-50 text-teal-900"
                  : "border-stone-200 text-stone-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
  }
}
