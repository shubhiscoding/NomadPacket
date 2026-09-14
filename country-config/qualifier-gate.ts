import type { QualifierGateEntry } from "./types";

/**
 * The qualifier gate is the first screen a visitor sees, before any account
 * exists. It decides whether {country, visaType} routes into the real
 * product or into the waitlist. This MUST stay a config lookup, never a
 * hardcoded if/else in a route or component — adding a supported
 * country/visaType later (or temporarily disabling one) is a one-line
 * change here, nothing else.
 *
 * v1 scope (AGENTS.md §1): Portugal, D8 residence visa only. Temporary-stay
 * is deliberately listed as unsupported rather than omitted, so the gate
 * config is the explicit record of what's turned on/off — not an absence.
 */
export const qualifierGateConfig: QualifierGateEntry[] = [
  { country: "PT", visaType: "D8_RESIDENCE", supported: true },
  { country: "PT", visaType: "D8_TEMPORARY", supported: false },
];

export function isSupported(
  country: string,
  visaType: string,
  config: QualifierGateEntry[] = qualifierGateConfig,
): boolean {
  const entry = config.find((e) => e.country === country && e.visaType === visaType);
  return entry?.supported ?? false;
}

/** Options surfaced on the /start screen. Labels are UI copy, not legal text. */
export const qualifierGateOptions: Array<{
  country: string;
  visaType: string;
  label: string;
}> = [
  { country: "PT", visaType: "D8_RESIDENCE", label: "Residence Visa" },
  { country: "PT", visaType: "D8_TEMPORARY", label: "Temporary Stay" },
];
