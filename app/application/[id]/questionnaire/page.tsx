import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/auth/session";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/questionnaire-engine/registry";
import { QuestionnaireRunner } from "@/questionnaire-engine/components/QuestionnaireRunner";
import type { Answers } from "@/questionnaire-engine/types";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.userId !== user.id) notFound();

  const config = getQuestionnaireConfig(application.country, application.visaType);
  if (!config) {
    // Should be unreachable: the qualifier gate only creates applications
    // for {country, visaType} combinations that have a questionnaire.
    throw new Error(
      `No questionnaire config for ${application.country}/${application.visaType}`,
    );
  }

  return (
    <QuestionnaireRunner
      applicationId={application.id}
      config={config}
      initialAnswers={application.answers as Answers}
    />
  );
}
