export function awaitingPaymentReminderEmail(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Your Portugal D8 documents are ready and waiting",
    text:
      `Hi ${name},\n\n` +
      "Your NomadPacket document packet for Portugal's D8 visa is fully prepared — motivation letter, income summary, and your pre-filled national visa form, all ready to download.\n\n" +
      "Portugal's D8 is one of the most accessible digital-nomad residence paths in Europe, and the hardest part — getting the paperwork right — is already done on your end. It's waiting for you, not the other way around.\n\n" +
      "Use code PH20 at checkout for 20% off.\n\n" +
      `Review and pay: ${checklistUrl}\n\n` +
      "If you've already taken care of this, you can ignore this email.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 20px; margin: 0 0 16px;">Hi ${name}, your documents are ready and waiting</h1>
        <p style="font-size: 14px; line-height: 1.6;">
          Your document packet for Portugal's D8 visa is fully prepared — motivation letter,
          income summary, and your pre-filled national visa form, all ready to download.
        </p>
        <p style="font-size: 14px; line-height: 1.6;">
          Portugal's D8 is one of the most accessible digital-nomad residence paths in Europe,
          and the hardest part — getting the paperwork right — is already done on your end.
          It's waiting for you, not the other way around.
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin-top: 16px;">
          Use code <strong style="letter-spacing: 0.5px;">PH20</strong> at checkout for 20% off.
        </p>
        <a href="${checklistUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 20px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Review and pay
        </a>
        <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
          If you've already taken care of this, you can ignore this email.
        </p>
      </div>
    `,
  };
}
