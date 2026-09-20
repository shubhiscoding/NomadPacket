import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";
import type { FormFieldMapping } from "@/country-config/types";
import { deriveOverlayValues } from "./derive-overlay-values";

/**
 * Draws overlay text onto the PDF at each mapped coordinate. Portugal's
 * real national visa form has no AcroForm fields — it's a flat,
 * print-and-hand-fill PDF, like most official government forms — so
 * "filling" it means positioning text on top of the printed form at
 * measured coordinates, not setting named form fields. Works identically
 * whether `mapping` still pointed at a stub or the real form; only the
 * mapping data (coordinates + asset path) needs to change to swap one in
 * for the other.
 *
 * Text is drawn in a dark blue, distinct from the form's printed black
 * ink — a common convention for pre-filled/typed answers on a form
 * otherwise meant to be filled by hand.
 */
export async function fillForm(
  mapping: FormFieldMapping,
  answers: Record<string, unknown>,
  repoRoot: string,
): Promise<Buffer> {
  const pdfPath = path.join(repoRoot, mapping.formAssetPath);
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  const overlayValues = deriveOverlayValues(answers as Parameters<typeof deriveOverlayValues>[0]);

  for (const field of mapping.fields) {
    const value = overlayValues[field.source.questionId];
    if (!value) continue; // nothing to draw rather than drawing an empty string

    const page = pages[field.page];
    if (!page) continue; // mapping/asset drift (wrong page count) — skip, don't throw

    page.drawText(value, {
      x: field.x,
      y: field.y,
      size: field.fontSize ?? 9,
      font,
      color: rgb(0, 0, 0.55),
    });
  }

  const outputBytes = await pdfDoc.save();
  return Buffer.from(outputBytes);
}
