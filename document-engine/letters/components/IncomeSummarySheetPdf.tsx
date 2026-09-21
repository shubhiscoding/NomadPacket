import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  incomeSummarySheetTemplate,
  type IncomeSummarySheetData,
} from "../templates/income-summary-sheet.template";
import { pdfStyles } from "./pdf-styles";

const CELL_STYLES = [
  pdfStyles.tableCellMonth,
  pdfStyles.tableCellIncome,
  pdfStyles.tableCellSource,
  pdfStyles.tableCellAverage,
];
const HEADER_CELL_STYLES = [
  pdfStyles.tableHeaderCellMonth,
  pdfStyles.tableHeaderCellIncome,
  pdfStyles.tableHeaderCellSource,
  pdfStyles.tableHeaderCellAverage,
];

export function IncomeSummarySheetPdf({ data }: { data: IncomeSummarySheetData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{incomeSummarySheetTemplate.title}</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            {incomeSummarySheetTemplate.columns.map((col, i) => (
              <Text key={col} style={HEADER_CELL_STYLES[i]}>
                {col}
              </Text>
            ))}
          </View>
          {data.rows.map((row) => (
            <View key={row.month} style={pdfStyles.tableRow}>
              <Text style={CELL_STYLES[0]}>{row.month}</Text>
              <Text style={CELL_STYLES[1]}>{row.grossIncomeFormatted}</Text>
              <Text style={CELL_STYLES[2]}>{row.source}</Text>
              <Text style={CELL_STYLES[3]}>{row.runningAverageFormatted}</Text>
            </View>
          ))}
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...CELL_STYLES[0], fontFamily: "Helvetica-Bold" }}>Average</Text>
            <Text style={{ ...CELL_STYLES[1], fontFamily: "Helvetica-Bold" }}>
              {data.averageFormatted}
            </Text>
            <Text style={CELL_STYLES[2]} />
            <Text style={CELL_STYLES[3]} />
          </View>
        </View>

        {/* The threshold comparison is its own statement below the table,
            not crammed into the narrow "Running Average" column — that
            was causing the message to wrap mid-word. */}
        <Text style={{ marginTop: 14, fontSize: 11, fontFamily: "Helvetica-Bold" }}>
          Average vs. {data.thresholdFormatted} monthly threshold:{" "}
          {data.thresholdStatus === "met" ? "Met" : "Not met"}
        </Text>

        {/* This document's whole job is a trustworthy EUR comparison —
            silently converting currency without showing the rate would
            undermine that. Shown even when it's just "1 EUR = 1 EUR" for
            a EUR-reporting applicant, so the methodology is never a
            silent, invisible step for ANY applicant. */}
        {data.conversionNote && (
          <Text style={{ marginTop: 6, fontSize: 8.5, color: "#57534e" }}>
            {data.conversionNote}
          </Text>
        )}
      </Page>
    </Document>
  );
}
