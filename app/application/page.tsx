import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/current-user";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { isSupported } from "@/country-config/qualifier-gate";
import { prisma } from "@/lib/prisma";
import { findResumableApplication } from "@/lib/find-resumable-application";

/**
 * Entry point after sign-in: resumes the caller's most recent non-PAID
 * Application if one exists, otherwise creates one from the qualifier-gate
 * context cookie set on /start. A PAID application is done, not resumable
 * — this is also the "Fill new form" entry point (links to /start), which
 * relies on a PAID application no longer blocking a fresh one here.
 * proxy.ts already guarantees a session exists by the time this renders.
 */
export default async function ApplicationEntryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const existing = await findResumableApplication(user.id);

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
