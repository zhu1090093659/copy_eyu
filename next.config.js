/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 注释掉静态导出配置，因为应用使用了API路由
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig