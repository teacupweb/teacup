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
    // Determine backend root (e.g. http://localhost:8000)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:8000/api/v1';
    const backendRoot = backendUrl.split('/api')[0];
    
    return [
      {
        source: '/api/auth/:path*',
        destination: `${backendRoot}/api/auth/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${backendRoot}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
