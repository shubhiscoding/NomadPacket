/**
 * Income Summary Cover Sheet — Product Spec (v1).md §4. Tabular, not
 * prose, so it's shaped differently from the three letter templates above
 * (rows + a computed footer) rather than an ordered paragraph array.
 * No "NomadPacket" mention in the rendered PDF content (AGENTS.md §2).
 */
export interface IncomeSummaryRow {
  month: string;
  grossIncomeFormatted: string;
  source: string;
  /** "—" for the first row, else a formatted running average up to this month. */
  runningAverageFormatted: string;
}

export interface IncomeSummarySheetData {
  rows: IncomeSummaryRow[];
  averageFormatted: string;
  thresholdFormatted: string;
  /** "met" | "not met" — computed server-side, never trusted from the client. */
  thresholdStatus: "met" | "not met";
  /**
   * This document's entire job is giving a consulate a clean, trustworthy
   * comparison against the EUR threshold — silently converting currency
   * without showing the rate used would undermine exactly that. Always
   * populated, even for a EUR-reporting applicant ("no conversion
   * applied") — the methodology should never be a silently-skipped step
   * for anyone reading this.
   */
  conversionNote: string;
}

export const incomeSummarySheetTemplate = {
  id: "INCOME_SUMMARY_SHEET" as const,
  title: "Income Summary",
  // "Gross Income Received" states its own currency inline (the amount is
  // pre-formatted with the reported currency's symbol); the average
  // column's header names EUR explicitly rather than leaving the reader to
  // infer it from a symbol alone.
  columns: ["Month", "Gross Income Received", "Source", "Running 6-Month Average (EUR)"] as const,
};
