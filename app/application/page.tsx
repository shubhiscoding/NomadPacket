import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/current-user";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { isSupported } from "@/country-config/qualifier-gate";
import { prisma } from "@/lib/prisma";

/**
 * Entry point after sign-in: resumes the caller's most recent Application
 * if one exists, otherwise creates one from the qualifier-gate context
 * cookie set on /start. proxy.ts already guarantees a session exists by
 * the time this renders.
 */
export default async function ApplicationEntryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const existing = await prisma.application.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    redirect(`/application/${existing.id}/questionnaire`);
  }

  const cookieStore = await cookies();
  const gateContext = verifyGateContextCookieValue(
    cookieStore.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );

  if (!gateContext || !isSupported(gateContext.country, gateContext.visaType)) {
    redirect("/start");
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      country: gateContext.country,
      visaType: gateContext.visaType,
    },
  });

  redirect(`/application/${application.id}/questionnaire`);
}
