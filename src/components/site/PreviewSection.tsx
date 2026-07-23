"use client";

import { useRef } from "react";
import { useLspStore } from "@/lib/lsp-store";
import { useLogEngine } from "@/lib/use-log-engine";
import { getModule, paletteToCssVars } from "@/lib/lsp-modules";
import { PhoneFrame } from "@/components/lsp/PhoneFrame";
import { HostApp } from "@/components/lsp/HostApp";
import { FloatingBall } from "@/components/lsp/FloatingBall";
import { ControlPanel } from "@/components/lsp/ControlPanel";
import { ModuleRail } from "@/components/lsp/ModuleRail";
import { Hand, MousePointerClick, Zap } from "lucide-react";

const SCREEN_W = 360;
const SCREEN_H = 760;

export function PreviewSection() {
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
    <section id="preview" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "var(--m3-primary)", color: "var(--m3-primary)", background: "var(--m3-primary-container)" }}
        >
          <Zap className="h-3 w-3" />
          实时交互 Demo
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          M3 毛玻璃悬浮球
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] text-white/55">
          1:1 还原 LSPatch 模块运行场景 · 拖拽悬浮球 / 点击展开面板 / 切换模块
        </p>
      </div>

      <div style={paletteToCssVars(mod.palette) as React.CSSProperties}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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

          {/* 右：详情 */}
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
              <div className="glass-card rounded-3xl p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  交互说明
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-white/55">
                  <li className="flex gap-2">
                    <Hand className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "var(--m3-primary)" }} />
                    拖拽悬浮球移动位置
                  </li>
                  <li className="flex gap-2">
                    <MousePointerClick className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "var(--m3-primary)" }} />
                    点击展开毛玻璃面板
                  </li>
                  <li className="flex gap-2">
                    <Zap className="h-3 w-3 shrink-0 mt-0.5" style={{ color: "var(--m3-primary)" }} />
                    左侧切换 11 个模块
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
