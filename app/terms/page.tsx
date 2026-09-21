import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Terms of Service | NomadPacket",
  description: "The terms governing use of NomadPacket's Portugal D8 visa document packet tool.",
  alternates: { canonical: canonicalUrl("/terms") },
};

const LAST_UPDATED = "September 21, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Legal</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-stone-500">Last updated: {LAST_UPDATED}</p>

      <p className="mt-6 text-sm leading-relaxed text-stone-600">
        NomadPacket is operated by Shubh Kesharwani, an individual based in India. This
        business is not currently operated through a separately registered legal entity —
        this section will be updated if and when that changes. By using NomadPacket
        (&quot;the Service&quot;), you agree to these Terms. If you don&apos;t agree, don&apos;t use the
        Service.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">1. What NomadPacket is</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          NomadPacket assembles document packets for Portugal&apos;s D8 digital nomad
          residence visa, based on your questionnaire answers and on publicly available
          Portuguese consulate and AIMA requirements. It generates composed letters, an
          income summary, and a pre-filled copy of the official national visa application
          form, and provides guidance on documents you must source yourself.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          <strong className="text-stone-900">NomadPacket is not a law firm and does not
          provide legal advice.</strong> It cannot guarantee that your visa application will
          be approved — no service can, since that decision rests entirely with the
          reviewing consulate. If your situation involves a criminal record, a prior visa
          refusal, or unusual income sources, consult a licensed immigration lawyer before
          relying on anything this Service generates.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">2. Accuracy of your answers</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Every document NomadPacket generates is built directly from the answers you
          provide. You are solely responsible for the accuracy, truthfulness, and
          completeness of the information you enter, and for reviewing every generated
          document before submitting it to any consulate or authority. Submitting false or
          misleading information to a consulate is your responsibility, not NomadPacket&apos;s,
          and may have serious immigration consequences independent of anything stated here.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">3. Payment and refunds</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          NomadPacket charges a one-time fee to unlock download of your complete document
          packet. Payments are processed by Dodo Payments; NomadPacket does not store your
          full card or payment details. Every generated document can be previewed in full
          before you pay, so you can confirm it&apos;s what you need before purchasing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Because documents are generated and made available for download immediately upon
          payment, <strong className="text-stone-900">purchases are non-refundable once your
          documents have been generated.</strong> If you believe you were charged in error
          (e.g. a duplicate charge or a technical failure that prevented you from receiving
          your documents), contact us and we&apos;ll review it individually.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">4. Ownership of your documents</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The documents generated for your application are yours to use, submit, and modify
          as you see fit. NomadPacket does not claim ownership over the content of your
          generated letters, form, or income summary — they&apos;re composed from your own
          answers and are meant to read as your own words to a consulate.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">5. No guarantee, limitation of liability</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          The Service is provided &quot;as is,&quot; without warranties of any kind. NomadPacket
          does not guarantee that generated documents will be accepted by any consulate,
          that requirements described in the Service are complete or currently accurate for
          your specific case, or that your visa application will succeed. To the fullest
          extent permitted by law, NomadPacket&apos;s total liability to you for any claim
          arising from your use of the Service is limited to the amount you paid for the
          Service.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">6. Account and eligibility</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          You must sign in with a valid Google account to use the Service. You&apos;re
          responsible for keeping that account secure. As of this version, NomadPacket
          supports applicants applying for Portugal&apos;s D8 residence visa from the US, UK,
          or Canada only — other countries and visa types aren&apos;t supported yet.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">7. Changes to these Terms</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          These Terms may be updated as the Service changes. Material changes will update
          the &quot;Last updated&quot; date above. Continuing to use the Service after a change
          means you accept the updated Terms.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">8. Governing law</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          These Terms are governed by the laws of India, without regard to conflict-of-law
          principles, given the Service is currently operated by an individual based in
          India. This may be revisited if the business is later formally incorporated
          elsewhere.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">9. Contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Questions about these Terms can be sent to{" "}
          <a href="mailto:hello@nomadpacket.com" className="text-teal-800 underline">
            hello@nomadpacket.com
          </a>
          .
        </p>
      </section>

      <Disclaimer />
    </main>
  );
}
