/**
 * The Product Spec (v1).md §5 disclaimer, factored out so every marketing/
 * resource page carries the same not-legal-advice language as the
 * checklist screen — required reading for any "Your Money or Your Life"
 * topic per Google's E-E-A-T guidance (seo.md §3), and just the right
 * thing to do for a product handling people's immigration paperwork.
 */
export function Disclaimer() {
  return (
    <p className="mt-10 text-xs leading-relaxed text-stone-400">
      This tool assembles documents based on publicly available Portuguese consulate and
      AIMA requirements. It does not provide legal advice and cannot guarantee visa
      approval — no service can. Requirements vary by consulate and may change; always
      confirm current requirements with your nearest Portuguese consulate or an
      immigration lawyer, particularly if your situation involves a criminal record, prior
      visa refusals, or unusual income sources.
    </p>
  );
}
