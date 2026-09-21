/**
 * ⚠️ Email delivery is dormant, not deleted — the "Email me my packet"
 * button (and its POST /api/applications/[id]/email-packet route,
 * notifications/send.ts's sendPacketReadyEmail) were removed from the UI
 * to avoid per-send Resend cost while pre-revenue, same reasoning as
 * dropping magic-link sign-in emails. The backend route still works if
 * called directly; just nothing links to it.
 */
export function DeliveryActions({
  applicationId,
  isPaid,
}: {
  applicationId: string;
  isPaid: boolean;
}) {
  if (!isPaid) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`/api/applications/${applicationId}/checkout`}
          className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
        >
          Pay to unlock download
        </a>
        <p className="text-xs text-stone-500">
          Review the details used in each document above before you pay.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`/api/documents/${applicationId}/download`}
        className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
      >
        Download packet (.zip)
      </a>
    </div>
  );
}
