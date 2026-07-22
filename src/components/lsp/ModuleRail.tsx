"use client";

import { Check, Pause } from "lucide-react";
import { useLspStore } from "@/lib/lsp-store";
import { LSP_MODULES } from "@/lib/lsp-modules";

export function ModuleRail() {
  const { activeModuleId, modules, setActiveModule } = useLspStore();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          NoRoot 模块 · 11
        </span>
        <span className="text-[10px] text-white/30">点击切换</span>
      </div>
      <div className="lsp-scroll flex max-h-[520px] flex-col gap-1.5 overflow-y-auto pr-1">
        {LSP_MODULES.map((m) => {
          const state = modules[m.id];
          const active = m.id === activeModuleId;
          const Icon = m.icon;
          const value = state.metrics[m.metric.field] ?? 0;
          const display = m.metric.isCount
            ? value.toLocaleString()
            : `${m.metric.prefix ?? ""}${value}${m.metric.suffix ?? ""}`;

          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className="m3-state group relative flex items-center gap-2.5 rounded-2xl border px-2.5 py-2 text-left transition-all duration-200"
              style={{
                background: active ? "var(--m3-primary-container)" : "rgba(255,255,255,0.04)",
                borderColor: active ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
              }}
            >
              {/* 图标 */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors"
                style={{
                  background: active ? "var(--m3-primary)" : "rgba(255,255,255,0.06)",
                  color: active ? "var(--m3-on-primary)" : "rgba(255,255,255,0.7)",
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>

              {/* 名称 + 指标 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="truncate text-[12px] font-semibold"
                    style={{ color: active ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.88)" }}
                  >
                    {m.name}
                  </span>
                </div>
                <span className="block truncate text-[9.5px] text-white/40">{m.nameEn}</span>
              </div>

              {/* 右侧：指标 + 状态 */}
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span
                  className="text-[12px] font-bold tabular-nums"
                  style={{ color: active ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.85)" }}
                >
                  {display}
                </span>
                <span className="flex items-center gap-1 text-[9px]">
                  {state.enabled ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-300/80">运行</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-2.5 w-2.5 text-white/35" />
                      <span className="text-white/35">暂停</span>
                    </>
                  )}
                </span>
              </div>

              {/* 激活指示条 */}
              {active && (
                <span
                  className="absolute -left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full"
                  style={{ background: "var(--m3-primary)" }}
                />
              )}
              {active && (
                <Check
                  className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0.5"
                  style={{ background: "var(--m3-primary)", color: "var(--m3-on-primary)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
