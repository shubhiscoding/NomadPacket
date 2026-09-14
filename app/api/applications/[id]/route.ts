import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserFromRequest } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/questionnaire-engine/registry";
import { validateAnswers } from "@/questionnaire-engine/engine";
import type { Answers } from "@/questionnaire-engine/types";

async function loadOwnedApplication(request: NextRequest, id: string) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }

  return { application };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await loadOwnedApplication(request, id);
  if ("error" in result) return result.error;

  return NextResponse.json({ application: result.application });
}

const patchBodySchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

/**
 * Saves questionnaire answers incrementally — the user is not required to
 * finish in one sitting (AGENTS.md build order). Merges into existing
 * answers rather than replacing wholesale, and re-validates server-side
 * using the exact same validateAnswers() the client uses, per AGENTS.md
 * §4 ("server-side validation always mirrors client-side"). Invalid
 * answers are still saved (so progress isn't lost) but reported back so
 * the client can surface them.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await loadOwnedApplication(request, id);
  if ("error" in result) return result.error;
  const { application } = result;

  const json = await request.json().catch(() => null);
  const parsed = patchBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const mergedAnswers: Answers = {
    ...(application.answers as Answers),
    ...(parsed.data.answers as Answers),
  };

  const config = getQuestionnaireConfig(application.country, application.visaType);
  const errors = config ? validateAnswers(config, mergedAnswers) : [];
  const isComplete = config ? errors.length === 0 : false;

  const updated = await prisma.application.update({
    where: { id },
    data: {
      answers: mergedAnswers,
      status: isComplete ? "QUESTIONNAIRE_COMPLETE" : "DRAFT",
    },
  });

  return NextResponse.json({ application: updated, errors });
}
