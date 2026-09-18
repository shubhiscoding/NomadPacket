/**
 * "Check your email" state shown right after requesting a magic link.
 * The actual verification happens when the user clicks the emailed link,
 * which hits GET /api/auth/verify — this page never verifies anything
 * itself.
 */
export default async function VerifyPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="mx-auto flex flex-1 max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-stone-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">Check your email</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        We sent a sign-in link{email ? ` to ${email}` : ""}. Click it to continue —
        it expires in 15 minutes.
      </p>
    </main>
  );
}
