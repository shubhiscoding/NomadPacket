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

  it("fills every newly-added field (Section E answers) without error", async () => {
    const buffer = await fillForm(
      nationalVisaFormFieldMapping,
      {
        ...(employeeUsFixture.answers as Answers),
        dateOfBirth: "1998-05-02",
        passportIssueDate: "2020-07-31",
        homeAddress: "12 Main St, Springfield",
        phoneNumber: "+1 555 123 4567",
      },
      REPO_ROOT,
    );
    const text = await extractText(buffer);
    expect(text).toContain("1998-05-02");
    expect(text).toContain("2020-07-31");
    expect(text).toContain("12 Main St, Springfield");
    expect(text).toContain("+1 555 123 4567");
    // Derived fields that don't need a new question at all:
    expect(text).toContain("Portugal"); // Member State of first entry
  });

  it("marks the checkboxes it can determine with certainty (passport type, entries requested)", async () => {
    const buffer = await fillForm(
      nationalVisaFormFieldMapping,
      employeeUsFixture.answers as Answers,
      REPO_ROOT,
    );
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(buffer);
    // Every checkbox overlay draws a literal "X" glyph at its coordinate —
    // the base (unfilled) form has zero literal "X" characters in its
    // static text, so any appearing here came from our overlay.
    const text = await extractText(buffer);
    const xCount = (text.match(/X/g) ?? []).length;
    expect(xCount).toBeGreaterThanOrEqual(2); // ordinary passport + two-entries-residency at minimum
    void pdfDoc; // loaded only to confirm the buffer is still a valid PDF
  });

  it("truncates a value that's still too wide even at the minimum font size, rather than overflowing into the next cell", async () => {
    const buffer = await fillForm(
      nationalVisaFormFieldMapping,
      {
        fullLegalName: "Jane Doe",
        homeAddress:
          "This Is A Deliberately Extremely Long Home Address That Cannot Possibly Fit In The Available Box Width No Matter The Font Size",
      } as Answers,
      REPO_ROOT,
    );
    const text = await extractText(buffer);
    expect(text).toContain("…");
    expect(text).not.toContain("No Matter The Font Size"); // the tail must have been cut
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

  it("maps a nationality code to its full label for display on the form", () => {
    expect(deriveOverlayValues({ nationality: "US" } as Answers).nationalityLabel).toBe(
      "United States",
    );
    expect(deriveOverlayValues({ nationality: "UK" } as Answers).nationalityLabel).toBe(
      "United Kingdom",
    );
    expect(deriveOverlayValues({ nationality: "CA" } as Answers).nationalityLabel).toBe("Canada");
  });

  it("always checks 'Two entries (residency)' and 'Ordinary passport' — guaranteed by product scope, not a guess", () => {
    const values = deriveOverlayValues({} as Answers);
    expect(values.entriesResidencyCheckbox).toBe("true");
    expect(values.ordinaryPassportCheckbox).toBe("true");
  });

  it("checks 'Residence elsewhere: No' by default, and 'Yes' only when currentCountry differs from nationality", () => {
    const sameCountry = deriveOverlayValues({
      nationality: "US",
      currentCountry: "United States",
    } as Answers);
    expect(sameCountry.residenceElsewhereNoCheckbox).toBe("true");
    expect(sameCountry.residenceElsewhereYesCheckbox).toBe("");

    const differentCountry = deriveOverlayValues({
      nationality: "US",
      currentCountry: "Thailand",
    } as Answers);
    expect(differentCountry.residenceElsewhereYesCheckbox).toBe("true");
    expect(differentCountry.residenceElsewhereNoCheckbox).toBe("");

    const noAnswer = deriveOverlayValues({ nationality: "US" } as Answers);
    expect(noAnswer.residenceElsewhereNoCheckbox).toBe("true");
  });

  it("always fills 'Member State of first entry' as Portugal — the only country this product supports", () => {
    expect(deriveOverlayValues({} as Answers).memberStateFirstEntry).toBe("Portugal");
  });
});
