"use client";

import { motion } from "framer-motion";
import { X, Check, ArrowDown, Cpu, Database, Package } from "lucide-react";

export function ArchitectureCompare() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">架构对比</h2>
        <p className="mt-2 text-[13px] text-white/50">
          修复前 vs 修复后的类加载链与 IPC 数据流
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 修复前 */}
        <ArchCard
          title="修复前 · 秒崩架构"
          variant="wrong"
          items={[
            {
              icon: Package,
              label: "XposedLoader.kt",
              detail: "import hooks.* → 类加载链含 10 个 Hook object",
              bad: true,
            },
            {
              icon: Cpu,
              label: "ClassLoader 解析阶段",
              detail: "LSPatch runtime 尚未注入 → NoClassDefFoundError",
              bad: true,
            },
            {
              icon: Database,
              label: "ConfigManager",
              detail: "MODE_WORLD_READABLE → API24+ SecurityException",
              bad: true,
            },
            {
              icon: Database,
              label: "ConfigProvider ↔ ConfigManager",
              detail: "prefs 名不一致（gameunlocker vs game_unlocker）→ 永远返回空",
              bad: true,
            },
          ]}
        />

        {/* 修复后 */}
        <ArchCard
          title="修复后 · 健壮架构"
          variant="right"
          items={[
            {
              icon: Package,
              label: "XposedLoader.kt",
              detail: "零 import hooks/* → HOOK_CLASSES 数组 + Class.forName 反射",
              bad: false,
            },
            {
              icon: Cpu,
              label: "进程双分支",
              detail: "自身进程 → UI return；宿主进程 → applyHooksViaReflection()",
              bad: false,
            },
            {
              icon: Database,
              label: "ConfigManager",
              detail: "MODE_PRIVATE only → 自身进程读写",
              bad: false,
            },
            {
              icon: Database,
              label: "ConfigProvider → ConfigClient",
              detail: "统一 prefs 名 → ContentResolver.query() 跨进程读",
              bad: false,
            },
          ]}
        />
      </div>

      {/* 数据流 */}
      <div className="glass-card rounded-3xl p-4 sm:p-5">
        <h3 className="mb-4 text-center text-[14px] font-bold text-white/85">
          修复后完整数据流
        </h3>
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-center lg:gap-1">
          <FlowNode title="UI 进程" sub="MainActivity" color="#6DBA95" />
          <FlowArrow label="写 MODE_PRIVATE" />
          <FlowNode title="ConfigManager" sub="SharedPreferences" color="#FFB870" />
          <FlowArrow label="读 prefs" />
          <FlowNode title="ConfigProvider" sub="ContentProvider" color="#F0AAD6" />
          <FlowArrow label="contentResolver.query()" />
          <FlowNode title="ConfigClient" sub="Hook 进程" color="#45D6D2" />
          <FlowArrow label="返回 Config" />
          <FlowNode title="XposedLoader" sub="反射加载 Hook" color="#FFD87A" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
          <span className="rounded-full bg-white/6 px-2 py-0.5">UI 进程</span>
          <ArrowDown className="h-3 w-3 lg:hidden" />
          <span className="hidden lg:inline">→</span>
          <span className="rounded-full bg-white/6 px-2 py-0.5">宿主进程（Hook）</span>
        </div>
      </div>
    </div>
  );
}

interface ArchItem {
  icon: typeof Package;
  label: string;
  detail: string;
  bad: boolean;
}

function ArchCard({
  title,
  variant,
  items,
}: {
  title: string;
  variant: "wrong" | "right";
  items: ArchItem[];
}) {
  const isWrong = variant === "wrong";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        {isWrong ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-400/15">
            <X className="h-4 w-4 text-rose-400" />
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15">
            <Check className="h-4 w-4 text-emerald-400" />
          </div>
        )}
        <h3
          className="text-[13px] font-bold"
          style={{ color: isWrong ? "#FF8B8B" : "#6DBA95" }}
        >
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-xl border p-2.5"
              style={{
                background: item.bad ? "rgba(255,107,107,0.05)" : "rgba(109,186,149,0.05)",
                borderColor: item.bad ? "rgba(255,107,107,0.15)" : "rgba(109,186,149,0.15)",
              }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: item.bad ? "rgba(255,107,107,0.12)" : "rgba(109,186,149,0.12)",
                  color: item.bad ? "#FF8B8B" : "#6DBA95",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold text-white/85">{item.label}</div>
                <div className="mt-0.5 text-[10.5px] leading-relaxed text-white/45">{item.detail}</div>
              </div>
              {item.bad ? (
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
              ) : (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function FlowNode({ title, sub, color }: { title: string; sub: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border px-3 py-2 text-center"
      style={{ background: `${color}14`, borderColor: `${color}30` }}
    >
      <span className="text-[11px] font-bold" style={{ color }}>
        {title}
      </span>
      <span className="text-[9px] text-white/40">{sub}</span>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="hidden whitespace-nowrap text-[8.5px] text-white/35 lg:inline">{label}</span>
      <ArrowDown className="h-3 w-3 text-white/30 lg:hidden" />
      <span className="hidden text-white/30 lg:inline">→</span>
    </div>
  );
}
