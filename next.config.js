/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        // destination: `http://localhost:8000/api/auth/:path*`,
        destination: `https://backend.teacup.website/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
