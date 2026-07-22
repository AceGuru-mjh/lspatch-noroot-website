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
  title: "LSPatch NoRoot · M3 毛玻璃悬浮球设计预览",
  description: "1:1 还原 LSPatch 免 Root 模块的毛玻璃悬浮球与展开面板交互，11 个模块、总开关与实时拦截日志。",
  keywords: ["LSPatch", "LSPosed", "Xposed", "免Root", "悬浮球", "毛玻璃", "Material 3", "Next.js"],
  authors: [{ name: "AceGuru-mjh" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "LSPatch NoRoot · M3 毛玻璃悬浮球",
    description: "免 Root Xposed 模块悬浮球交互预览",
    type: "website",
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
