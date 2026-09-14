/**
 * Simple {{placeholder}} substitution over an ordered array of paragraph
 * strings. Deliberately not a templating library — the substitution need
 * here is trivial (flat key → string), and keeping it dependency-free means
 * this function is independently unit-testable with zero React/PDF
 * involvement, per AGENTS.md's tests-first rule for document-engine.
 */
export function renderTemplate(
  paragraphs: string[],
  data: Record<string, string>,
): string[] {
  return paragraphs.map((paragraph) =>
    paragraph.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => data[key] ?? ""),
  );
}
