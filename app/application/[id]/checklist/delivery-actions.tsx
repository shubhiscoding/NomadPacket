import { PaidDeliveryActions } from "./paid-delivery-actions";

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

  return <PaidDeliveryActions applicationId={applicationId} />;
}
