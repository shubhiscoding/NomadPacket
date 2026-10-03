export function flowAEmail4(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Last call: Your Portugal documents are waiting",
    text:
      `Hi ${name},\n\n` +
      "Your complete Portugal D8 visa packet is assembled and waiting for you.\n\n" +
      "All the documents are ready. All the work is done. It's just sitting there, ready to download.\n\n" +
      "If you're still planning this move, unlock your packet now. Use code PH20 for 20% off — but this offer won't last forever.\n\n" +
      `Get your documents: ${checklistUrl}\n\n` +
      "Portugal is waiting.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 22px; line-height: 1.3; margin: 0 0 24px;">Last call: Your documents are waiting</h1>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          Your complete Portugal D8 visa packet is assembled and waiting for you.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          All the documents are ready. All the work is done. It's just sitting there, ready to download.
        </p>

        <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #92400e;">
            If you're still planning this move, unlock your packet now.<br/>
            Use code <strong>PH20</strong> for 20% off — but this offer won't last forever.
          </p>
        </div>

        <a href="${checklistUrl}"
           style="display: inline-block; margin-bottom: 24px; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Get your documents
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          Portugal is waiting.
        </p>
      </div>
    `,
  };
}
