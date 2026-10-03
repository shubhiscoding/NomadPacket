export function flowAEmail2(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "You already did the hard part, " + name,
    text:
      `Hi ${name},\n\n` +
      "You filled out the questionnaire. Congratulations — that's the hard part.\n\n" +
      "Everything else? Done for you.\n\n" +
      "Your documents are ready. Your visa form is pre-filled. No figuring out where to go, no uncertainty, no paying big bucks to consultants and lawyers.\n\n" +
      "One click to access it all. Use code PH20 for 20% off.\n\n" +
      `Review and unlock: ${checklistUrl}\n\n` +
      "Portugal is calling.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 22px; line-height: 1.3; margin: 0 0 24px;">You already did the hard part</h1>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          You filled out the questionnaire. Congratulations — that's the hard part.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          Everything else? Done for you.
        </p>

        <ul style="font-size: 15px; line-height: 1.8; margin: 16px 0 20px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">✓ Your documents are written</li>
          <li style="margin-bottom: 8px;">✓ Your visa form is pre-filled</li>
          <li style="margin-bottom: 8px;">✓ No figuring it out on your own</li>
          <li style="margin-bottom: 8px;">✓ No expensive lawyers or consultants</li>
        </ul>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          One click to access it all. Use code <strong style="letter-spacing: 0.5px;">PH20</strong> for 20% off.
        </p>

        <a href="${checklistUrl}"
           style="display: inline-block; margin-bottom: 24px; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Review and unlock
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          Portugal is calling.
        </p>
      </div>
    `,
  };
}
