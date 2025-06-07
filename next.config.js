/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // requests to /api/... will go to Fastify
        destination: "http://localhost:5000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;


