/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s.gravatar.com', 'lh3.googleusercontent.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
