import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { issueAndSendMagicLink } from "@/auth/send-magic-link";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";

const bodySchema = z.object({ email: z.string().email() });

/**
 * ⚠️ DORMANT, UNROUTED — nothing links here anymore; /start now redirects
 * supported selections to /signin (Google via Auth.js), not /login. Kept
 * per explicit instruction rather than deleted. Also: sending this email
 * costs real Resend usage per sign-in attempt, which was the actual
 * reason Google-only replaced it.
 *
 * Auth is only reachable after a valid, supported qualifier-gate context
 * exists (AGENTS.md build order: gate before auth) — enforced here
 * server-side, not just by the /login page's UI redirect, so this route
 * can't be hit directly to bypass the gate. Reads the cookie off the
 * request directly (not next/headers' cookies()) — matches every other
 * route in this app and works whether Next dispatched the request or a
 * test calls the handler directly.
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

  try {
    await issueAndSendMagicLink(parsed.data.email);
  } catch (err) {
    console.error("Failed to send magic-link email:", err);
    return NextResponse.json(
      { error: "We couldn't send the sign-in email. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
