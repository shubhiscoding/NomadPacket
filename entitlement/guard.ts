import { prisma } from "@/lib/prisma";

/**
 * The single sanctioned entitlement check (AGENTS.md §3.2: "gates
 * downloads") — every download-gated route must call this, never check
 * Payment status inline itself, so there's exactly one place this logic
 * can drift.
 *
 * Backed by the Payment row a verified Dodo Payments webhook creates
 * (app/api/webhooks/dodo/route.ts) — never a client-side "paid" signal.
 */
export async function hasEntitlement(applicationId: string): Promise<boolean> {
  const paidPayment = await prisma.payment.findFirst({
    where: { applicationId, status: "PAID" },
  });
  return paidPayment !== null;
}
