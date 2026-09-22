import crypto from "node:crypto";
import { getEnv } from "@/lib/env";

export interface GateContext {
  country: string;
  visaType: string;
  // Set only when the visitor explicitly clicked "Fill new form" (as
  // opposed to arriving via the ordinary /start -> /signin sign-in
  // path, which every login goes through and therefore ALSO carries a
  // valid gate-context cookie by the time /application renders — cookie
  // presence alone can't distinguish "just signing in" from "explicitly
  // starting over," only this flag can. See app/application/page.tsx.
  forceNew?: boolean;
}

export const GATE_CONTEXT_COOKIE_NAME = "np_gate";

/** Just long enough to land on /login after picking an option on /start. */
const TTL_MS = 10 * 60 * 1000;

function sign(payload: string): string {
  const secret = getEnv().SESSION_SECRET;
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Signed, tamper-evident cookie value carrying the qualifier-gate's decision
 * ({country, visaType}) from /start to /login. This is NOT a session — it
 * proves "the visitor just passed a supported gate selection," nothing more.
 * A real Session (auth/session.ts) is created only after magic-link verify.
 */
export function createGateContextCookieValue(ctx: GateContext): string {
  const payload = JSON.stringify({
    country: ctx.country,
    visaType: ctx.visaType,
    forceNew: ctx.forceNew ?? false,
    exp: Date.now() + TTL_MS,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyGateContextCookieValue(
  cookieValue: string | undefined,
): GateContext | null {
  if (!cookieValue) return null;
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const encoded = cookieValue.slice(0, dotIndex);
  const signature = cookieValue.slice(dotIndex + 1);
  if (!timingSafeEqual(sign(encoded), signature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (
      typeof payload.exp !== "number" ||
      Date.now() > payload.exp ||
      typeof payload.country !== "string" ||
      typeof payload.visaType !== "string"
    ) {
      return null;
    }
    return {
      country: payload.country,
      visaType: payload.visaType,
      forceNew: payload.forceNew === true,
    };
  } catch {
    return null;
  }
}
