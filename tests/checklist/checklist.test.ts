import { describe, expect, it } from "vitest";
import {
  checkPassportValidity,
  checkAccommodation,
  checkHealthInsurance,
} from "@/lib/checklist";

describe("checkPassportValidity", () => {
  it("is done when the passport is valid well beyond the 6-month buffer", () => {
    const result = checkPassportValidity({
      passportExpiry: "2099-01-01",
      intendedMoveDate: "2027-01-01",
    });
    expect(result.status).toBe("done");
  });

  it("needs action when the passport expires within the buffer window", () => {
    const result = checkPassportValidity({
      passportExpiry: "2027-03-01",
      intendedMoveDate: "2027-01-01",
    });
    expect(result.status).toBe("action_needed");
  });

  it("needs action when expiry is exactly at the boundary minus a day", () => {
    const result = checkPassportValidity({
      passportExpiry: "2027-06-30",
      intendedMoveDate: "2027-01-01",
    });
    expect(result.status).toBe("action_needed");
  });

  it("is done when expiry is exactly at the 6-month boundary", () => {
    const result = checkPassportValidity({
      passportExpiry: "2027-07-01",
      intendedMoveDate: "2027-01-01",
    });
    expect(result.status).toBe("done");
  });

  it("needs action when either field is missing", () => {
    expect(checkPassportValidity({}).status).toBe("action_needed");
    expect(checkPassportValidity({ passportExpiry: "2099-01-01" }).status).toBe("action_needed");
  });
});

describe("checkAccommodation / checkHealthInsurance", () => {
  it("accommodation is done only when hasAccommodation is true", () => {
    expect(checkAccommodation({ hasAccommodation: true }).status).toBe("done");
    expect(checkAccommodation({ hasAccommodation: false }).status).toBe("action_needed");
    expect(checkAccommodation({}).status).toBe("action_needed");
  });

  it("health insurance is done only when hasHealthInsurance is true", () => {
    expect(checkHealthInsurance({ hasHealthInsurance: true }).status).toBe("done");
    expect(checkHealthInsurance({ hasHealthInsurance: false }).status).toBe("action_needed");
  });
});
