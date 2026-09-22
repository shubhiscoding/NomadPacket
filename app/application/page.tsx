import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/current-user";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { isSupported } from "@/country-config/qualifier-gate";
import { prisma } from "@/lib/prisma";
import { deleteDocument } from "@/lib/storage";
import { createDraftApplicationSafely } from "@/lib/create-draft-application";

/**
 * Entry point after sign-in — three distinct cases:
 *
 * 1. The user has never had any Application at all — needs a valid gate
 *    context (any sign-in reaches here with one, since /signin itself is
 *    unreachable without first passing /start) to create their first one.
 *
 * 2. The gate context's `forceNew` flag is set — the user just clicked
 *    "Fill new form" specifically (see lib/gate-context.ts and
 *    app/start/page.tsx's `?new=1`). This — NOT mere gate-context cookie
 *    presence — is what must gate "start completely clean": EVERY
 *    sign-in passes through /start -> /signin, so a valid gate-context
 *    cookie exists at this point on every single login, not just
 *    deliberate "Fill new form" clicks. Treating cookie presence alone
 *    as "start fresh" made every normal login wipe the user's drafts and
 *    create a new blank application — a real regression, not a subtle
 *    edge case. Only `forceNew` should trigger deleting every non-PAID
 *    application and creating one brand-new one.
 *
 * 3. Otherwise, a normal returning-user visit. Looks at the user's
 *    single most recent Application (any status, including PAID):
 *    - Has generated documents already → its checklist (Pay+Edit if
 *      unpaid, Download if paid).
 *    - No documents yet, but the user has paid for some application
 *      before (even a different, earlier one) → still that same most-
 *      recent application's checklist, which shows its own "Continue
 *      questionnaire" card for an incomplete application.
 *    - No documents yet, and never paid for anything → straight to the
 *      questionnaire — nothing worth showing on a checklist yet.
 */
export default async function ApplicationEntryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const cookieStore = await cookies();
  const gateContext = verifyGateContextCookieValue(
    cookieStore.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );
  const gateValid = Boolean(gateContext && isSupported(gateContext.country, gateContext.visaType));

  const mostRecent = await prisma.application.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!mostRecent) {
    if (!gateValid) redirect("/start");
    const application = await createDraftApplicationSafely({
      userId: user.id,
      country: gateContext!.country,
      visaType: gateContext!.visaType,
    });
    redirect(`/application/${application.id}/questionnaire`);
  }

  if (gateValid && gateContext!.forceNew) {
    const drafts = await prisma.application.findMany({
      where: { userId: user.id, status: { not: "PAID" } },
      include: { generatedDocuments: true },
    });
    // Storage-file deletion is a best-effort external side effect (blob/
    // filesystem), not a DB op — can't live inside the transaction below.
    for (const draft of drafts) {
      await Promise.all(draft.generatedDocuments.map((doc) => deleteDocument(doc.fileUrl)));
    }
    await prisma.application.deleteMany({
      where: { id: { in: drafts.map((draft) => draft.id) } },
    });

    const application = await createDraftApplicationSafely({
      userId: user.id,
      country: gateContext!.country,
      visaType: gateContext!.visaType,
    });
    redirect(`/application/${application.id}/questionnaire`);
  }

  const hasDocuments = await prisma.generatedDocument.count({
    where: { applicationId: mostRecent.id },
  });
  if (hasDocuments > 0) {
    redirect(`/application/${mostRecent.id}/checklist`);
  }

  const hasPaidAnywhere = await prisma.application.findFirst({
    where: { userId: user.id, status: "PAID" },
    select: { id: true },
  });
  redirect(
    hasPaidAnywhere
      ? `/application/${mostRecent.id}/checklist`
      : `/application/${mostRecent.id}/questionnaire`,
  );
}
