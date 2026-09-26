"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const PUBLIC_MARKETING_PATHS = [
  "/",
  "/checklist",
  "/tools/income-calculator",
  "/resources/",
  "/us",
  "/uk",
  "/ca",
  "/privacy",
  "/terms",
];

function isPublicMarketingPath(pathname: string): boolean {
  return PUBLIC_MARKETING_PATHS.some((path) =>
    path === "/" ? pathname === path : pathname === path || pathname.startsWith(path),
  );
}

export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();

  if (!pixelId || !isPublicMarketingPath(pathname)) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
 n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
 n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
 t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,
 'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');
 fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* Required by Meta's fallback implementation when JavaScript is disabled. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
