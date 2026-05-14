import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't expose the Next.js version to clients
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Enforce HTTPS for 2 years (enable after confirming SSL is working)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Restrict browser feature access
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Enable DNS prefetching for performance
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Disable buffering for nginx reverse proxy (required for streaming)
          { key: "X-Accel-Buffering", value: "no" },
        ],
      },
    ];
  },
};

export default nextConfig;
