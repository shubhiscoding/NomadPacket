// Re-exported here so seed.ts can import every Portugal/D8 config value
// from one place (country-config/portugal/*), while the actual mapping data
// and the STUB blocker documentation live next to the form-fill engine code
// that consumes them (document-engine/form-fill/), per AGENTS.md's rule
// that field-level mappings are stored per country but the engine that
// applies them stays generic.
export { nationalVisaFormFieldMapping } from "@/document-engine/form-fill/mappings/pt-d8-national-visa-form.mapping";
