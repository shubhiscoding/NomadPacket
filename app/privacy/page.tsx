import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/lib/seo";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Privacy Policy | NomadPacket",
  description: "How NomadPacket collects, uses, and stores your data.",
  alternates: { canonical: canonicalUrl("/privacy") },
};

const LAST_UPDATED = "September 21, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Legal</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {LAST_UPDATED}</p>

      <p className="mt-6 text-sm leading-relaxed text-stone-600">
        NomadPacket is operated by Shubh Kesharwani, an individual based in India (see the{" "}
        <Link href="/terms" className="text-teal-800 underline">
          Terms of Service
        </Link>{" "}
        for details on the operating entity). This policy explains what data NomadPacket
        collects, why, and who it&apos;s shared with. The short version: this product
        handles your financial and immigration paperwork, so data is treated as sensitive
        by default, shared with as few third parties as the Service requires to function,
        and never sold.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">1. What we collect</h2>
        <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-stone-600">
          <li>
            <strong className="text-stone-900">Account information:</strong> your email
            address, obtained via Google sign-in. NomadPacket does not see or store your
            Google password.
          </li>
          <li>
            <strong className="text-stone-900">Questionnaire answers:</strong> everything
            you enter to generate your packet — name, nationality, employment and income
            details, family/dependents information, accommodation and travel plans, and
            similar details required to prepare your D8 visa documents.
          </li>
          <li>
            <strong className="text-stone-900">Generated documents:</strong> the letters,
            income summary, and pre-filled visa form NomadPacket produces from your
            answers.
          </li>
          <li>
            <strong className="text-stone-900">Payment records:</strong> that a payment was
            made, its status, and a reference id from our payment processor. NomadPacket
            does not receive or store your full card number — that&apos;s handled entirely
            by our payment processor, Dodo Payments.
          </li>
          <li>
            <strong className="text-stone-900">Basic usage analytics:</strong> page views
            and navigation, via Vercel Analytics. This tracks that pages were visited, not
            the content of anything you type or any generated document.
          </li>
          <li>
            <strong className="text-stone-900">Marketing analytics:</strong> on public
            marketing and resource pages only, Meta Pixel may collect page-view and
            advertising-measurement data if enabled in the deployment configuration. It is
            not loaded on authenticated questionnaire or application pages and is not sent
            your questionnaire answers or generated document content.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">2. Why we collect it</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Solely to run the Service: to generate your documents accurately, to let you sign
          in and return to an in-progress application, to process payment for your packet,
          and to send you the transactional emails the Service depends on (e.g. letting you
          know your packet is ready). We don&apos;t use your questionnaire answers or
          generated document content for advertising, and we don&apos;t run third-party
          analytics or ad-tracking scripts against document content.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">3. Who we share it with</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          NomadPacket relies on a small number of service providers to operate, each
          receiving only what they need to do their specific job:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-stone-600">
          <li>
            <strong className="text-stone-900">Google</strong> — authentication (sign-in
            only; NomadPacket only receives your email address from Google, nothing else).
          </li>
          <li>
            <strong className="text-stone-900">Dodo Payments</strong> — payment processing.
          </li>
          <li>
            <strong className="text-stone-900">Resend</strong> — sending transactional
            emails (e.g. packet-ready notifications).
          </li>
          <li>
            <strong className="text-stone-900">Vercel</strong> — application hosting,
            database hosting, file storage for your generated documents, and basic
            navigation analytics.
          </li>
          <li>
            <strong className="text-stone-900">Meta</strong> — marketing measurement on
            selected public pages, only when the optional Meta Pixel is enabled.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          We do not sell your data, and we do not share your questionnaire answers or
          generated documents with Meta or any party beyond what&apos;s listed above.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">4. How long we keep it</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          <strong className="text-stone-900">Generated documents</strong> (your letters,
          income summary, and pre-filled form) are automatically deleted 30 days after
          generation. Re-generating your packet resets that window.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong className="text-stone-900">
            [RETENTION PERIOD FOR ACCOUNT AND QUESTIONNAIRE-ANSWER DATA — TO BE FINALIZED]
          </strong>{" "}
          — how long we retain your account, questionnaire answers, and payment records
          after your application is complete is still being finalized. This section will
          be updated with a specific policy before this is treated as final; until then,
          contact us using the details below if you&apos;d like your data deleted sooner.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">5. Security</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Your questionnaire answers and generated documents are stored in access-controlled
          infrastructure — the underlying database and document storage are not publicly
          accessible, and generated documents specifically are stored privately and only
          ever served through an authenticated, entitlement-checked request. We rely on our
          infrastructure providers&apos; own encryption and security practices; no method of
          storage or transmission is perfectly secure, and we can&apos;t guarantee absolute
          security.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">6. Your choices</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          You can request a copy of your data, ask us to correct it, or ask us to delete
          your account and associated data, by emailing us at the address below. We&apos;ll
          respond and act on reasonable requests promptly.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">7. Changes to this policy</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          This policy may be updated as the Service changes. Material changes will update
          the &quot;Last updated&quot; date above.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">8. Contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Questions about this policy, or requests regarding your data, can be sent to{" "}
          <a href="mailto:hello@nomadpacket.app" className="text-teal-800 underline">
            hello@nomadpacket.app
          </a>
          .
        </p>
      </section>

      <Disclaimer />
    </main>
  );
}
