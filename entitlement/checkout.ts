import { getDodoClient } from "./dodo-client";
import { getEnv } from "@/lib/env";
import type { User } from "@prisma/client";

/**
 * Creates a Dodo Payments checkout session for one application's packet
 * and returns the hosted checkout URL to redirect the user to.
 *
 * Uses the raw `dodopayments` SDK directly rather than the
 * `@dodopayments/nextjs` adapter's `Checkout()` route-handler helper: that
 * helper's config (bearerToken/environment/returnUrl) is fixed once at
 * module load, so it can't vary `return_url` per application — and every
 * checkout here needs to land the user back on THEIR specific
 * application's checklist, not a generic page. `metadata.applicationId` is
 * what the webhook handler (app/api/webhooks/dodo/route.ts) uses to know
 * which Application a given payment belongs to.
 */
export async function createCheckoutUrl(params: {
  applicationId: string;
  user: Pick<User, "email">;
}): Promise<string> {
  const env = getEnv();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const session = await getDodoClient().checkoutSessions.create({
    product_cart: [{ product_id: env.DODO_PRODUCT_ID, quantity: 1 }],
    customer: { email: params.user.email },
    metadata: { applicationId: params.applicationId },
    return_url: `${siteUrl}/application/${params.applicationId}/checklist`,
  });

  if (!session.checkout_url) {
    throw new Error(`Dodo did not return a checkout_url for session ${session.session_id}`);
  }
  return session.checkout_url;
}
