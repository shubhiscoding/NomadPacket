import { WaitlistForm } from "./waitlist-form";

/**
 * Reached only when the qualifier gate determined {country, visaType} is
 * not supported yet (e.g. Temporary Stay in v1). No account, no
 * Application row — just an email capture into the Waitlist table.
 */
export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; visaType?: string }>;
}) {
  const { country = "PT", visaType = "" } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-slate-500">NomadPacket</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        We don&apos;t support this yet
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        NomadPacket currently only covers Portugal&apos;s D8 residence visa.
        Leave your email and we&apos;ll let you know when this option is
        ready.
      </p>

      <WaitlistForm country={country} visaType={visaType} />
    </main>
  );
}
