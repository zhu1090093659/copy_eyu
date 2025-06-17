/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用server功能以确保完全静态
  typescript: {
    // 在构建时忽略类型错误
    ignoreBuildErrors: false,
  },
  eslint: {
    // 在构建时忽略eslint错误
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig