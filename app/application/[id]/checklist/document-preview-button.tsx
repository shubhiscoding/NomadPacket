"use client";

import { useState } from "react";
import type { DocumentPreviewField } from "@/document-engine/preview-data";

/**
 * Shows what will appear in this document — the underlying data points,
 * not the composed letter text. See document-engine/preview-data.ts for
 * why: previewing the actual rendered PDF (even degraded/watermarked)
 * let anyone read and retype the letter's wording into their own
 * document for free, since the text itself is the product here, not
 * just the layout.
 */
export function DocumentPreviewButton({
  title,
  fields,
}: {
  title: string;
  fields: DocumentPreviewField[];
}) {
  const [open, setOpen] = useState(false);
  const visibleFields = fields.filter((f) => f.value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-teal-800 hover:underline"
      >
        Review details
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              These are the details that will appear in this document. The full formatted
              document unlocks once you pay.
            </p>
            <dl className="mt-4 flex flex-col gap-3">
              {visibleFields.map((field) => (
                <div key={field.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">
                    {field.label}
                  </dt>
                  <dd className="mt-0.5 text-sm text-stone-800">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
