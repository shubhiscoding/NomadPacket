import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/auth/current-user";
import { prisma } from "@/lib/prisma";
import { RETENTION_DAYS } from "@/lib/retention";
import { StatusPill } from "@/components/StatusPill";

/**
 * "My documents" — every packet the user has PAID for, listed regardless
 * of which Application it belongs to (see app/application/page.tsx's
 * findResumableApplication, which now excludes PAID applications from
 * the single-resumable-slot so a user can buy more than one packet).
 * Abandoned/in-progress applications intentionally never appear here —
 * this is a receipt list, not a drafts list.
 */
export default async function DocumentHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  const paidApplications = await prisma.application.findMany({
    where: { userId: user.id, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: {
      // Oldest row per application is enough to know whether the cron
      // (app/api/cron/delete-expired-documents/route.ts) has already
      // deleted everything, and gives the conservative (earliest
      // possible) expiry date if not.
      generatedDocuments: { orderBy: { generatedAt: "asc" }, take: 1 },
    },
  });

  // The checklist page links here with ?from=<applicationId> so "Back"
  // returns to that specific checklist rather than /application, which
  // would resume straight into the questionnaire for an in-progress
  // application — not "back" at all. Falls back to /application when
  // arriving here without that context (or for someone else's id).
  const { from } = await searchParams;
  const backHref =
    from && (await prisma.application.findFirst({ where: { id: from, userId: user.id } }))
      ? `/application/${from}/checklist`
      : "/application";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-700"
      >
        ← Back
      </Link>

      <p className="text-sm font-medium text-stone-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">My documents</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Every packet you&apos;ve paid for. Documents stay downloadable for {RETENTION_DAYS} days
        after generation — no need to pay again within that window.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {paidApplications.length === 0 && (
          <p className="text-sm text-stone-500">No paid packets yet.</p>
        )}

        {paidApplications.map((application) => {
          const oldestDoc = application.generatedDocuments[0];
          const available = oldestDoc !== undefined;
          const availableUntil = oldestDoc
            ? new Date(oldestDoc.generatedAt.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000)
            : null;

          return (
            <div
              key={application.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">
                  Portugal D8 Residence Visa packet
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Purchased{" "}
                  {application.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {available && availableUntil && (
                    <>
                      {" "}
                      · downloadable until{" "}
                      {availableUntil.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {available ? (
                  <a
                    href={`/api/documents/${application.id}/download`}
                    className="text-sm font-medium text-teal-800 hover:underline"
                  >
                    Download
                  </a>
                ) : (
                  <Link
                    href={`/application/${application.id}/checklist`}
                    className="text-sm font-medium text-teal-800 hover:underline"
                  >
                    Regenerate for free
                  </Link>
                )}
                <StatusPill status={available ? "done" : "action_needed"} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
