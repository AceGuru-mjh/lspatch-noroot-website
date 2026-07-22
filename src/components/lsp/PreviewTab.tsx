"use client";

import { useRef } from "react";
import { Github, MousePointerClick, Hand, Sparkles, Zap } from "lucide-react";
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

export function PreviewTab() {
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
    <div style={paletteToCssVars(mod.palette) as React.CSSProperties}>
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
          <div className="glass-card rounded-3xl p-3 lg:sticky lg:top-24">
            <ModuleRail />
          </div>
        </div>

        {/* 中：手机 */}
        <div className="order-1 flex justify-center overflow-x-auto lg:order-2 lg:col-span-6 lg:overflow-visible">
          <PhoneFrame width={SCREEN_W} height={SCREEN_H}>
            <HostApp />
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
          <div className="flex flex-col gap-3 lg:sticky lg:top-24">
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
            <FlowDiagram />
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
                  关闭总开关后 Hook 停止，日志停止增长
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
    </div>
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
