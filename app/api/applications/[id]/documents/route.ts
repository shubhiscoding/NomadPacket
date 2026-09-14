import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/questionnaire-engine/registry";
import { isQuestionnaireComplete } from "@/questionnaire-engine/engine";
import { generateApplicationDocuments } from "@/document-engine/generate-packet";
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

/** GET: the Bucket 1 (+ Bucket 2, once wired) documents already generated. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await loadOwnedApplication(request, id);
  if ("error" in result) return result.error;

  const documents = await prisma.generatedDocument.findMany({
    where: { applicationId: id },
    orderBy: { generatedAt: "desc" },
  });
  return NextResponse.json({ documents });
}

/**
 * POST: (re)generates every Bucket-1 document for this application from
 * its current answers. Requires the questionnaire to be complete —
 * generating from partial answers would just produce documents full of
 * "[not provided]" placeholders.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await loadOwnedApplication(request, id);
  if ("error" in result) return result.error;
  const { application } = result;

  const config = getQuestionnaireConfig(application.country, application.visaType);
  const answers = application.answers as Answers;
  if (!config || !isQuestionnaireComplete(config, answers)) {
    return NextResponse.json(
      { error: "Complete the questionnaire before generating documents." },
      { status: 409 },
    );
  }

  await generateApplicationDocuments(id);

  const documents = await prisma.generatedDocument.findMany({
    where: { applicationId: id },
    orderBy: { generatedAt: "desc" },
  });
  return NextResponse.json({ documents });
}
