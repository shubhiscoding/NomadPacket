/**
 * Plain HTML string template (no react-email dependency needed for two
 * simple transactional emails) — kept in its own file per AGENTS.md's rule
 * that generated/sent content lives in template files, not inline in route
 * code. This is app UI/email content, not a generated legal document, so
 * the NomadPacket brand name IS allowed here (contrast with letter
 * templates in document-engine/letters/templates/, which must never
 * mention it).
 */
export function magicLinkEmail(params: { verifyUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const { verifyUrl } = params;
  return {
    subject: "Your NomadPacket sign-in link",
    text: `Sign in to NomadPacket: ${verifyUrl}\n\nThis link expires in 15 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 20px; margin: 0 0 16px;">Sign in to NomadPacket</h1>
        <p style="font-size: 14px; line-height: 1.6;">
          Click the button below to sign in. This link expires in 15 minutes.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; margin: 16px 0; padding: 12px 20px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
          Sign in
        </a>
        <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };
}
