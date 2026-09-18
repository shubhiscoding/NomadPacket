/**
 * The single sanctioned entitlement check (AGENTS.md §3.2: "gates
 * downloads") — every download-gated route must call this, never check
 * Payment status inline itself, so there's exactly one place this logic
 * can drift.
 *
 * ⚠️ STUB, BY EXPLICIT DECISION: Dodo Payments checkout/webhook wiring
 * (creating real checkout sessions, verifying webhook signatures) was
 * deferred — it requires real API credentials this environment doesn't
 * have, and the user chose to skip it for now rather than build it
 * against mocked/unverified request shapes. Until that lands, this always
 * returns true (every application is treated as entitled) so the rest of
 * the delivery flow (download, email) can be built and tested end-to-end.
 *
 * TODO(before launch): replace the body with a real check, e.g.:
 *   import { prisma } from "@/lib/prisma";
 *   const paidPayment = await prisma.payment.findFirst({
 *     where: { applicationId, status: "PAID" },
 *   });
 *   return paidPayment !== null;
 * — and wire entitlement/checkout.ts + entitlement/webhook-handler.ts
 * (Dodo Payments) to actually create PAID rows via a verified webhook.
 */
export async function hasEntitlement(_applicationId: string): Promise<boolean> {
  return true;
}
