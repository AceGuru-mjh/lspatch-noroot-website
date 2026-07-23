import type { NextConfig } from "next";

const isGhPages = process.env.BUILD_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  // GitHub Pages 静态导出 / 否则 standalone（Vercel/Docker）
  output: isGhPages ? "export" : "standalone",
  // GitHub Pages 子路径（lspatch-noroot-website）
  basePath: isGhPages ? process.env.NEXT_PUBLIC_BASE_PATH || "" : "",
  assetPrefix: isGhPages ? (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/" : undefined,
  // 静态导出时图片优化关闭
  images: isGhPages ? { unoptimized: true } : undefined,
  // 开发环境忽略 TS 错误（用 eslint 把关）
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // 静态导出 trailingSlash
  trailingSlash: isGhPages,
};

export default nextConfig;
