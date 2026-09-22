import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { LoginForm } from "./login-form";

/**
 * The magic-link alternative to Google sign-in — linked from /signin.
 * Only reachable with a valid, unexpired gate-context cookie (set by
 * /start via POST /api/qualifier) — auth is structurally unreachable
 * without first passing the qualifier gate, not just discouraged by UI.
 */
export default async function LoginPage() {
  const cookieStore = await cookies();
  const gateContext = verifyGateContextCookieValue(
    cookieStore.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );

  if (!gateContext) {
    redirect("/start");
  }

  return (
    <main className="mx-auto flex flex-1 max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-stone-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        We&apos;ll email you a link — no password needed.
      </p>

      <LoginForm />
    </main>
  );
}
