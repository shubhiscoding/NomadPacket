import { PDFDocument } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";
import type { FormFieldMapping } from "@/country-config/types";

/**
 * Generic AcroForm filler: loads the PDF at `mapping.formAssetPath`, and for
 * each entry in `mapping.fields`, sets the named text field from
 * `answers[source.questionId]`. Works identically whether `mapping` is the
 * current stub (see mappings/pt-d8-national-visa-form.mapping.ts) or a real
 * government mapping — swapping one in for the other requires no changes
 * here.
 *
 * Missing/undefined answers are written as an empty string rather than
 * thrown on, since the questionnaire may not be fully answered yet when a
 * preview is requested — the checklist UI is responsible for surfacing
 * incompleteness, not this function.
 */
export async function fillForm(
  mapping: FormFieldMapping,
  answers: Record<string, unknown>,
  repoRoot: string,
): Promise<Buffer> {
  const pdfPath = path.join(repoRoot, mapping.formAssetPath);
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  for (const field of mapping.fields) {
    const rawValue = answers[field.source.questionId];
    const textValue =
      rawValue === undefined || rawValue === null ? "" : String(rawValue);
    try {
      form.getTextField(field.pdfFieldName).setText(textValue);
    } catch {
      // Field doesn't exist on this PDF (e.g. mapping/asset drift) — skip
      // rather than throw, so one bad field doesn't block the whole packet.
      // A future improvement could surface this as a validation warning.
    }
  }

  form.flatten();
  const outputBytes = await pdfDoc.save();
  return Buffer.from(outputBytes);
}
