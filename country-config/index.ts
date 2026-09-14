import { portugalD8ResidenceConfig } from "./portugal/d8-residence";

/**
 * Registry of every (country, visaType) config bundle this app knows how to
 * seed. prisma/seed.ts iterates this list. Adding country #2 means adding
 * one entry here pointing at a new bundle file — not touching seed.ts,
 * document-engine, or questionnaire-engine.
 */
export const countryConfigRegistry = [portugalD8ResidenceConfig];
