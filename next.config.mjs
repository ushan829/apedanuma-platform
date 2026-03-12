/** @type {import('next').NextConfig} */

// ── Startup environment validation ────────────────────────────────────────────
// Fail immediately at build/boot time rather than crashing at runtime when a
// user actually triggers an auth or DB operation.
if (!process.env.JWT_SECRET) {
  throw new Error(
    "🔴 CRITICAL: JWT_SECRET environment variable is missing. The application cannot start securely."
  );
}
if (!process.env.MONGODB_URI) {
  throw new Error(
    "🔴 CRITICAL: MONGODB_URI environment variable is missing."
  );
}
const expiresIn = process.env.JWT_EXPIRES_IN;
if (expiresIn && !/^\d+[smhd]$/.test(expiresIn)) {
  throw new Error(
    "🔴 CRITICAL: JWT_EXPIRES_IN must be a valid time string format (e.g., '7d', '24h', '60m'). Invalid format detected."
  );
}
// ──────────────────────────────────────────────────────────────────────────────

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-da18c23497c24c50af79b1123d44473d.r2.dev",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
