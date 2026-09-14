import { StyleSheet } from "@react-pdf/renderer";

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
  tableCell: { flex: 1, padding: 6, fontSize: 10 },
  tableHeaderCell: { flex: 1, padding: 6, fontSize: 10, fontFamily: "Helvetica-Bold" },
});
