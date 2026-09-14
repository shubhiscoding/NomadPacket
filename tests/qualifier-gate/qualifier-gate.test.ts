import { describe, expect, it } from "vitest";
import { isSupported, qualifierGateConfig } from "@/country-config/qualifier-gate";
import type { QualifierGateEntry } from "@/country-config/types";

describe("qualifier gate config", () => {
  it("supports PT D8_RESIDENCE in v1", () => {
    expect(isSupported("PT", "D8_RESIDENCE")).toBe(true);
  });

  it("does not support PT D8_TEMPORARY in v1", () => {
    expect(isSupported("PT", "D8_TEMPORARY")).toBe(false);
  });

  it("does not support an unlisted country/visaType combination", () => {
    expect(isSupported("ES", "D8_RESIDENCE")).toBe(false);
  });

  it("proves the add-country contract: a new country becomes supported via a config addition only, no code change", () => {
    const hypotheticalCountry2Config: QualifierGateEntry[] = [
      ...qualifierGateConfig,
      { country: "ES", visaType: "DIGITAL_NOMAD", supported: true },
    ];
    expect(isSupported("ES", "DIGITAL_NOMAD", hypotheticalCountry2Config)).toBe(true);
    // Existing entries are unaffected by the addition.
    expect(isSupported("PT", "D8_RESIDENCE", hypotheticalCountry2Config)).toBe(true);
  });
});
