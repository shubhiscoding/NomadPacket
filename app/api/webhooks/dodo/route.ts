import { Webhooks } from "@dodopayments/nextjs";
import type { Payment } from "@dodopayments/core";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

/**
 * Dodo Payments webhook — the only place Payment/Application status ever
 * flips to PAID. Never trust a client-side "paid" signal (AGENTS.md §4);
 * this is the server-verified source of truth entitlement/guard.ts reads.
 *
 * Uses the @dodopayments/nextjs adapter's `Webhooks()` handler, which
 * verifies the request signature against DODO_PAYMENTS_WEBHOOK_KEY before
 * calling any of these event handlers — an unsigned or mis-signed request
 * never reaches this code.
 */
async function upsertPaymentRow(data: Payment, status: "PAID" | "FAILED") {
  const applicationId = data.metadata?.applicationId as string | undefined;
  const paymentId = data.payment_id;
  if (!applicationId || !paymentId) {
    console.error("Dodo webhook payment payload missing applicationId metadata or payment_id", data);
    return;
  }

  const totalAmount = data.total_amount;
  const currency = data.currency;

  await prisma.payment.upsert({
    where: { providerRef: paymentId },
    create: { applicationId, providerRef: paymentId, status, amount: totalAmount, currency },
    update: { status, amount: totalAmount, currency },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status === "PAID" ? "PAID" : "QUESTIONNAIRE_COMPLETE" },
  });
}

export const POST = Webhooks({
  webhookKey: getEnv().DODO_PAYMENTS_WEBHOOK_KEY,
  onPaymentSucceeded: async (payload) => {
    await upsertPaymentRow(payload.data, "PAID");
  },
  onPaymentFailed: async (payload) => {
    await upsertPaymentRow(payload.data, "FAILED");
  },
  onPaymentCancelled: async (payload) => {
    await upsertPaymentRow(payload.data, "FAILED");
  },
});
