import { z } from "zod";

/**
 * Single source of truth for validated environment variables.
 *
 * AGENTS.md §4: "No secrets in code — all API keys via env vars; keep
 * .env.example current." Every var read anywhere in the app should come
 * through this module, not `process.env` directly, so a missing/malformed
 * env var fails fast at boot instead of surfacing as a confusing runtime bug
 * deep in an API route.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),

  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters"),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  DODO_PAYMENTS_API_KEY: z.string().min(1),
  DODO_PAYMENTS_WEBHOOK_KEY: z.string().min(1),
  DODO_PAYMENTS_ENVIRONMENT: z.enum(["test_mode", "live_mode"]).default("test_mode"),
  DODO_PRODUCT_PRICE_CENTS: z.coerce.number().int().nonnegative().default(0),
  DODO_PRODUCT_CURRENCY: z.string().default("USD"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

/**
 * Lazily validates and caches process.env against envSchema. Lazy (not
 * top-level) so importing this module doesn't crash tooling (e.g. `next
 * lint`, unit tests that mock a subset of vars) that never actually calls
 * getEnv().
 */
export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration. Check .env.local against .env.example:\n${issues}`,
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
