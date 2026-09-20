import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";
import type { FormFieldMapping } from "@/country-config/types";
import { deriveOverlayValues } from "./derive-overlay-values";

const OVERLAY_COLOR = rgb(0, 0, 0.55);
const DEFAULT_FONT_SIZE = 9;
const DEFAULT_MIN_FONT_SIZE = 6.5;

/**
 * Draws overlay text/checkmarks onto the PDF at each mapped coordinate.
 * Portugal's real national visa form has no AcroForm fields — it's a
 * flat, print-and-hand-fill PDF, like most official government forms —
 * so "filling" it means positioning content on top of the printed form
 * at measured coordinates, not setting named form fields. Works
 * identically whether `mapping` still pointed at a stub or the real form;
 * only the mapping data (coordinates + asset path) needs to change to
 * swap one in for the other.
 *
 * Text is drawn in a dark blue, distinct from the form's printed black
 * ink — a common convention for pre-filled/typed answers on a form
 * otherwise meant to be filled by hand. Text fields with a `maxWidth`
 * auto-shrink the font (down to `minFontSize`) rather than overflow into
 * a neighboring cell — several of this form's cells are genuinely tight.
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

    if (field.kind === "checkbox") {
      if (value !== "true") continue;
      page.drawText("X", {
        x: field.x,
        y: field.y,
        size: field.fontSize ?? 8,
        font,
        color: OVERLAY_COLOR,
      });
      continue;
    }

    const fontSize = fitFontSize(font, value, field.fontSize ?? DEFAULT_FONT_SIZE, field);
    const displayValue = field.maxWidth
      ? truncateToFit(font, value, fontSize, field.maxWidth)
      : value;
    page.drawText(displayValue, {
      x: field.x,
      y: field.y,
      size: fontSize,
      font,
      color: OVERLAY_COLOR,
    });
  }

  const outputBytes = await pdfDoc.save();
  return Buffer.from(outputBytes);
}

/**
 * If `field.maxWidth` is set, shrinks `startSize` down (in 0.5pt steps,
 * never below `field.minFontSize`/DEFAULT_MIN_FONT_SIZE) until the text
 * measures within the box — protects against overflow into a
 * neighboring cell rather than relying on coordinates being pixel-perfect
 * for every possible value length.
 */
function fitFontSize(
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  text: string,
  startSize: number,
  field: { maxWidth?: number; minFontSize?: number },
): number {
  if (!field.maxWidth) return startSize;

  const minSize = field.minFontSize ?? DEFAULT_MIN_FONT_SIZE;
  let size = startSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > field.maxWidth) {
    size -= 0.5;
  }
  return size;
}

/**
 * Last resort for a value so long that even minFontSize doesn't bring it
 * under maxWidth (a long street address is the realistic case) — hard
 * truncates with an ellipsis rather than let it visually run into a
 * neighboring cell. Losing the tail of an address is a much smaller
 * problem than a form that looks broken; the applicant's own copy of
 * their address is the source of truth regardless.
 */
function truncateToFit(
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  text: string,
  size: number,
  maxWidth: number,
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;

  let truncated = text;
  while (truncated.length > 1 && font.widthOfTextAtSize(`${truncated}…`, size) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}
