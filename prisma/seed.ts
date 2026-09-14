import { PrismaClient } from "@prisma/client";
import { countryConfigRegistry } from "@/country-config";

const prisma = new PrismaClient();

/**
 * Idempotent: writes (or updates in place) the current (effectiveTo: null)
 * row for every (country, visaType, homeCountry, key, effectiveFrom)
 * combination in the registry. Uses findFirst + create/update rather than
 * `upsert` against the compound unique index — Prisma's generated compound-
 * unique input type doesn't accept a literal `null` for the nullable
 * `homeCountry` column, which every country-wide entry needs.
 */
async function upsertConfig(row: {
  country: string;
  visaType: string;
  homeCountry: string | null;
  key: string;
  effectiveFrom: Date;
  value: object;
  sourceUrl: string;
  sourceNote: string;
}) {
  const existing = await prisma.countryConfig.findFirst({
    where: {
      country: row.country,
      visaType: row.visaType,
      homeCountry: row.homeCountry,
      key: row.key,
      effectiveFrom: row.effectiveFrom,
    },
  });

  if (existing) {
    await prisma.countryConfig.update({
      where: { id: existing.id },
      data: { value: row.value, sourceUrl: row.sourceUrl, sourceNote: row.sourceNote },
    });
  } else {
    await prisma.countryConfig.create({
      data: {
        country: row.country,
        visaType: row.visaType,
        homeCountry: row.homeCountry,
        key: row.key,
        value: row.value,
        effectiveFrom: row.effectiveFrom,
        effectiveTo: null,
        sourceUrl: row.sourceUrl,
        sourceNote: row.sourceNote,
      },
    });
  }
}

async function seed() {
  for (const bundle of countryConfigRegistry) {
    for (const entry of bundle.countryWide) {
      await upsertConfig({
        country: bundle.country,
        visaType: bundle.visaType,
        homeCountry: entry.homeCountry ?? null,
        key: entry.key,
        effectiveFrom: bundle.effectiveFrom,
        value: entry.value as object,
        sourceUrl: entry.sourceUrl,
        sourceNote: entry.sourceNote,
      });
      console.log(`seeded ${bundle.country}/${bundle.visaType}/${entry.key}`);
    }

    for (const entry of bundle.perHomeCountry) {
      await upsertConfig({
        country: bundle.country,
        visaType: bundle.visaType,
        homeCountry: entry.homeCountry,
        key: entry.key,
        effectiveFrom: bundle.effectiveFrom,
        value: entry.value as object,
        sourceUrl: entry.sourceUrl,
        sourceNote: entry.sourceNote,
      });
      console.log(
        `seeded ${bundle.country}/${bundle.visaType}/${entry.homeCountry}/${entry.key}`,
      );
    }
  }
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
