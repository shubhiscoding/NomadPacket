import { getEnv } from "@/lib/env";

/** Builds an absolute canonical URL from NEXT_PUBLIC_SITE_URL — never hardcode the domain. */
export function canonicalUrl(path: string): string {
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;
  return path === "" ? siteUrl : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
