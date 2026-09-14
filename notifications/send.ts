import { getResendClient } from "./resend-client";
import { magicLinkEmail } from "./templates/magic-link-email";
import { getEnv } from "@/lib/env";

export async function sendMagicLinkEmail(params: {
  to: string;
  verifyUrl: string;
}): Promise<void> {
  const { subject, html, text } = magicLinkEmail({ verifyUrl: params.verifyUrl });
  const env = getEnv();

  // Resend's SDK returns { data, error } rather than throwing on API-level
  // failures (e.g. an invalid key, rate limiting) — awaiting without
  // checking `error` would silently report success to the caller even
  // though nothing was sent. Throw explicitly so callers (and their
  // callers, e.g. the magic-link route) see the failure.
  const { error } = await getResendClient().emails.send({
    from: `NomadPacket <${env.RESEND_FROM_EMAIL}>`,
    to: params.to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend failed to send email to ${params.to}: ${error.message}`);
  }
}
