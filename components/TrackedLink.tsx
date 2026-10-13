"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackProductEvent } from "@/components/PostHogAnalytics";

export function TrackedLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackProductEvent(event)}
    >
      {children}
    </Link>
  );
}

/** A native anchor variant for redirecting API routes and external URLs. */
export function TrackedAnchor({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackProductEvent(event)}
    >
      {children}
    </a>
  );
}
