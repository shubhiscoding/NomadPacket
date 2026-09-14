import { describe, expect, it } from "vitest";
import { renderTemplate } from "@/document-engine/letters/render";

describe("renderTemplate", () => {
  it("substitutes every placeholder present in the data", () => {
    const result = renderTemplate(["Hello {{name}}, welcome to {{place}}."], {
      name: "Jane",
      place: "Portugal",
    });
    expect(result).toEqual(["Hello Jane, welcome to Portugal."]);
  });

  it("substitutes the same placeholder repeated multiple times", () => {
    const result = renderTemplate(["{{name}} signed by {{name}}."], { name: "Jane" });
    expect(result).toEqual(["Jane signed by Jane."]);
  });

  it("leaves an unmatched placeholder as an empty string rather than throwing", () => {
    const result = renderTemplate(["Hello {{missing}}."], {});
    expect(result).toEqual(["Hello ."]);
  });

  it("preserves paragraphs with no placeholders untouched", () => {
    const result = renderTemplate(["Sincerely,"], { name: "Jane" });
    expect(result).toEqual(["Sincerely,"]);
  });

  it("preserves paragraph order across multiple paragraphs", () => {
    const result = renderTemplate(["{{a}}", "{{b}}"], { a: "first", b: "second" });
    expect(result).toEqual(["first", "second"]);
  });
});
