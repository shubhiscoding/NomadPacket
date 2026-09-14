import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  incomeSummarySheetTemplate,
  type IncomeSummarySheetData,
} from "../templates/income-summary-sheet.template";
import { pdfStyles } from "./pdf-styles";

export function IncomeSummarySheetPdf({ data }: { data: IncomeSummarySheetData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{incomeSummarySheetTemplate.title}</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            {incomeSummarySheetTemplate.columns.map((col) => (
              <Text key={col} style={pdfStyles.tableHeaderCell}>
                {col}
              </Text>
            ))}
          </View>
          {data.rows.map((row) => (
            <View key={row.month} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.tableCell}>{row.month}</Text>
              <Text style={pdfStyles.tableCell}>{row.grossIncomeFormatted}</Text>
              <Text style={pdfStyles.tableCell}>{row.source}</Text>
              <Text style={pdfStyles.tableCell}>{row.runningAverageFormatted}</Text>
            </View>
          ))}
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, fontFamily: "Helvetica-Bold" }}>Average</Text>
            <Text style={{ ...pdfStyles.tableCell, fontFamily: "Helvetica-Bold" }}>
              {data.averageFormatted}
            </Text>
            <Text style={pdfStyles.tableCell} />
            <Text style={{ ...pdfStyles.tableCell, fontFamily: "Helvetica-Bold" }}>
              vs. {data.thresholdFormatted} threshold: {data.thresholdStatus}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
