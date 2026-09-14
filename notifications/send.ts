import { getResendClient } from "./resend-client";
import { magicLinkEmail } from "./templates/magic-link-email";
import { getEnv } from "@/lib/env";

export async function sendMagicLinkEmail(params: {
  to: string;
  verifyUrl: string;
}): Promise<void> {
  const { subject, html, text } = magicLinkEmail({ verifyUrl: params.verifyUrl });
  const env = getEnv();

  await getResendClient().emails.send({
    from: `NomadPacket <${env.RESEND_FROM_EMAIL}>`,
    to: params.to,
    subject,
    html,
    text,
  });
}
