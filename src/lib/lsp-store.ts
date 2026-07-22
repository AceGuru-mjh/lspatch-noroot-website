/**
 * LSPatch 悬浮球状态管理
 * - 每个模块独立的总开关 / 日志 / 指标
 * - 实时日志模拟（按模块 interval 随机生成）
 * - 悬浮球位置与面板展开态
 */

import { create } from "zustand";
import { LSP_MODULES, getModule, type LspLog } from "./lsp-modules";

interface ModuleState {
  enabled: boolean;
  logs: LspLog[];
  metrics: Record<string, number>;
}

interface LspStore {
  activeModuleId: string;
  panelOpen: boolean;
  /** 悬浮球在手机屏幕内的相对位置 (0~1) */
  ball: { rx: number; ry: number };
  modules: Record<string, ModuleState>;

  setActiveModule: (id: string) => void;
  toggleMaster: (id: string) => void;
  setMaster: (id: string, on: boolean) => void;
  togglePanel: () => void;
  setPanel: (open: boolean) => void;
  setBall: (rx: number, ry: number) => void;
  addLog: (id: string) => void;
  clearLogs: (id: string) => void;
}

const MAX_LOGS = 60;
const uid = () => Math.random().toString(36).slice(2, 10);

/** 初始化每个模块的指标基线（开关关闭时） */
function initialMetrics(field: string): Record<string, number> {
  switch (field) {
    case "fps":
      return { fps: 60 };
    case "db":
      return { db: 0 };
    case "fixed":
      return { fixed: 0 };
    case "savedPct":
      return { savedPct: 0 };
    default:
      return { [field]: 0 };
  }
}

/** 开关打开时某些指标 snap 到目标值（仅状态量：fps / db / fixed） */
function metricsOnEnable(field: string): Record<string, number> {
  switch (field) {
    case "fps":
      return { fps: 120 };
    case "db":
      return { db: 6 };
    case "fixed":
      return { fixed: 1 };
    default:
      return {};
  }
}

/** 开关关闭时仅重置状态量；累计计数（blocked / recall / ...）保持不变 */
function metricsOnDisable(field: string): Record<string, number> {
  switch (field) {
    case "fps":
      return { fps: 60 };
    case "db":
      return { db: 0 };
    case "fixed":
      return { fixed: 0 };
    default:
      return {};
  }
}

/** 构建初始 modules 状态 */
function buildInitialModules(): Record<string, ModuleState> {
  const out: Record<string, ModuleState> = {};
  for (const m of LSP_MODULES) {
    out[m.id] = {
      enabled: true,
      logs: [],
      metrics: { ...initialMetrics(m.metric.field), ...metricsOnEnable(m.metric.field) },
    };
  }
  // 预填几条初始日志，让面板打开就有内容
  for (const m of LSP_MODULES) {
    const seedCount = m.id === "adblocker" ? 8 : m.id === "privacy" ? 5 : 3;
    const now = Date.now();
    for (let i = 0; i < seedCount; i++) {
      const base = m.genLog();
      out[m.id].logs.push({
        id: uid(),
        ts: now - (seedCount - i) * (m.interval[0] + m.interval[1]) / 2,
        ...base,
      });
      // 累加初始指标
      bumpMetrics(out[m.id].metrics, m.metric.field, base.level === "block");
    }
    // adblocker 给一个比较大的初始拦截数，更像真实运行中
    if (m.id === "adblocker") {
      out[m.id].metrics.blocked += 1186;
    }
  }
  return out;
}

/** 根据日志更新指标 */
function bumpMetrics(metrics: Record<string, number>, field: string, isBlock: boolean) {
  switch (field) {
    case "blocked":
      metrics.blocked += 1;
      break;
    case "protected":
      metrics.protected += 1;
      break;
    case "recall":
      metrics.recall += 1;
      break;
    case "unlocked":
      metrics.unlocked += 1;
      break;
    case "video":
      metrics.video += 1;
      break;
    case "steps":
      metrics.steps += Math.floor(800 + Math.random() * 700);
      break;
    case "muted":
      metrics.muted += 1;
      break;
    case "savedPct":
      metrics.savedPct = Math.min(38, metrics.savedPct + Math.floor(1 + Math.random() * 2));
      break;
    // fps / db / fixed 由开关控制，不随日志变
    default:
      break;
  }
  void isBlock;
}

export const useLspStore = create<LspStore>((set, get) => ({
  activeModuleId: "adblocker",
  panelOpen: false,
  ball: { rx: 0.82, ry: 0.72 },
  modules: buildInitialModules(),

  setActiveModule: (id) =>
    set({ activeModuleId: id, panelOpen: false }),

  toggleMaster: (id) => {
    const cur = get().modules[id];
    const next = !cur.enabled;
    const field = getModule(id).metric.field;
    set((s) => ({
      modules: {
        ...s.modules,
        [id]: {
          ...cur,
          enabled: next,
          metrics: {
            ...cur.metrics,
            ...(next ? metricsOnEnable(field) : metricsOnDisable(field)),
          },
        },
      },
    }));
  },

  setMaster: (id, on) => {
    const cur = get().modules[id];
    const field = getModule(id).metric.field;
    set((s) => ({
      modules: {
        ...s.modules,
        [id]: {
          ...cur,
          enabled: on,
          metrics: {
            ...cur.metrics,
            ...(on ? metricsOnEnable(field) : metricsOnDisable(field)),
          },
        },
      },
    }));
  },

  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  setPanel: (open) => set({ panelOpen: open }),
  setBall: (rx, ry) => set({ ball: { rx: Math.max(0.04, Math.min(0.96, rx)), ry: Math.max(0.05, Math.min(0.95, ry)) } }),

  addLog: (id) => {
    const mod = getModule(id);
    const state = get().modules[id];
    if (!state.enabled) return;
    const base = mod.genLog();
    const log: LspLog = { id: uid(), ts: Date.now(), ...base };
    set((s) => {
      const cur = s.modules[id];
      const logs = [log, ...cur.logs].slice(0, MAX_LOGS);
      const metrics = { ...cur.metrics };
      bumpMetrics(metrics, mod.metric.field, base.level === "block");
      return { modules: { ...s.modules, [id]: { ...cur, logs, metrics } } };
    });
  },

  clearLogs: (id) =>
    set((s) => ({
      modules: { ...s.modules, [id]: { ...s.modules[id], logs: [] } },
    })),
}));
