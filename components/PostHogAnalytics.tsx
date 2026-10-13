"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

/**
 * Sends coarse page categories only. Never forwards raw URLs, query strings,
 * form fields, application IDs, or document content to analytics.
 */
function getPageCategory(pathname: string): string | null {
  if (pathname === "/") return "landing";
  if (pathname === "/start") return "qualifier";
  if (pathname === "/signin") return "sign_in";
  if (pathname === "/checklist") return "requirements";
  if (pathname === "/tools/income-calculator") return "income_calculator";
  if (["/us", "/uk", "/ca"].includes(pathname)) return "country_guide";
  if (pathname.startsWith("/resources/")) return "resource";
  if (/^\/application\/[^/]+\/questionnaire$/.test(pathname)) return "questionnaire";
  if (/^\/application\/[^/]+\/checklist$/.test(pathname)) return "application_checklist";
  return null;
}

export function trackProductEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function PostHogAnalytics({
  apiKey,
  apiHost,
}: {
  apiKey?: string;
  apiHost?: string;
}) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!apiKey || initialized.current) return;
    initialized.current = true;
    posthog.init(apiKey, {
      api_host: apiHost || "https://us.i.posthog.com",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      persistence: "memory",
      person_profiles: "never",
      ip: false,
      save_campaign_params: false,
      save_referrer: false,
      get_current_url: () => {
        const category = getPageCategory(window.location.pathname) ?? "other";
        return `${window.location.origin}/analytics/${category}`;
      },
      // Session replay with PII masking — redact all form inputs containing
      // visa/income/personal information. maskAllInputs covers email, password,
      // text inputs, textareas, and select dropdowns by default.
      session_recording: {
        recordCrossOriginIframes: false,
        maskAllInputs: true, // Redacts email, password, tel, text, textarea, select
      },
    });
  }, [apiHost, apiKey]);

  useEffect(() => {
    if (!apiKey || !initialized.current) return;
    const category = getPageCategory(pathname);
    if (!category) return;

    // Stable, sanitized URLs make PostHog's built-in pageview reports useful
    // without transmitting route IDs or query parameters.
    const safePath = `/analytics/${category}`;
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${safePath}`,
      $pathname: safePath,
      page_category: category,
    });
  }, [apiKey, pathname]);

  return null;
}
