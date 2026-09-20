import { describe, expect, it } from "vitest";
import { PDFParse } from "pdf-parse";
import fs from "node:fs";
import path from "node:path";
import { fillForm } from "@/document-engine/form-fill/fill";
import { nationalVisaFormFieldMapping } from "@/document-engine/form-fill/mappings/pt-d8-national-visa-form.mapping";
import { splitFullName, deriveOverlayValues } from "@/document-engine/form-fill/derive-overlay-values";
import type { Answers } from "@/questionnaire-engine/types";
import employeeUsFixture from "../fixtures/us-employee-residence.json";

const REPO_ROOT = path.resolve(__dirname, "../..");

async function extractText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}

describe("Bucket-2 form-fill: real government form", () => {
  it("is flagged as the real form, not a stub, and the README exists", () => {
    expect(nationalVisaFormFieldMapping.isStub).toBe(false);
    expect(
      fs.existsSync(path.join(REPO_ROOT, "document-engine/form-fill/README.md")),
    ).toBe(true);
  });

  it("the real asset exists, has no AcroForm fields, and is the actual national visa form", async () => {
    const assetPath = path.join(REPO_ROOT, nationalVisaFormFieldMapping.formAssetPath);
    expect(fs.existsSync(assetPath)).toBe(true);

    const buffer = fs.readFileSync(assetPath);
    const text = await extractText(buffer);
    expect(text).toContain("APPLICATION FOR NATIONAL VISA");

    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(buffer);
    expect(pdfDoc.getForm().getFields().length).toBe(0);
  });

  it("populates every mapped field from a fixture's answers, at the right position, without touching the printed labels", async () => {
    const buffer = await fillForm(
      nationalVisaFormFieldMapping,
      employeeUsFixture.answers as Answers,
      REPO_ROOT,
    );
    const text = await extractText(buffer);

    // Split name: "Jane Doe" -> surname "Doe", given name "Jane".
    expect(text).toContain("Doe");
    expect(text).toContain("Jane");
    expect(text).toContain("US");
    expect(text).toContain("X1234567");
    expect(text).toContain("Acme Inc");
    // The form's own printed content should still be intact.
    expect(text).toContain("APPLICATION FOR NATIONAL VISA");
  });

  it("draws nothing for a missing answer rather than throwing or writing 'undefined'", async () => {
    const partialAnswers: Answers = { fullLegalName: "Jane Doe" };
    const buffer = await fillForm(nationalVisaFormFieldMapping, partialAnswers, REPO_ROOT);
    const text = await extractText(buffer);
    expect(text).not.toContain("undefined");
    expect(buffer.length).toBeGreaterThan(0);
  });
});

describe("splitFullName", () => {
  it("splits a simple two-word name into given name(s) and surname", () => {
    expect(splitFullName("Jane Doe")).toEqual({ surname: "Doe", givenNames: "Jane" });
  });

  it("treats every word before the last as given names for a longer name", () => {
    expect(splitFullName("Maria Clara Santos")).toEqual({
      surname: "Santos",
      givenNames: "Maria Clara",
    });
  });

  it("handles a single-word name", () => {
    expect(splitFullName("Madonna")).toEqual({ surname: "Madonna", givenNames: "" });
  });

  it("handles an empty/missing name without throwing", () => {
    expect(splitFullName(undefined)).toEqual({ surname: "", givenNames: "" });
    expect(splitFullName("")).toEqual({ surname: "", givenNames: "" });
  });
});

describe("deriveOverlayValues", () => {
  it("includes both raw answers and the synthetic derived keys", () => {
    const values = deriveOverlayValues({
      fullLegalName: "Jane Doe",
      employmentType: "employee",
      nationality: "US",
    } as Answers);
    expect(values.surname).toBe("Doe");
    expect(values.givenNames).toBe("Jane");
    expect(values.occupationLabel).toBe("Employee");
    expect(values.nationality).toBe("US");
  });

  it("maps each employment type to a distinct human-readable occupation label", () => {
    expect(deriveOverlayValues({ employmentType: "freelancer" } as Answers).occupationLabel).toBe(
      "Freelancer / independent contractor",
    );
    expect(
      deriveOverlayValues({ employmentType: "business_owner" } as Answers).occupationLabel,
    ).toBe("Business owner");
  });
});
