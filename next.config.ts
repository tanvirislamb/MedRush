import type { NextConfig } from "next";

/**
 * The A6 backend issues its auth tokens as `httpOnly` cookies with
 * `sameSite: "lax"`. A cross-site XHR from the browser will NOT carry those
 * cookies, so every call is proxied through this app on the same origin.
 * That keeps the session cookie first-party and removes the need for any
 * CORS juggling or `Authorization` header plumbing on the client.
 */
const apiOrigin = process.env.A6_API_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
