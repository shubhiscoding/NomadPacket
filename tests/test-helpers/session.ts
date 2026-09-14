import { prisma } from "@/lib/prisma";
import { createSessionRecord, SESSION_COOKIE_NAME } from "@/auth/session";
import { createGateContextCookieValue, GATE_CONTEXT_COOKIE_NAME } from "@/lib/gate-context";

/** Creates a real User + Session row and returns a Cookie header value for it. */
export async function createTestSessionCookie(email: string): Promise<{
  userId: string;
  cookieHeader: string;
}> {
  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });
  const { rawToken } = await createSessionRecord(user.id);
  return { userId: user.id, cookieHeader: `${SESSION_COOKIE_NAME}=${rawToken}` };
}

export function gateContextCookieHeader(country: string, visaType: string): string {
  return `${GATE_CONTEXT_COOKIE_NAME}=${createGateContextCookieValue({ country, visaType })}`;
}
