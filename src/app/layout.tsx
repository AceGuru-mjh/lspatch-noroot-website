import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LSPatch NoRoot 模块合集",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Android 8+",
  "description": "11 个免 Root Xposed 模块 · LSPatch 免 Root 注入 · Material 3 毛玻璃悬浮球",
  "version": "1.0.14",
  "author": {
    "@type": "Person",
    "name": "MJH"
  }
};

export const metadata: Metadata = {
  title: "LSPatch NoRoot · 免 Root Xposed 模块合集官网 | v1.0.14",
  description: "11 个免 Root Xposed 模块 · 116 个 Hook · 广告拦截/隐私保护/游戏加速/微信增强 · LSPatch 模块官网 · 三大铁律防秒崩 · Material 3 设计",
  keywords: ["LSPatch", "Xposed", "免Root", "Android模块", "广告拦截", "隐私保护", "AdBlockerX", "MJH"],
  authors: [{ name: "MJH", url: "https://github.com/AceGuru-mjh" }],
  openGraph: {
    title: "LSPatch NoRoot · 免 Root Xposed 模块合集",
    description: "11 模块 · M3 毛玻璃悬浮球 · 三大铁律全量修复",
    url: "https://lspatch-noroot.vercel.app",
    siteName: "LSPatch NoRoot",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "LSPatch NoRoot · 免 Root Xposed 模块合集",
    description: "11 模块 · M3 毛玻璃悬浮球 · 三大铁律全量修复",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
