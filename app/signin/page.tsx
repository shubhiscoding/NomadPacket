import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/auth/auth";
import { getCurrentUser } from "@/auth/current-user";
import { GATE_CONTEXT_COOKIE_NAME, verifyGateContextCookieValue } from "@/lib/gate-context";
import { LoginForm } from "@/app/(auth)/login/login-form";

/**
 * The single sign-in entry point — both magic-link (primary, an inline
 * email input + button) and Google (secondary, below an "or" divider).
 * Same gate-enforcement rule as /login: only reachable with a valid,
 * unexpired gate-context cookie, set by /start via POST /api/qualifier.
 * Reuses /login's LoginForm component directly rather than linking out
 * to a separate page — /login itself still works standalone if hit
 * directly, but this page no longer needs to navigate away for it.
 */
export default async function SignInPage() {
  // /api/qualifier always redirects here on a supported selection,
  // whether or not the visitor already has a session — an already
  // signed-in user re-running the /start flow shouldn't see a login
  // screen again just because they went through the gate a second time.
  const existingUser = await getCurrentUser();
  if (existingUser) {
    redirect("/application");
  }

  const cookieStore = await cookies();
  const gateContext = verifyGateContextCookieValue(
    cookieStore.get(GATE_CONTEXT_COOKIE_NAME)?.value,
  );

  if (!gateContext) {
    redirect("/start");
  }

  async function handleGoogleSignIn() {
    "use server";
    await signIn("google", { redirectTo: "/application" });
  }

  return (
    <main className="mx-auto flex flex-1 max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-stone-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Enter your email for a magic sign-in link — no password needed.
      </p>

      <LoginForm showGoogleFallbackLink={false} />

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-stone-400">Or</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <form action={handleGoogleSignIn} className="mt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-300 hover:bg-stone-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.183l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
