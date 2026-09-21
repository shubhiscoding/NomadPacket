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
  // in the repo. Force-include it explicitly for the route that reaches
  // fillForm (app/api/applications/[id]/documents/route.ts).
  outputFileTracingIncludes: {
    "/api/applications/[id]/documents": ["./document-engine/form-fill/assets/**"],
  },
};

export default nextConfig;
