export function incompleteApplicationReminderEmail(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Finish setting up your Portugal D8 application",
    text:
      `Hi ${name},\n\n` +
      "You started your Portugal D8 digital-nomad visa application on NomadPacket — a few questions stand between you and your prepared document packet.\n\n" +
      "Portugal's D8 is one of the most accessible digital-nomad residence paths in Europe. Most applicants finish the questionnaire in under 15 minutes.\n\n" +
      `Continue your application: ${checklistUrl}\n\n` +
      "If you've decided not to continue, you can ignore this email.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 20px; margin: 0 0 16px;">Hi ${name}, let's finish what you started</h1>
        <p style="font-size: 14px; line-height: 1.6;">
          You started your Portugal D8 digital-nomad visa application on NomadPacket — a few
          questions stand between you and your prepared document packet.
        </p>
        <p style="font-size: 14px; line-height: 1.6;">
          Portugal's D8 is one of the most accessible digital-nomad residence paths in Europe.
          Most applicants finish the questionnaire in under 15 minutes.
        </p>
        <a href="${checklistUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 20px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Continue your application
        </a>
        <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
          If you've decided not to continue, you can ignore this email.
        </p>
      </div>
    `,
  };
}
