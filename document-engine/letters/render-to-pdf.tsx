import { renderToBuffer } from "@react-pdf/renderer";
import { MotivationLetterPdf } from "./components/MotivationLetterPdf";
import { EmployerConfirmationPdf } from "./components/EmployerConfirmationPdf";
import { FreelancerNarrativePdf } from "./components/FreelancerNarrativePdf";
import { IncomeSummarySheetPdf } from "./components/IncomeSummarySheetPdf";
import type { MotivationLetterData } from "./templates/motivation-letter.template";
import type { EmployerConfirmationData } from "./templates/employer-confirmation.template";
import type { FreelancerNarrativeData } from "./templates/freelancer-narrative.template";
import type { IncomeSummarySheetData } from "./templates/income-summary-sheet.template";

/**
 * Kept separate from document-engine/generate.ts (the pure answers -> data
 * mappers) so the mapper logic — where the actual business rules live —
 * stays unit-testable without needing a PDF rendering environment. This
 * file is the thin JSX/rendering layer on top.
 */
export function renderMotivationLetterPdf(data: MotivationLetterData): Promise<Buffer> {
  return renderToBuffer(<MotivationLetterPdf data={data} />);
}

export function renderEmployerConfirmationPdf(
  data: EmployerConfirmationData,
): Promise<Buffer> {
  return renderToBuffer(<EmployerConfirmationPdf data={data} />);
}

export function renderFreelancerNarrativePdf(data: FreelancerNarrativeData): Promise<Buffer> {
  return renderToBuffer(<FreelancerNarrativePdf data={data} />);
}

export function renderIncomeSummarySheetPdf(data: IncomeSummarySheetData): Promise<Buffer> {
  return renderToBuffer(<IncomeSummarySheetPdf data={data} />);
}
