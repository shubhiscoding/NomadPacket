/**
 * Generates the STUB placeholder PDF used by the Bucket-2 form-fill
 * pipeline until the real official Portuguese national visa form is
 * sourced (see the TODO in ../mappings/pt-d8-national-visa-form.mapping.ts).
 *
 * This file is entirely self-authored — it does not copy, trace, or
 * resemble any real government form layout. Its only job is to exist as a
 * fillable AcroForm PDF with obviously-fake field names so fill.ts has
 * something real to exercise in tests and previews, and so nobody
 * mistakes the output for an official document.
 *
 * Run with: npx tsx document-engine/form-fill/scripts/generate-stub-pdf.ts
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import { nationalVisaFormFieldMapping } from "../mappings/pt-d8-national-visa-form.mapping";

async function generateStubPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter, arbitrary — not modeled on the real form
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  page.drawText("SAMPLE / PLACEHOLDER FORM", {
    x: 50,
    y: 740,
    size: 18,
    font: boldFont,
    color: rgb(0.7, 0.1, 0.1),
  });
  page.drawText("NOT THE OFFICIAL PORTUGUESE NATIONAL VISA APPLICATION FORM", {
    x: 50,
    y: 718,
    size: 11,
    font: boldFont,
    color: rgb(0.7, 0.1, 0.1),
  });
  page.drawText(
    "This is a self-authored stand-in used only until the real government form is sourced.",
    { x: 50, y: 700, size: 9, font, color: rgb(0.3, 0.3, 0.3) },
  );

  let y = 660;
  for (const field of nationalVisaFormFieldMapping.fields) {
    page.drawText(field.pdfFieldName, { x: 50, y: y + 14, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
    const textField = form.createTextField(field.pdfFieldName);
    textField.addToPage(page, { x: 50, y, width: 400, height: 18 });
    y -= 40;
  }

  const bytes = await pdfDoc.save();
  const outPath = path.join(
    __dirname,
    "..",
    "assets",
    "pt-d8-national-visa-form.STUB.pdf",
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  console.log(`Wrote stub form to ${outPath}`);
}

generateStubPdf().catch((err) => {
  console.error(err);
  process.exit(1);
});
