import { getEnv } from "@/lib/env";

export function GET() {
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;
  const body = `# NomadPacket

> NomadPacket is a document-assembly tool for applicants preparing Portugal's D8 digital nomad residence visa.

## Scope

- Supports Portugal's D8 residence visa only.
- Supports applicants applying from the United States, United Kingdom, and Canada.
- This is not legal advice and does not guarantee visa approval.
- The Portugal D8 temporary-stay visa, other countries, post-arrival AIMA procedures, and non-English interfaces are outside the current product scope.

## Public resources

- [D8 document checklist](${siteUrl}/checklist): Public checklist covering generated documents, the national visa form, and applicant-sourced documents.
- [D8 income calculator](${siteUrl}/tools/income-calculator): Free calculator using the current versioned eligibility configuration and family-size formula.
- [D8 motivation letter sample](${siteUrl}/resources/motivation-letter-sample): Fictional example and guidance for a personalized motivation letter.
- [D8 employer letter sample](${siteUrl}/resources/employer-letter-sample): Fictional employer confirmation example and an HR request script.
- [NIF guide](${siteUrl}/resources/nif-guide): Guide to obtaining a Portuguese NIF as a non-resident.
- [US applicant guide](${siteUrl}/us): Country-specific criminal-record and application guidance for US applicants.
- [UK applicant guide](${siteUrl}/uk): Country-specific criminal-record and application guidance for UK applicants.
- [Canadian applicant guide](${siteUrl}/ca): Country-specific criminal-record and application guidance for Canadian applicants.

## Product workflow

Applicants answer a structured questionnaire once. NomadPacket generates a motivation letter, an employer confirmation letter for employees or an income narrative for freelancers and business owners, an income summary sheet, and a pre-filled Portuguese national visa application form. The applicant remains responsible for reviewing every document and obtaining supporting evidence.

## Important limitations

- Generated documents are drafts for applicant review, not legal determinations.
- Applicants must verify current requirements with the Portuguese consulate or visa-processing center handling their application.
- The income summary is a cover sheet based on reported answers; it does not replace bank statements, contracts, invoices, insurance, criminal-record certificates, or other original evidence.
- Some national visa form fields remain blank deliberately, including signatures and ambiguous personal classifications.

## Canonical site

- ${siteUrl}/
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
