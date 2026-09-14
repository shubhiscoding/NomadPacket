export type ChecklistItemStatus = "done" | "action_needed" | "optional";

export interface CheckResult {
  status: ChecklistItemStatus;
  message: string;
}

/**
 * Product Spec (v1).md §2 (Bucket 3, Passport): "Validity-length check
 * against their intended stay, with a warning if it's too short" — no
 * exact month figure is given. Using 6 months beyond the intended move
 * date as a common, conservative travel-document rule of thumb (many
 * consulates/border authorities use similar buffers). Explicit
 * assumption, not a cited legal requirement — flag for verification
 * against actual Portuguese consulate guidance before launch.
 */
const PASSPORT_VALIDITY_BUFFER_MONTHS = 6;

export function checkPassportValidity(params: {
  passportExpiry?: string;
  intendedMoveDate?: string;
}): CheckResult {
  const { passportExpiry, intendedMoveDate } = params;

  if (!passportExpiry || !intendedMoveDate) {
    return {
      status: "action_needed",
      message: "Answer the passport and move-date questions to check validity.",
    };
  }

  const expiry = new Date(passportExpiry);
  const moveDate = new Date(intendedMoveDate);
  if (Number.isNaN(expiry.getTime()) || Number.isNaN(moveDate.getTime())) {
    return { status: "action_needed", message: "Couldn't read your passport expiry or move date." };
  }

  const requiredValidUntil = new Date(moveDate);
  requiredValidUntil.setMonth(requiredValidUntil.getMonth() + PASSPORT_VALIDITY_BUFFER_MONTHS);

  if (expiry.getTime() >= requiredValidUntil.getTime()) {
    return {
      status: "done",
      message: `Valid through ${expiry.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} — comfortably covers your move date plus a ${PASSPORT_VALIDITY_BUFFER_MONTHS}-month buffer.`,
    };
  }

  return {
    status: "action_needed",
    message: `Your passport expires ${expiry.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}, which is less than ${PASSPORT_VALIDITY_BUFFER_MONTHS} months after your intended move date. Consider renewing before you apply.`,
  };
}

export function checkAccommodation(params: { hasAccommodation?: boolean }): CheckResult {
  return params.hasAccommodation
    ? { status: "done", message: "Accommodation details recorded." }
    : {
        status: "action_needed",
        message: "Arrange a rental agreement or hotel booking for the visa application.",
      };
}

export function checkHealthInsurance(params: { hasHealthInsurance?: boolean }): CheckResult {
  return params.hasHealthInsurance
    ? { status: "done", message: "Health insurance already arranged." }
    : {
        status: "action_needed",
        message: "Get comprehensive health insurance covering your stay in Portugal.",
      };
}
