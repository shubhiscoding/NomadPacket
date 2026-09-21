import type { NextConfig } from "next";

// Gates every ngrok-specific dev-server relaxation below. Off by default —
// plain `npm run dev` against localhost behaves exactly as it did before
// any of this existed. Set DEV_TUNNEL_ENABLED="true" in .env.local only
// while actively testing through an ngrok tunnel (e.g. to receive Dodo
// Payments webhooks, which can't reach localhost since they're server-to-
// server). Read directly from process.env, not lib/env.ts's getEnv() —
// next.config.ts is evaluated outside the app's own request lifecycle.
const devTunnelEnabled = process.env.DEV_TUNNEL_ENABLED === "true";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly: this repo's parent directory has an
  // unrelated package.json/lockfile from a different project, and without
  // this Turbopack walks up and picks that one up by mistake.
  turbopack: {
    root: __dirname,
  },
  // fill.ts reads the form-fill PDF asset via a runtime-constructed path
  // (path.join(process.cwd(), mapping.formAssetPath)) rather than a
  // statically analyzable literal, so Vercel's build-time file tracer
  // can't detect the dependency and omits the asset from the deployed
  // function — causing an ENOENT in production despite the file existing
  // in the repo.
  //
  // outputFileTracingIncludes keys are picomatch globs, not literal Next
  // route patterns — an earlier attempt keyed this on the literal route
  // "/api/applications/[id]/documents" and silently never matched,
  // because unescaped `[id]` is a picomatch character class (matches one
  // character, "i" or "d"), not the dynamic segment. Next's own bundled
  // docs for this option are inconsistent about whether brackets need
  // escaping, so rather than rely on getting that escaping right, this
  // uses the global "/*" key their own docs recommend for exactly this
  // "small asset needed by a specific function" case (see their
  // sharp/aws-crt example) — the asset is ~100KB, so including it in
  // every server-traced function's bundle is cheap insurance against
  // another silent glob-matching miss.
  outputFileTracingIncludes: {
    "/*": ["./document-engine/form-fill/assets/**"],
  },
  // Next's dev server only allows requests to dev-only assets/HMR from
  // `localhost` (and the hostname it was started with) by default —
  // browsing via an ngrok tunnel serves the SSR HTML fine but silently
  // blocks the JS bundle, so React never hydrates and every button
  // appears dead. Also separately, Next checks Server Action requests
  // against their own allowed-origins list (a CSRF protection) — without
  // it, the Google sign-in button (a Server Action) gets rejected when
  // clicked through the tunnel. Both only apply when DEV_TUNNEL_ENABLED
  // is set; *.ngrok-free.app covers ngrok's free-tier random subdomains,
  // add your paid/custom domain too if you're on a paid ngrok plan.
  ...(devTunnelEnabled
    ? {
        allowedDevOrigins: ["*.ngrok-free.app"],
        experimental: {
          serverActions: {
            allowedOrigins: ["*.ngrok-free.app"],
          },
        },
      }
    : {}),
};

export default nextConfig;
