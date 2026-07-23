"use client";

import { Github, Download, Rocket, RefreshCw } from "lucide-react";
import { getModule, paletteToCssVars } from "@/lib/lsp-modules";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { ModuleShowcase } from "@/components/site/ModuleShowcase";
import { PreviewSection } from "@/components/site/PreviewSection";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { FAQ } from "@/components/site/FAQ";
import { SiteFooter } from "@/components/site/SiteFooter";
import { IronRules } from "@/components/lsp/IronRules";
import { V1013Tab } from "@/components/lsp/V1013Tab";
import { DownloadTab } from "@/components/lsp/DownloadTab";
import { IterationPlan } from "@/components/lsp/IterationPlan";
import { RepoFixTab } from "@/components/lsp/RepoFixTab";

export default function Home() {
  const previewMod = getModule("adblocker");

  return (
    <div
      className="m3-scope relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-white"
      style={paletteToCssVars(previewMod.palette) as React.CSSProperties}
    >
      {/* 全局背景 */}
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.04), transparent 40%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.03), transparent 40%)",
        }}
      />

      <SiteHeader />

      <main className="flex-1">
        {/* 首屏 Hero */}
        <Hero />

        {/* 核心特性 */}
        <Features />

        {/* 模块市场 */}
        <ModuleShowcase />

        {/* 三大铁律 */}
        <SectionWrapper
          id="rules"
          badge="架构铁律"
          badgeColor="#FF6B6B"
          title="三大铁律"
          subtitle="LSPatch 集成模式下，违反任一铁律都会导致类加载阶段秒崩——还没到 handleLoadPackage 就 NoClassDefFoundError"
        >
          <IronRules />
        </SectionWrapper>

        {/* 悬浮球 Demo */}
        <PreviewSection />

        {/* v1.0.14 修复看板 */}
        <SectionWrapper
          id="v1013"
          badge="v1.0.14 大完善"
          badgeColor="#FFD87A"
          title="完整修复进度看板"
          subtitle="三大铁律 + IPC + 版本号 + permission 一次修完，86 文件 2294 行 patch，0 残留问题"
        >
          <V1013Tab />
        </SectionWrapper>

        {/* 仓库乱码修复 */}
        <SectionWrapper
          id="repofix"
          badge="仓库修复"
          badgeColor="#6DBA95"
          title="4 仓库乱码全面修复"
          subtitle="GBK/UTF-16/混合编码全修复 + 4 个 README 重写 + healthcheck.py 编码修复 · 已推送 GitHub"
        >
          <RepoFixTab />
        </SectionWrapper>

        {/* 下载中心 */}
        <SectionWrapper
          id="download"
          badge="下载中心"
          badgeColor="#6DBA95"
          title="下载修复包 & APK"
          subtitle="v1.0.14 修复包 · 11 模块 APK · GitHub Releases"
        >
          <DownloadTab />
        </SectionWrapper>

        {/* 迭代路线 */}
        <SectionWrapper
          id="roadmap"
          badge="迭代路线"
          badgeColor="#7DD3FC"
          title="v1.0.14 → v1.2.0 路线图"
          subtitle="从铁律修复到 M3 悬浮球升级，6 个版本的完整迭代计划"
        >
          <IterationPlan />
        </SectionWrapper>

        {/* FAQ */}
        <FAQ />
      </main>

      <SiteFooter />
    </div>
  );
}
