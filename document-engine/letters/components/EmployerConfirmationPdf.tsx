import { Document, Page, Text } from "@react-pdf/renderer";
import { renderTemplate } from "../render";
import {
  employerConfirmationTemplate,
  type EmployerConfirmationData,
} from "../templates/employer-confirmation.template";
import { pdfStyles } from "./pdf-styles";

export function EmployerConfirmationPdf({ data }: { data: EmployerConfirmationData }) {
  const paragraphs = renderTemplate(
    employerConfirmationTemplate.paragraphs,
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
