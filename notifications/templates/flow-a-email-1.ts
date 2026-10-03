export function flowAEmail1(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "Your Portugal dream is just one click away",
    text:
      `Hi ${name},\n\n` +
      "Imagine waking up to ocean breezes, working from a café overlooking the Atlantic, and living in a place where life moves at a pace that actually makes sense. That's the Portugal D8 digital-nomad lifestyle waiting for you.\n\n" +
      "The paperwork? Already done. Your documents are assembled and ready.\n\n" +
      "One click to unlock it all. Use code PH20 for 20% off.\n\n" +
      `Get your documents: ${checklistUrl}\n\n` +
      "The good life is waiting.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 24px; line-height: 1.3; margin: 0 0 20px;">Your Portugal dream is just one click away</h1>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          Imagine waking up to ocean breezes, working from a café overlooking the Atlantic, and living in a place where life moves at a pace that actually makes sense.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          That's the Portugal D8 digital-nomad lifestyle waiting for you.
        </p>

        <p style="font-size: 15px; line-height: 1.7; font-weight: 500; margin-bottom: 20px;">
          The paperwork? Already done. Your documents are assembled and ready.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          Use code <strong style="letter-spacing: 0.5px;">PH20</strong> for 20% off.
        </p>

        <a href="${checklistUrl}"
           style="display: inline-block; margin-bottom: 24px; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Unlock your documents
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          The good life is waiting.
        </p>
      </div>
    `,
  };
}
