import type { NextConfig } from "next";

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
};

export default nextConfig;
