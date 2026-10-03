export function flowBEmail2(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Still thinking about the Portugal D8 visa?",
    text:
      `Hi ${name},\n\n` +
      "No pressure — just wanted to check in.\n\n" +
      "A few things people sometimes wonder about before finishing:\n\n" +
      "• You don't need every document gathered yet. The questionnaire just needs your basic info — nationality, income, move timeline.\n\n" +
      "• We're currently built for applicants from the US, UK, or Canada.\n\n" +
      "• Unlike lawyers and consultants who mark things up, we're a tool that assembles what you already have. Use code PH20 for 20% off when you're ready.\n\n" +
      "Questions? Just finish the questionnaire. Your documents generate automatically once you do.\n\n" +
      `Continue here: ${checklistUrl}\n\n` +
      "Portugal's waiting.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 22px; line-height: 1.3; margin: 0 0 24px;">Still thinking about the Portugal D8 visa?</h1>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          No pressure — just wanted to check in.
        </p>

        <p style="font-size: 15px; line-height: 1.7; font-weight: 500; margin-bottom: 16px;">
          A few things people sometimes wonder about before finishing:
        </p>

        <ul style="font-size: 15px; line-height: 1.9; margin: 0 0 20px 20px; padding: 0;">
          <li style="margin-bottom: 12px;">
            <strong>You don't need every document yet.</strong> The questionnaire just needs your basic info — nationality, income, move timeline.
          </li>
          <li style="margin-bottom: 12px;">
            <strong>We're built for US, UK, and Canada applicants</strong> (so far — more countries coming).
          </li>
          <li>
            <strong>No lawyer markup.</strong> Unlike consultants who add 30-40% to everything, we're a tool that assembles your documents. Use code <strong>PH20</strong> for 20% off when you're ready.
          </li>
        </ul>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 24px; color: #64748b;">
          Just finish the questionnaire. Your documents generate automatically once you do.
        </p>

        <a href="${checklistUrl}"
           style="display: inline-block; margin-bottom: 24px; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Continue your application
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          Portugal's waiting.
        </p>
      </div>
    `,
  };
}
