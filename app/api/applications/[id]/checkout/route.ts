import { NextRequest, NextResponse } from "next/server";
import { loadOwnedApplication } from "@/lib/load-owned-application";
import { getCurrentUser } from "@/auth/current-user";
import { prisma } from "@/lib/prisma";
import { createCheckoutUrl } from "@/entitlement/checkout";

/**
 * Starts a Dodo Payments checkout for this application's packet.
 * Redirects the browser straight to Dodo's hosted checkout page — this
 * route does no rendering of its own, it's a link target from the
 * checklist's "Pay to unlock" button.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await loadOwnedApplication(id);
  if ("error" in result) return result.error;

  const existingPaidPayment = await prisma.payment.findFirst({
    where: { applicationId: id, status: "PAID" },
  });
  if (existingPaidPayment) {
    return NextResponse.redirect(
      new URL(`/application/${id}/checklist`, _request.url),
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.application.update({
    where: { id },
    data: { status: "AWAITING_PAYMENT" },
  });

  const checkoutUrl = await createCheckoutUrl({ applicationId: id, user });
  return NextResponse.redirect(checkoutUrl);
}
