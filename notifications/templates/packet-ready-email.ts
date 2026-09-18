/**
 * "Your documents are ready" email — sent as a backup delivery channel
 * alongside the in-app download, with the packet attached directly (a
 * link would require the recipient to already be signed in, which
 * defeats the point of an email backup). App UI/email content, so the
 * NomadPacket brand name is fine here (contrast with letter templates in
 * document-engine/, which must never mention it).
 */
export function packetReadyEmail(): { subject: string; html: string; text: string } {
  return {
    subject: "Your NomadPacket document packet is ready",
    text:
      "Your Portugal D8 document packet is attached to this email as a ZIP file. " +
      "You can also sign back in to NomadPacket anytime to view or re-download it.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 20px; margin: 0 0 16px;">Your document packet is ready</h1>
        <p style="font-size: 14px; line-height: 1.6;">
          Your Portugal D8 document packet is attached to this email as a ZIP file.
          You can also sign back in to NomadPacket anytime to view or re-download it.
        </p>
      </div>
    `,
  };
}
