import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import { fillForm } from "@/document-engine/form-fill/fill";
import { nationalVisaFormFieldMapping } from "@/document-engine/form-fill/mappings/pt-d8-national-visa-form.mapping";
import type { Answers } from "@/questionnaire-engine/types";
import employeeUsFixture from "../fixtures/us-employee-residence.json";

const REPO_ROOT = path.resolve(__dirname, "../..");

describe("Bucket-2 form-fill stub", () => {
  it("is explicitly flagged as a stub, not sourced from the real government form", () => {
    // Guard against silently forgetting the pre-launch blocker — see
    // document-engine/form-fill/README.md.
    expect(nationalVisaFormFieldMapping.isStub).toBe(true);
    expect(
      fs.existsSync(path.join(REPO_ROOT, "document-engine/form-fill/README.md")),
    ).toBe(true);
  });

  it("populates every mapped field from a fixture's answers", async () => {
    const buffer = await fillForm(
      nationalVisaFormFieldMapping,
      employeeUsFixture.answers as Answers,
      REPO_ROOT,
    );

    const pdfDoc = await PDFDocument.load(buffer);
    const { text } = await import("pdf-parse").then(({ PDFParse }) =>
      new PDFParse({ data: buffer }).getText(),
    );

    expect(text).toContain("Jane Doe");
    expect(text).toContain("US");
    expect(text).toContain("X1234567");
    // The form is flattened after filling (fill.ts calls form.flatten()),
    // so there should be no remaining editable AcroForm fields.
    expect(pdfDoc.getForm().getFields().length).toBe(0);
  });

  it("writes an empty string for an answer that's missing, rather than throwing", async () => {
    const partialAnswers: Answers = { fullLegalName: "Jane Doe" };
    const buffer = await fillForm(nationalVisaFormFieldMapping, partialAnswers, REPO_ROOT);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
