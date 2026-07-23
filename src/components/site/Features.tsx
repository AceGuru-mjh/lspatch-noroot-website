"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Layers, Lock, Cpu, GitBranch } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "免 Root Xposed",
    desc: "基于 LSPatch 框架，无需 Root 即可注入 Xposed 模块。本地模式动态 patch，集成模式嵌入 APK，两种模式都支持。",
    color: "#6DBA95",
    points: ["LSPatch 本地/集成双模式", "Shizuku adb 级系统操作", "Android 8.0+ (API 26+)", "compileOnly Xposed API 82"],
  },
  {
    icon: Sparkles,
    title: "Material 3 毛玻璃悬浮球",
    desc: "每个模块自带 M3 风格悬浮球，backdrop-blur 毛玻璃效果，可拖拽、点击展开面板，显示实时指标与日志。",
    color: "#FFB870",
    points: ["TYPE_APPLICATION_OVERLAY 叠加", "glass-ball 毛玻璃背景", "拖拽 + 点击双交互", "最小化指标实时显示"],
  },
  {
    icon: Layers,
    title: "三大铁律防秒崩",
    desc: "LSPatch 集成模式下，违反铁律会导致类加载阶段秒崩。本合集 11 模块全部遵守三大铁律，反射加载零 import。",
    color: "#F0AAD6",
    points: ["铁律1: 零 import hooks/*", "铁律2: Class.forName 反射", "铁律3: 进程双分支", "101 处 Hook 反射化"],
  },
  {
    icon: Lock,
    title: "安全 IPC 配置同步",
    desc: "ContentProvider 跨进程配置同步，signature 级 readPermission 保护，无 MODE_WORLD_READABLE 异常。",
    color: "#7DD3FC",
    points: ["ContentProvider + ConfigClient", "signature 级 readPermission", "MODE_PRIVATE 跨进程安全", "prefs 名统一 11 模块"],
  },
  {
    icon: Cpu,
    title: "11 模块全覆盖",
    desc: "广告拦截、隐私保护、游戏加速、省电优化、微信增强、VIP 解锁、视频下载、步数修改、音量增强、通知管理、Shizuku 修复。",
    color: "#FFD87A",
    points: ["AdBlockerX 拦截追踪器", "PrivacyGuard 设备伪造", "GameUnlocker 帧率解锁", "MicroX 微信防撤回"],
  },
  {
    icon: GitBranch,
    title: "CI 自动构建",
    desc: "GitHub Actions matrix 并行编译 11 模块，debug.jks 自动签名，Release 自动发布 APK，apply.sh 一键修复脚本。",
    color: "#C6D660",
    points: ["matrix 11 模块并行", "自动生成 debug.jks", "Release 自动发布", "apply.sh 7 项验证"],
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
          <ShieldCheck className="h-3 w-3" />
          核心特性
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          为什么选择 LSPatch NoRoot
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] text-white/55">
          6 大核心能力，让免 Root Xposed 模块既强大又稳定
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
              className="glass-card group rounded-3xl p-5 transition-all hover:border-white/20"
            >
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                style={{ background: `${f.color}1a`, color: f.color }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="text-[15px] font-bold text-white/90">{f.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/55">{f.desc}</p>
              <ul className="mt-3 space-y-1.5 border-t border-white/6 pt-3">
                {f.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="h-1 w-1 rounded-full" style={{ background: f.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
