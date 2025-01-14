/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/democonvegno25',
  assetPrefix: '/democonvegno25/',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig