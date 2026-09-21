import { createMagicLinkToken } from "./token";
import { sendMagicLinkEmail } from "@/notifications/send";
import { getEnv } from "@/lib/env";

/**
 * Issues a fresh magic-link token for `email` and emails it via Resend.
 * NEXT_PUBLIC_SITE_URL is the only place the site's canonical origin is
 * read from — never hardcode nomadpacket.app.
 */
export async function issueAndSendMagicLink(email: string): Promise<void> {
  const { rawToken } = await createMagicLinkToken(email);
  const verifyUrl = `${getEnv().NEXT_PUBLIC_SITE_URL}/api/auth/verify?token=${rawToken}`;
  await sendMagicLinkEmail({ to: email, verifyUrl });
}
