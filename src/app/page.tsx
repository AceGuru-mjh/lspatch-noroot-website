"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ShieldCheck, Eye, Wrench, ClipboardList, GitCompareArrows, Sparkles, Download, Rocket, Zap } from "lucide-react";
import { getModule, paletteToCssVars } from "@/lib/lsp-modules";
import { PreviewTab } from "@/components/lsp/PreviewTab";
import { IronRules } from "@/components/lsp/IronRules";
import { CodeViewer } from "@/components/lsp/CodeViewer";
import { ChecklistAndBugs } from "@/components/lsp/ChecklistAndBugs";
import { ArchitectureCompare } from "@/components/lsp/ArchitectureCompare";
import { DownloadTab } from "@/components/lsp/DownloadTab";
import { IterationPlan } from "@/components/lsp/IterationPlan";
import { V1013Tab } from "@/components/lsp/V1013Tab";

type TabId = "v1013" | "plan" | "download" | "preview" | "rules" | "code" | "checklist" | "arch";

interface TabDef {
  id: TabId;
  label: string;
  short: string;
  icon: typeof Eye;
}

const TABS: TabDef[] = [
  { id: "v1013", label: "v1.0.13 大完善", short: "v1.0.13", icon: Zap },
  { id: "plan", label: "构建检查 & 迭代计划", short: "迭代", icon: Rocket },
  { id: "download", label: "完整修复包", short: "下载", icon: Download },
  { id: "preview", label: "悬浮球预览", short: "预览", icon: Eye },
  { id: "rules", label: "三大铁律", short: "铁律", icon: ShieldCheck },
  { id: "code", label: "修正源码", short: "源码", icon: Wrench },
  { id: "checklist", label: "检查清单 & 踩坑", short: "清单", icon: ClipboardList },
  { id: "arch", label: "架构对比", short: "架构", icon: GitCompareArrows },
];

export default function Home() {
  const [tab, setTab] = useState<TabId>("v1013");
  // 预览 tab 需要动态配色（跟随激活模块）；其他 tab 用默认 M3 绿
  const previewMod = getModule("adblocker");

  return (
    <div
      className="m3-scope relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-white"
      style={
        tab === "preview"
          ? (paletteToCssVars(previewMod.palette) as React.CSSProperties)
          : (paletteToCssVars(previewMod.palette) as React.CSSProperties)
      }
    >
      {/* 环境光晕背景 */}
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.04), transparent 40%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.03), transparent 40%)",
        }}
      />

      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
            >
              <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-bold tracking-tight">LSPatch NoRoot</div>
              <div className="text-[10px] text-white/45">M3 悬浮球 · 铁律修复 · 构建修复</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge>11 模块</Badge>
            <Badge>3 铁律</Badge>
            <Badge>6 检查项</Badge>
            <a
              href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle"
              target="_blank"
              rel="noopener noreferrer"
              className="m3-state flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>

        {/* Tab 导航栏 */}
        <nav className="mx-auto max-w-7xl px-2 sm:px-6">
          <div className="lsp-scroll flex gap-1 overflow-x-auto border-t border-white/6 pb-1 pt-1">
            {TABS.map((t) => {
              const isActive = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="m3-state relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors"
                  style={{
                    color: isActive ? "var(--m3-primary)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.short}</span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full"
                      style={{ background: "var(--m3-primary)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* 主体 */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "v1013" && <V1013Tab />}
            {tab === "plan" && <IterationPlan />}
            {tab === "download" && <DownloadTab />}
            {tab === "preview" && <PreviewTab />}
            {tab === "rules" && (
              <div>
                <FixHero />
                <IronRules />
              </div>
            )}
            {tab === "code" && (
              <div>
                <FixHero />
                <CodeViewer />
              </div>
            )}
            {tab === "checklist" && (
              <div>
                <FixHero />
                <ChecklistAndBugs />
              </div>
            )}
            {tab === "arch" && (
              <div>
                <FixHero />
                <ArchitectureCompare />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* sticky footer */}
      <footer className="mt-auto border-t border-white/8 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-white/40 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span>LSPatch NoRoot · 三铁律修复 · GitHub Actions 构建修复</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">LSPatch-Noroot-modle (11 模块)</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/AceGuru-mjh"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white/70"
            >
              @AceGuru-mjh
            </a>
            <span>·</span>
            <span>M3 · Next.js 16</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FixHero() {
  return (
    <section className="mb-8 text-center">
      <div
        className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
        style={{
          borderColor: "var(--m3-primary)",
          color: "var(--m3-primary)",
          background: "var(--m3-primary-container)",
        }}
      >
        <Sparkles className="h-3 w-3" />
        GitHub Actions 构建失败修复方案
      </div>
      <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, var(--m3-primary) 120%)" }}
        >
          三大铁律 · IPC 重构 · CI 签名修复
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-pretty text-[12.5px] leading-relaxed text-white/55">
        诊断 11 个模块全部在 <span className="text-white/80">step 8 assembleRelease</span> 失败的根因——签名凭据不匹配。
        并基于三大铁律重构 XposedLoader / Hook / ContentProvider IPC，彻底解决集成模式秒崩与配置失效。
      </p>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
      {children}
    </span>
  );
}
