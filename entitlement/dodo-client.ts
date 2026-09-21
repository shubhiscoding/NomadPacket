import DodoPayments from "dodopayments";
import { getEnv } from "@/lib/env";

let cachedClient: DodoPayments | undefined;

/**
 * Single Dodo Payments SDK client, lazily constructed (same reasoning as
 * getEnv() itself being lazy — importing this module shouldn't force full
 * env validation for code paths that never touch payments).
 */
export function getDodoClient(): DodoPayments {
  if (cachedClient) return cachedClient;

  const env = getEnv();
  cachedClient = new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment: env.DODO_PAYMENTS_ENVIRONMENT,
  });
  return cachedClient;
}
