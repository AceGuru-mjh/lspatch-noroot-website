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

export const metadata: Metadata = {
  title: "LSPatch NoRoot · 免 Root Xposed 模块合集官网",
  description: "11 个免 Root Xposed 模块 · Material 3 毛玻璃悬浮球 · 三大铁律全量修复 · 广告拦截/隐私保护/游戏加速/微信增强",
  keywords: ["LSPatch", "LSPosed", "Xposed", "免Root", "悬浮球", "毛玻璃", "Material 3", "广告拦截", "隐私保护", "游戏加速"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
