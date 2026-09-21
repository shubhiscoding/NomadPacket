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

  // Used by lib/gate-context.ts to sign the qualifier-gate cookie — unrelated
  // to the (now dormant) magic-link auth system despite the name.
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters"),

  // Auth.js v5 — Google OAuth only (magic-link is dormant, see
  // auth/legacy-session.ts). Auth.js reads AUTH_SECRET and
  // AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET itself by convention; validated here
  // too so a missing key fails fast at boot with a clear message rather
  // than a confusing runtime error the first time someone tries to sign in.
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),

  // Still used for the packet-ready delivery email (AGENTS.md build order
  // step 9) — only the magic-link SIGN-IN email was dropped for cost
  // reasons, not transactional delivery email generally.
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  DODO_PAYMENTS_API_KEY: z.string().min(1),
  DODO_PAYMENTS_WEBHOOK_KEY: z.string().min(1),
  DODO_PAYMENTS_ENVIRONMENT: z.enum(["test_mode", "live_mode"]).default("test_mode"),
  DODO_PRODUCT_PRICE_CENTS: z.coerce.number().int().nonnegative().default(0),
  DODO_PRODUCT_CURRENCY: z.string().default("USD"),

  // Vercel injects this automatically once a Blob store is attached to the
  // project. Left optional/undefined in local dev and tests, where
  // lib/storage.ts falls back to the local filesystem instead.
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

  // Secures app/api/cron/delete-expired-documents. Optional in the schema
  // so local dev/tests don't need it, but that route fails closed (401s
  // everything) whenever it's unset — never treats "unset" as "unlocked".
  CRON_SECRET: z.string().min(16).optional(),
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
