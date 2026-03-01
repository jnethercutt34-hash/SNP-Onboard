import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep heavy file-parsing libs out of the webpack bundle — loaded natively by Node.js
  serverExternalPackages: ["pdf-parse", "mammoth", "xlsx"],
};

export default nextConfig;
