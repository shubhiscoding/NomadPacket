import { Document, Page, Text } from "@react-pdf/renderer";
import { renderTemplate } from "../render";
import { motivationLetterTemplate, type MotivationLetterData } from "../templates/motivation-letter.template";
import { pdfStyles } from "./pdf-styles";

export function MotivationLetterPdf({ data }: { data: MotivationLetterData }) {
  const paragraphs = renderTemplate(
    motivationLetterTemplate.paragraphs,
    data as unknown as Record<string, string>,
  );
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {paragraphs.map((paragraph, i) => (
          <Text key={i} style={pdfStyles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
