/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'gatway.pinata.cloud',
        },
      ]
    },
  };

export default nextConfig;
