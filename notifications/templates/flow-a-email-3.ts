export function flowAEmail3(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Your next step to Portugal (checklist inside)",
    text:
      `Hi ${name},\n\n` +
      "You're closer than you think. Here's what you've got ready:\n\n" +
      "✓ Motivation letter\n" +
      "✓ Income documentation\n" +
      "✓ Income summary sheet\n" +
      "✓ Pre-filled visa form\n\n" +
      "What's next:\n" +
      "1. Unlock & download your packet (use code PH20 for 20% off)\n" +
      "2. Gather your remaining documents (passport, health insurance, criminal record, NIF)\n" +
      "3. Apply to your Portuguese consulate\n" +
      "4. Welcome to Portugal\n\n" +
      `Unlock your documents here: ${checklistUrl}\n\n` +
      "You've got this.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 22px; line-height: 1.3; margin: 0 0 24px;">Your next step to Portugal</h1>

        <p style="font-size: 15px; line-height: 1.7; font-weight: 500; margin-bottom: 20px;">
          You're closer than you think. Here's what you've got ready:
        </p>

        <div style="background: #f1f5f9; border-left: 4px solid #115e59; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="font-size: 14px; line-height: 1.8; margin: 0; color: #1e293b;">
            ✓ Motivation letter<br/>
            ✓ Income documentation<br/>
            ✓ Income summary sheet<br/>
            ✓ Pre-filled visa form
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.7; font-weight: 500; margin-bottom: 16px;">
          What's next:
        </p>

        <ol style="font-size: 15px; line-height: 1.8; margin: 0 0 20px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">Unlock & download your packet (use code <strong>PH20</strong> for 20% off)</li>
          <li style="margin-bottom: 8px;">Gather your remaining documents (passport, health insurance, criminal record, NIF)</li>
          <li style="margin-bottom: 8px;">Apply to your Portuguese consulate</li>
          <li>Welcome to Portugal</li>
        </ol>

        <a href="${checklistUrl}"
           style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Unlock your documents
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          You've got this.
        </p>
      </div>
    `,
  };
}
