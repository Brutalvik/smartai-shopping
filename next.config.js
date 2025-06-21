/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["xyvo-product-images.s3.us-east-2.amazonaws.com"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_API}/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
