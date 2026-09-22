import { Document, Page, Text } from "@react-pdf/renderer";
import { renderTemplate } from "../render";
import {
  freelancerNarrativeTemplate,
  type FreelancerNarrativeData,
} from "../templates/freelancer-narrative.template";
import { pdfStyles } from "./pdf-styles";

export function FreelancerNarrativePdf({ data }: { data: FreelancerNarrativeData }) {
  const paragraphs = renderTemplate(
    freelancerNarrativeTemplate.paragraphs,
    data as unknown as Record<string, string>,
  );
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {paragraphs
          .filter((p) => p.trim().length > 0)
          .map((paragraph, i) => (
            <Text key={i} style={pdfStyles.paragraph}>
              {paragraph}
            </Text>
          ))}
      </Page>
    </Document>
  );
}
