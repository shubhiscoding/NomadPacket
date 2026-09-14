import type { NifBranchInstructions } from "../types";

/**
 * NIF (Portuguese tax number) guidance — Bucket 3. Not scoped by home
 * country: US, UK, and Canada are all non-EU for this purpose, so the same
 * guidance applies to all three (stored as a country-wide CountryConfig row,
 * homeCountry: null).
 *
 * Source: Product Spec (v1).md §2 ("Explain what it is, that non-EU
 * applicants typically need a fiscal representative in Portugal to obtain
 * one before arrival, and give 2-3 concrete routes"), verified 2026-09-14.
 */
export const nifInstructions: NifBranchInstructions = {
  explanation:
    "The NIF (Número de Identificação Fiscal) is Portugal's tax identification " +
    "number. You need one to open a Portuguese bank account, sign a rental " +
    "agreement, and complete many other steps of the D8 process — most " +
    "applicants get one before their consulate appointment.",
  needsFiscalRepresentative: true,
  routes: [
    "Use a remote NIF service (several companies specialize in obtaining a NIF " +
      "for non-residents entirely online, acting as your fiscal representative).",
    "Engage a Portuguese accountant (contabilista) or lawyer who can act as " +
      "your fiscal representative and obtain the NIF on your behalf.",
    "If you're already in Portugal, visit a local Finanças (tax office) in " +
      "person — but as a non-EU/EEA resident you'll still generally need a " +
      "fiscal representative appointed at that time.",
  ],
};
