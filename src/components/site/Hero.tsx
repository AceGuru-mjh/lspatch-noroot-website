"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Download, ShieldCheck, Zap, Smartphone, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-16 pt-12 sm:pt-20">
      <div className="ambient-glow pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 opacity-60" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(109,186,149,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,184,112,0.1), transparent 40%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11px] font-medium backdrop-blur-xl"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-white/70">v1.0.13 已发布</span>
          <span className="text-white/30">·</span>
          <span className="text-emerald-300">三大铁律全量修复</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-br from-white via-white to-emerald-300 bg-clip-text text-transparent">
            LSPatch
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            NoRoot 模块合集
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] leading-relaxed text-white/60 sm:text-[15px] md:text-base"
        >
          基于 LSPatch 框架的 11 个免 Root Xposed 模块，覆盖广告拦截、隐私保护、游戏加速、
          微信增强等场景。Material 3 毛玻璃悬浮球，铁律级架构健壮性，ContentProvider 安全 IPC。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#download"
            className="m3-state group flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-[13px] font-semibold text-emerald-950 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
          >
            <Download className="h-4 w-4" />
            下载 v1.0.13
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle"
            target="_blank"
            rel="noopener noreferrer"
            className="m3-state flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[13px] font-semibold text-white/85 backdrop-blur-xl transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="#preview"
            className="m3-state flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[13px] font-semibold text-white/85 backdrop-blur-xl transition-colors hover:text-white"
          >
            <Smartphone className="h-4 w-4" />
            悬浮球 Demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            { icon: ShieldCheck, label: "免 Root" },
            { icon: Zap, label: "Material 3" },
            { icon: Sparkles, label: "毛玻璃悬浮球" },
            { icon: ShieldCheck, label: "三大铁律" },
            { icon: Zap, label: "ContentProvider IPC" },
          ].map((t) => (
            <span
              key={t.label}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60 backdrop-blur-xl"
            >
              <t.icon className="h-3 w-3 text-emerald-400" />
              {t.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4"
        >
          {[
            { value: "11", label: "免 Root 模块" },
            { value: "101", label: "Hook 反射化" },
            { value: "0", label: "残留问题" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4">
              <div className="text-2xl font-bold tabular-nums text-emerald-400 sm:text-3xl">{s.value}</div>
              <div className="mt-0.5 text-[10px] text-white/50 sm:text-[11px]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
