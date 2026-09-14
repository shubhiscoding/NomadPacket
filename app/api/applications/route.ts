import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/auth/session";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { isSupported } from "@/country-config/qualifier-gate";
import { prisma } from "@/lib/prisma";

/**
 * GET: the caller's applications (most recent first).
 * POST: creates a new Application from the qualifier-gate context cookie.
 * visaType is fixed here, at creation, from the gate's decision — the
 * questionnaire never asks it again (AGENTS.md build order: gate before
 * auth, auth before questionnaire).
 */
export async function GET(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ applications });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gateContext = verifyGateContextCookieValue(
    request.cookies.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );
  if (!gateContext || !isSupported(gateContext.country, gateContext.visaType)) {
    return NextResponse.json(
      { error: "Please start from the beginning." },
      { status: 403 },
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      country: gateContext.country,
      visaType: gateContext.visaType,
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
