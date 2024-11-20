/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.com', 'replicate.delivery'], // 允许来自 Replicate 的图片
  },
  env: {
    NEXT_PUBLIC_REPLICATE_API_TOKEN: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
  },
};

module.exports = nextConfig; 