import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly: this repo's parent directory has an
  // unrelated package.json/lockfile from a different project, and without
  // this Turbopack walks up and picks that one up by mistake.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
