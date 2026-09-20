import { StyleSheet, Font } from "@react-pdf/renderer";

/**
 * react-pdf's default hyphenation engine breaks words mid-syllable when a
 * column is narrow ("Re-ceived", "Av-erage", "thresh-old") — fine for
 * flowing prose, ugly and unprofessional-looking in a table header/cell.
 * Disabling it globally: word-wrap still happens at spaces, just never
 * mid-word.
 */
Font.registerHyphenationCallback((word) => [word]);

/**
 * Shared plain-letter styling — deliberately plain (no NomadPacket
 * branding, no logo) since these documents must read as the applicant's
 * own words to a consulate (AGENTS.md §2).
 */
export const pdfStyles = StyleSheet.create({
  page: { padding: 56, fontSize: 11, lineHeight: 1.5, fontFamily: "Helvetica" },
  paragraph: { marginBottom: 14 },
  title: { fontSize: 14, marginBottom: 20, fontFamily: "Helvetica-Bold" },
  table: { display: "flex", flexDirection: "column", width: "100%" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableHeaderRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#0f172a" },
  // Unequal widths — "Month" and "Source" need far less room than "Running
  // 6-Month Average" (long header, long formatted value). Equal flex:1
  // columns were what caused the header text to wrap awkwardly.
  tableCellMonth: { flex: 0.7, padding: 6, fontSize: 9.5 },
  tableCellIncome: { flex: 1.1, padding: 6, fontSize: 9.5 },
  tableCellSource: { flex: 1.1, padding: 6, fontSize: 9.5 },
  tableCellAverage: { flex: 1.3, padding: 6, fontSize: 9.5 },
  tableHeaderCellMonth: { flex: 0.7, padding: 6, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  tableHeaderCellIncome: { flex: 1.1, padding: 6, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  tableHeaderCellSource: { flex: 1.1, padding: 6, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  tableHeaderCellAverage: { flex: 1.3, padding: 6, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
});
