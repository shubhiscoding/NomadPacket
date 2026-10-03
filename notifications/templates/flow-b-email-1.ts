export function flowBEmail1(params: {
  name: string;
  checklistUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, checklistUrl } = params;
  return {
    subject: "The Portugal dream awaits you",
    text:
      `Hi ${name},\n\n` +
      "You took the first step. You started your Portugal D8 visa application.\n\n" +
      "That's the moment most people get stuck. But you didn't — and that matters.\n\n" +
      "Imagine: working from a café overlooking the Atlantic. Sunsets that make you believe in magic. A place where life actually slows down. That's not a fantasy. That's Portugal. And it's waiting for you.\n\n" +
      "A few more questions and your documents generate themselves. No lawyers. No consultants. Just you, the questionnaire, and Portugal calling.\n\n" +
      `Finish what you started: ${checklistUrl}\n\n` +
      "The dream awaits.",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 4px;">NomadPacket</p>
        <h1 style="font-size: 24px; line-height: 1.3; margin: 0 0 24px;">The Portugal dream awaits you</h1>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          You took the first step. You started your Portugal D8 visa application.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 16px;">
          That's the moment most people get stuck. But you didn't — and that matters.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          Imagine: working from a café overlooking the Atlantic. Sunsets that make you believe in magic. A place where life actually slows down. That's not a fantasy. That's Portugal. And it's waiting for you.
        </p>

        <p style="font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          A few more questions and your documents generate themselves. No lawyers. No consultants. Just you, the questionnaire, and Portugal calling.
        </p>

        <a href="${checklistUrl}"
           style="display: inline-block; margin-bottom: 24px; padding: 14px 28px; background: #115e59; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Finish your application
        </a>

        <p style="font-size: 15px; line-height: 1.7; color: #64748b;">
          The dream awaits.
        </p>
      </div>
    `,
  };
}
