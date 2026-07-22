"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Info,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Power,
  Activity,
} from "lucide-react";
import { useLspStore } from "@/lib/lsp-store";
import { getModule, type LogLevel } from "@/lib/lsp-modules";

function fmtTime(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

const LEVEL_CFG: Record<LogLevel, { icon: typeof Shield; color: string; label: string }> = {
  block: { icon: Shield, color: "var(--m3-primary)", label: "拦截" },
  info: { icon: Info, color: "#7DD3FC", label: "信息" },
  success: { icon: CheckCircle2, color: "#86EFAC", label: "成功" },
  warn: { icon: AlertTriangle, color: "#FCD34D", label: "警告" },
};

export function ControlPanel() {
  const { panelOpen, setPanel, activeModuleId, modules, toggleMaster, clearLogs } = useLspStore();
  const mod = getModule(activeModuleId);
  const state = modules[activeModuleId];
  const Icon = mod.icon;

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="absolute inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPanel(false)}
          />

          {/* 毛玻璃面板 — M3 底部 sheet */}
          <motion.div
            className="glass-panel absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[28px]"
            style={{ height: "72%" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
          >
            {/* 拖拽指示条 */}
            <div className="flex justify-center pt-2.5">
              <div className="h-1 w-10 rounded-full bg-white/25" />
            </div>

            {/* 头部 */}
            <div className="flex items-center gap-3 px-4 pb-3 pt-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold text-white">{mod.name}</span>
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/60">
                    {mod.nameEn}
                  </span>
                </div>
                <span className="text-[10.5px] text-white/50">{mod.desc}</span>
              </div>
              <button
                onClick={() => setPanel(false)}
                className="m3-state flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70"
                aria-label="关闭面板"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 总开关区 */}
            <div className="mx-4 mb-2 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      background: state.enabled ? "var(--m3-primary)" : "rgba(255,255,255,0.08)",
                      color: state.enabled ? "var(--m3-on-primary)" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <Power className="h-4 w-4" strokeWidth={2.4} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">总开关</div>
                    <div className="text-[10px]" style={{ color: state.enabled ? "var(--m3-primary)" : "rgba(255,255,255,0.45)" }}>
                      {state.enabled ? "模块运行中 · Hook 已生效" : "已关闭 · 模块未注入"}
                    </div>
                  </div>
                </div>
                <M3Switch checked={state.enabled} onChange={() => toggleMaster(mod.id)} />
              </div>

              {/* 指标摘要 */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Metric
                  label={mod.metric.label}
                  value={
                    mod.metric.isCount
                      ? (state.metrics[mod.metric.field] ?? 0).toLocaleString()
                      : `${mod.metric.prefix ?? ""}${state.metrics[mod.metric.field] ?? 0}${mod.metric.suffix ?? ""}`
                  }
                  highlight
                />
                <Metric label="日志条数" value={String(state.logs.length)} />
                <Metric label="目标" value={String(mod.targets.length)} suffix=" 个" />
              </div>
            </div>

            {/* 日志区头部 */}
            <div className="flex items-center justify-between px-4 pb-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" style={{ color: "var(--m3-primary)" }} />
                <span className="text-[12px] font-semibold text-white/85">实时日志</span>
                {state.enabled && (
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--m3-primary)" }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                )}
              </div>
              <button
                onClick={() => clearLogs(mod.id)}
                className="m3-state flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/55"
              >
                <Trash2 className="h-3 w-3" />
                清空
              </button>
            </div>

            {/* 日志列表 */}
            <div className="lsp-scroll flex-1 overflow-y-auto px-4 pb-5">
              {state.logs.length === 0 ? (
                <div className="flex h-24 flex-col items-center justify-center gap-1.5 text-white/40">
                  <Info className="h-5 w-5" />
                  <span className="text-[11px]">
                    {state.enabled ? "等待 Hook 事件…" : "模块已暂停，无新日志"}
                  </span>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {state.logs.map((log) => {
                    const cfg = LEVEL_CFG[log.level];
                    const LIcon = cfg.icon;
                    return (
                      <li
                        key={log.id}
                        className="animate-log-in flex items-start gap-2.5 rounded-xl border border-white/6 bg-white/4 px-2.5 py-2"
                      >
                        <div
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                          style={{ background: `${cfg.color}1f`, color: cfg.color }}
                        >
                          <LIcon className="h-3 w-3" strokeWidth={2.4} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-[11.5px] font-medium text-white/90">
                              {log.message}
                            </span>
                            <span className="shrink-0 font-mono text-[9px] text-white/35">
                              {fmtTime(log.ts)}
                            </span>
                          </div>
                          {log.target && (
                            <div className="mt-0.5 truncate font-mono text-[9.5px] text-white/40">
                              {log.target}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* 目标 APP 底栏 */}
            <div className="border-t border-white/8 bg-black/20 px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-[9.5px] text-white/45">
                <span>注入目标：</span>
                {mod.targets.map((t) => (
                  <span key={t} className="rounded-full bg-white/8 px-1.5 py-0.5 text-white/65">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Metric({ label, value, suffix, highlight }: { label: string; value: string; suffix?: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border px-2.5 py-2"
      style={{
        background: highlight ? "var(--m3-primary-container)" : "rgba(255,255,255,0.03)",
        borderColor: highlight ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-[9px] font-medium uppercase tracking-wide" style={{ color: highlight ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.45)" }}>
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-bold tabular-nums" style={{ color: highlight ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.9)" }}>
        {value}
        {suffix && <span className="ml-0.5 text-[10px] font-normal opacity-70">{suffix}</span>}
      </div>
    </div>
  );
}

/** M3 风格开关 */
function M3Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors duration-200"
      style={{
        background: checked ? "var(--m3-primary)" : "rgba(255,255,255,0.1)",
        borderColor: checked ? "var(--m3-primary)" : "rgba(255,255,255,0.25)",
      }}
    >
      <motion.span
        className="absolute left-[2px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full shadow-md"
        style={{ background: checked ? "var(--m3-on-primary)" : "rgba(255,255,255,0.9)" }}
        animate={{ left: checked ? "calc(100% - 26px)" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}
