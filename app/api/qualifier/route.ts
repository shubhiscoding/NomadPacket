import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupported } from "@/country-config/qualifier-gate";
import { createGateContextCookieValue, GATE_CONTEXT_COOKIE_NAME } from "@/lib/gate-context";

const bodySchema = z.object({
  country: z.string().min(1),
  visaType: z.string().min(1),
});

/**
 * Step 1 of the flow (AGENTS.md-driven build order): decides, before any
 * account exists, whether {country, visaType} is supported. Unsupported
 * selections are routed to /waitlist and must never reach auth, the
 * questionnaire, or the document engine.
 */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { country, visaType } = parsed.data;

  if (!isSupported(country, visaType)) {
    const redirectTo = `/waitlist?country=${encodeURIComponent(country)}&visaType=${encodeURIComponent(visaType)}`;
    return NextResponse.json({ redirectTo });
  }

  const response = NextResponse.json({ redirectTo: "/login" });
  response.cookies.set(
    GATE_CONTEXT_COOKIE_NAME,
    createGateContextCookieValue({ country, visaType }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    },
  );
  return response;
}
