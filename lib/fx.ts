/**
 * Live exchange rates via Frankfurter (https://frankfurter.dev/) — a free,
 * no-API-key-required currency data API backed by the European Central
 * Bank's daily reference rates. Needed because the questionnaire collects
 * income in the applicant's own currency (USD/GBP/CAD/EUR), but the D8
 * income threshold is denominated in EUR — comparing face-value numbers
 * across currencies without conversion would silently misreport
 * eligibility for every non-EUR applicant.
 *
 * Cached in-memory with a short TTL: ECB rates update once per business
 * day, so refetching on every request is wasteful, but a long-lived cache
 * would go stale across a long-running server process.
 */

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const rateCache = new Map<string, { rate: number; fetchedAt: number }>();

/** Returns how many EUR one unit of `currency` is worth. EUR itself is always 1. */
export async function getExchangeRateToEur(currency: string): Promise<number> {
  if (currency === "EUR") return 1;

  const cached = rateCache.get(currency);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rate;
  }

  const url = `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(currency)}&symbols=EUR`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Frankfurter FX lookup failed for ${currency}->EUR: ${res.status}`);
  }
  const data = (await res.json()) as { rates: Record<string, number> };
  const rate = data.rates.EUR;
  if (typeof rate !== "number") {
    throw new Error(`Frankfurter FX lookup returned no EUR rate for ${currency}`);
  }

  rateCache.set(currency, { rate, fetchedAt: Date.now() });
  return rate;
}

export async function convertToEur(amount: number, currency: string): Promise<number> {
  const rate = await getExchangeRateToEur(currency);
  return amount * rate;
}

/** Test-only: clears the in-memory cache between test cases. */
export function __clearFxCacheForTests(): void {
  rateCache.clear();
}
