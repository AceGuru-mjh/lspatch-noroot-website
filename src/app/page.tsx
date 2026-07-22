"use client";

import { useRef } from "react";
import { Github, MousePointerClick, Hand, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useLspStore } from "@/lib/lsp-store";
import { useLogEngine } from "@/lib/use-log-engine";
import { getModule, paletteToCssVars } from "@/lib/lsp-modules";
import { PhoneFrame } from "@/components/lsp/PhoneFrame";
import { HostApp } from "@/components/lsp/HostApp";
import { FloatingBall } from "@/components/lsp/FloatingBall";
import { ControlPanel } from "@/components/lsp/ControlPanel";
import { ModuleRail } from "@/components/lsp/ModuleRail";
import { ArchitectureInfo, FlowDiagram } from "@/components/lsp/ArchitectureInfo";

const SCREEN_W = 360;
const SCREEN_H = 760;

export default function Home() {
  useLogEngine();
  const activeModuleId = useLspStore((s) => s.activeModuleId);
  const mod = getModule(activeModuleId);
  const state = useLspStore((s) => s.modules[activeModuleId]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const ActiveIcon = mod.icon;
  const metricValue = state.metrics[mod.metric.field] ?? 0;
  const displayMetric = mod.metric.isCount
    ? metricValue.toLocaleString()
    : `${mod.metric.prefix ?? ""}${metricValue}${mod.metric.suffix ?? ""}`;

  return (
    <div
      className="m3-scope relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-white"
      style={paletteToCssVars(mod.palette) as React.CSSProperties}
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
      <header className="sticky top-0 z-40 border-b border-white/8 bg-neutral-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
              style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
            >
              <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="text-[14px] font-bold tracking-tight">LSPatch NoRoot</div>
              <div className="text-[10px] text-white/45">毛玻璃悬浮球 · M3 设计预览</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge>11 模块</Badge>
            <Badge>免 Root</Badge>
            <Badge>Material 3</Badge>
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
      </header>

      {/* 主体 */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero */}
        <section className="mb-8 text-center sm:mb-10">
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
            style={{
              borderColor: "var(--m3-primary)",
              color: "var(--m3-primary)",
              background: "var(--m3-primary-container)",
            }}
          >
            <Sparkles className="h-3 w-3" />
            1:1 还原 LSPatch 模块运行场景
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, var(--m3-primary) 120%)" }}
            >
              M3 毛玻璃悬浮球
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-[13px] leading-relaxed text-white/55 sm:text-[14px]">
            基于 AceGuru-mjh/LSPatch-Noroot-modle 11 个免 Root 模块的真实架构，还原
            <span className="text-white/80"> FloatingBallService + PanelActivity</span> 悬浮球交互。
            悬浮球显示模块最小化指标，点击展开毛玻璃面板查看总开关与实时拦截日志。
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <Hint icon={Hand}>拖拽悬浮球移动位置</Hint>
            <Hint icon={MousePointerClick}>点击悬浮球展开面板</Hint>
            <Hint icon={Zap}>左侧切换 11 个模块</Hint>
          </div>
        </section>

        {/* 交互区 */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 左：模块列表 */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <div className="glass-card rounded-3xl p-3 lg:sticky lg:top-20">
              <ModuleRail />
            </div>
          </div>

          {/* 中：手机 */}
          <div className="order-1 flex justify-center overflow-x-auto lg:order-2 lg:col-span-6 lg:overflow-visible">
            <PhoneFrame width={SCREEN_W} height={SCREEN_H}>
              <HostApp />
              {/* 叠加层：悬浮球 + 面板 */}
              <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-20">
                <div className="pointer-events-auto">
                  <FloatingBall containerRef={overlayRef} screenW={SCREEN_W} screenH={SCREEN_H} />
                </div>
                <div className="pointer-events-auto">
                  <ControlPanel />
                </div>
              </div>
            </PhoneFrame>
          </div>

          {/* 右：当前模块详情 */}
          <div className="order-3 lg:col-span-3">
            <div className="flex flex-col gap-3 lg:sticky lg:top-20">
              {/* 活跃模块卡 */}
              <div className="glass-card rounded-3xl p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{ background: "var(--m3-primary)", color: "var(--m3-on-primary)" }}
                  >
                    <ActiveIcon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold">{mod.name}</div>
                    <div className="font-mono text-[9.5px] text-white/45">{mod.pkg}</div>
                  </div>
                </div>
                <p className="mb-3 text-[11.5px] leading-relaxed text-white/55">{mod.desc}</p>

                <div className="grid grid-cols-2 gap-2">
                  <Stat label={mod.metric.label} value={displayMetric} highlight />
                  <Stat label="状态" value={state.enabled ? "运行中" : "已暂停"} />
                  <Stat label="日志" value={String(state.logs.length)} />
                  <Stat label="目标 APP" value={String(mod.targets.length)} />
                </div>
              </div>

              {/* 数据流图 */}
              <FlowDiagram />

              {/* 操作提示 */}
              <div className="glass-card rounded-3xl p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  交互说明
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-white/55">
                  <li className="flex gap-2">
                    <span style={{ color: "var(--m3-primary)" }}>●</span>
                    悬浮球拖拽到屏幕任意位置（模拟 WindowManager 叠加）
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "var(--m3-primary)" }}>●</span>
                    点击悬浮球唤起毛玻璃面板，含总开关与实时日志
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "var(--m3-primary)" }}>●</span>
                    关闭总开关后 Hook 停止，日志停止增长、指标归零
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "var(--m3-primary)" }}>●</span>
                    切换广告拦截时，宿主 APP 内广告位会被实时打上"已拦截"遮罩
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 架构说明 */}
        <section className="mt-10">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">LSPatch 模块架构</h2>
            <p className="mt-1.5 text-[12px] text-white/45">
              从注入原理到悬浮球实现，到双进程 IPC 配置同步
            </p>
          </div>
          <ArchitectureInfo />
        </section>
      </main>

      {/* sticky footer */}
      <footer className="mt-auto border-t border-white/8 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-white/40 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span>LSPatch NoRoot · 毛玻璃悬浮球设计预览</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">对应仓库 LSPatch-Noroot-modle (11 模块)</span>
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

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
      {children}
    </span>
  );
}

function Hint({ icon: Icon, children }: { icon: typeof Hand; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
      <Icon className="h-3 w-3" style={{ color: "var(--m3-primary)" }} />
      {children}
    </span>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border px-2.5 py-2"
      style={{
        background: highlight ? "var(--m3-primary-container)" : "rgba(255,255,255,0.03)",
        borderColor: highlight ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="text-[9px] font-medium uppercase tracking-wide"
        style={{ color: highlight ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div
        className="mt-0.5 text-[14px] font-bold tabular-nums"
        style={{ color: highlight ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.9)" }}
      >
        {value}
      </div>
    </div>
  );
}
