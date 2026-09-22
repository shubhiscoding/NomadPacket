import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { issueAndSendMagicLink } from "@/auth/send-magic-link";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { consumeRateLimit, retryAfterMinutes } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-client-ip";

const bodySchema = z.object({ email: z.string().email() });

const MAGIC_LINK_RATE_LIMIT = { max: 3, windowMs: 15 * 60 * 1000 };

/**
 * Now the active alternative sign-in path — linked from /signin below the
 * Google button. Auth is only reachable after a valid, supported
 * qualifier-gate context exists (AGENTS.md build order: gate before
 * auth) — enforced here server-side, not just by the /login page's UI
 * redirect, so this route can't be hit directly to bypass the gate.
 * Reads the cookie off the request directly (not next/headers' cookies())
 * — matches every other route in this app and works whether Next
 * dispatched the request or a test calls the handler directly.
 *
 * Rate-limited on two dimensions: per email (stop spamming one inbox)
 * AND per IP (stop cycling through arbitrary emails to spam strangers or
 * burn the Resend quota) — either one blocking is enough to reject.
 */
export async function POST(request: NextRequest) {
  const gateContext = verifyGateContextCookieValue(
    request.cookies.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );
  if (!gateContext) {
    return NextResponse.json(
      { error: "Please start from the beginning." },
      { status: 403 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email;
  const ip = getClientIp(request);
  const [emailLimit, ipLimit] = await Promise.all([
    consumeRateLimit(`magic-link:email:${email}`, MAGIC_LINK_RATE_LIMIT),
    consumeRateLimit(`magic-link:ip:${ip}`, MAGIC_LINK_RATE_LIMIT),
  ]);
  if (!emailLimit.allowed || !ipLimit.allowed) {
    const retryAfterMs = Math.max(emailLimit.retryAfterMs ?? 0, ipLimit.retryAfterMs ?? 0);
    return NextResponse.json(
      {
        error: `Too many sign-in attempts. Try again in ${retryAfterMinutes(retryAfterMs)} minute(s), or use Google sign-in instead.`,
        retryAfterMs,
      },
      { status: 429 },
    );
  }

  try {
    await issueAndSendMagicLink(email);
  } catch (err) {
    console.error("Failed to send magic-link email:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't send the sign-in email — please use Google sign-in for now while we look into it.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, remaining: Math.min(emailLimit.remaining, ipLimit.remaining) });
}
