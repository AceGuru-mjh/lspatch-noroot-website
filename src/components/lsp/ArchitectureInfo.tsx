"use client";

import { Boxes, Layers, Radio, ArrowLeftRight } from "lucide-react";

const CARDS = [
  {
    icon: Boxes,
    title: "LSPatch 注入原理",
    color: "#6DBA95",
    points: [
      "模块即标准 Xposed APK：assets/xposed_init 声明入口 + xposedscope 限定目标",
      "本地模式：管理器运行时动态 patch 目标进程加载已装模块",
      "集成模式：把模块 APK 嵌入目标 APK 的 assets/lspatch/modules/",
      "改写目标 Application 为 org.lsposed.lspatch.LSPatch 触发注入",
    ],
  },
  {
    icon: Radio,
    title: "悬浮球实现（无 Root）",
    color: "#FFB870",
    points: [
      "前台 Service（foregroundServiceType=specialUse）+ WindowManager",
      "TYPE_APPLICATION_OVERLAY · 120×120 · FLAG_NOT_FOCUSABLE",
      "需用户授予 SYSTEM_ALERT_WINDOW 权限",
      "OnTouchListener 区分拖拽 / 点击，点击启动 PanelActivity",
    ],
  },
  {
    icon: ArrowLeftRight,
    title: "双进程 IPC · 配置同步",
    color: "#F0AAD6",
    points: [
      "UI 进程写 SharedPreferences（MODE_WORLD_READABLE）",
      "Hook 进程读 XSharedPreferences（LSPosed 跨进程）",
      "LSPatch 本地模式回退 ContentProvider：content://<pkg>.configprovider",
      "三通道兜底保证总开关状态实时同步到 Hook 侧",
    ],
  },
];

export function ArchitectureInfo() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {CARDS.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="glass-card rounded-2xl p-4"
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${c.color}22`, color: c.color }}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
              </div>
              <h3 className="text-[13px] font-semibold text-white/90">{c.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {c.points.map((p, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-white/55">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: c.color }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function FlowDiagram() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-white/70" />
        <span className="text-[12px] font-semibold text-white/85">悬浮球运行时数据流</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
        <Node label="目标 APP 进程" sub="Hook 执行" color="#6DBA95" />
        <Arrow />
        <Node label="XposedLoader" sub="findAndHookMethod" color="#FFB870" />
        <Arrow />
        <Node label="LogStore" sub="日志持久化" color="#F0AAD6" />
        <Arrow />
        <Node label="FloatingBallService" sub="WindowManager 叠加" color="#45D6D2" />
        <Arrow />
        <Node label="PanelActivity" sub="毛玻璃面板" color="#FFD87A" />
      </div>
    </div>
  );
}

function Node({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div
      className="flex flex-col rounded-xl border px-2.5 py-1.5"
      style={{ background: `${color}18`, borderColor: `${color}40` }}
    >
      <span className="text-[11px] font-semibold" style={{ color }}>
        {label}
      </span>
      <span className="text-[9px] text-white/45">{sub}</span>
    </div>
  );
}

function Arrow() {
  return <span className="text-white/30">→</span>;
}
