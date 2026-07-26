const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Client components (RegistrationForm, LoginForm) call /api/v1/... as a
    // bare relative path. Proxy it to the backend so that resolves in any
    // real deployment, and so the browser only ever talks to this origin
    // (no CORS needed). Server-side code still uses BACKEND_URL directly
    // (see frontend/lib/session.ts) since rewrites only apply to incoming
    // requests, not outgoing server-side fetches.
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
