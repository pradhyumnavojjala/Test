// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your other configurations (if any) ...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk's proxy URL
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev', // Clerk's CDN domain
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;