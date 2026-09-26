import type { Metadata } from "next";
import { getNifInstructions } from "@/lib/marketing-content-data";
import { canonicalUrl } from "@/lib/seo";
import { MarketingCta } from "@/components/MarketingCta";
import { Disclaimer } from "@/components/Disclaimer";
import { Faq } from "@/components/Faq";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "NIF Number Portugal: Guide for Non-Residents",
  description:
    "What a Portuguese NIF is, why D8 visa applicants need one before arrival, and three " +
    "concrete ways for US, UK, and Canadian non-residents to get one remotely.",
  alternates: { canonical: canonicalUrl("/resources/nif-guide") },
  openGraph: {
    title: "NIF Number Portugal: Complete Guide for Non-Residents",
    description:
      "Why you need a NIF, why you need a fiscal representative, and how to get " +
      "one before you land in Portugal.",
    url: canonicalUrl("/resources/nif-guide"),
    type: "article",
  },
};

export default async function NifGuidePage() {
  const nif = await getNifInstructions();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium text-teal-800">Portugal for Non-Residents</p>
      <h1 className="mt-2 text-3xl font-medium text-stone-900">
        NIF Number Portugal: A Complete Guide for Non-Residents
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        If you&apos;re applying for a D8 visa — or doing almost anything else official
        in Portugal — you&apos;ll run into the NIF within your first few steps. It&apos;s
        one of the most confusing parts of the process precisely because it&apos;s so
        foundational: you often need one before you can do the thing that would normally
        let you get one.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">What is a NIF?</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {nif?.explanation ??
            "The NIF (Número de Identificação Fiscal) is Portugal's tax identification number."}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          It&apos;s a nine-digit number, and it&apos;s not optional — you&apos;ll be asked
          for it far more often than you&apos;d expect for a &quot;tax&quot; number: opening a bank
          account, signing a rental lease, getting a phone contract, and yes, as part of
          your D8 visa and later residence-permit paperwork.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">
          Why non-residents need a fiscal representative
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Here&apos;s the part that trips people up: if you&apos;re not an EU/EEA resident
          (which, as a US, UK, or Canadian applicant, you aren&apos;t), Portuguese tax law
          generally requires you to appoint a fiscal representative — a person or company
          based in Portugal who acts as your point of contact with the Portuguese tax
          authority — before you can be issued a NIF. You don&apos;t need to be physically
          in Portugal to do this, which is the useful part: all three routes below can be
          completed remotely, before you ever board a flight.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Three ways to get a NIF remotely</h2>
        <ol className="mt-3 flex flex-col gap-4 text-sm leading-relaxed text-stone-600">
          {(nif?.routes ?? [
            "Use a remote NIF service that specializes in obtaining a NIF for non-residents online.",
            "Engage a Portuguese accountant or lawyer who can act as your fiscal representative.",
            "Visit a local Finanças (tax office) in person if you're already in Portugal.",
          ]).map((route, i) => (
            <li key={route} className="list-decimal pl-1">
              <strong className="text-stone-900">Option {i + 1}: </strong>
              {route}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          For most D8 applicants still in the US, UK, or Canada, a remote NIF service is
          the simplest option — it&apos;s specifically built for this situation, whereas an
          accountant or lawyer is more useful if you&apos;re already working with one for other
          reasons (setting up as a freelancer under Portuguese tax law, for instance).
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">When to get your NIF</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Get it before your consulate appointment, not after. While the NIF itself isn&apos;t
          always a mandatory line item on the D8 visa document checklist at every consulate,
          you&apos;ll need it almost immediately afterward — for the Portuguese bank account
          many consulates want proof of, and for signing a rental agreement — so applicants
          who wait until they land in Portugal end up blocked on multiple fronts at once.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-stone-900">Frequently asked questions</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                question: "Is a NIF the same as a Social Security number?",
                answer:
                  "No — a NIF is a tax identification number, separate from Portugal's social security number (NISS), which you'll need later once you're working or registered as self-employed in Portugal.",
              },
              {
                question: "How much does it cost to get a NIF remotely?",
                answer:
                  "Remote NIF services typically charge a flat fee (commonly in the €60-€150 range, though this varies by provider and whether ongoing fiscal representation is included) — compare a few before choosing, since pricing and included services differ.",
              },
              {
                question: "Can I get a NIF myself without a fiscal representative?",
                answer:
                  "Non-EU/EEA residents generally cannot obtain a NIF without one — this is the specific rule that makes remote NIF services or an accountant/lawyer necessary rather than optional for most D8 applicants.",
              },
            ]}
          />
        </div>
      </section>

      <MarketingCta />
      <Disclaimer />
    </main>
  );
}
