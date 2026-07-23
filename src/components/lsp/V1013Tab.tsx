"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Shield,
  Database,
  Tag,
  Download,
  Terminal,
  FileCode2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const STATS = [
  { label: "XposedLoader 修复", value: "11", sub: "/ 11 模块", color: "#6DBA95", icon: Shield },
  { label: "Hook 反射化", value: "101", sub: "处 invokeHook", color: "#FFB870", icon: Zap },
  { label: "Hook 文件 Class.forName", value: "13", sub: "个文件铁律2", color: "#FFD87A", icon: FileCode2 },
  { label: "Config prefs 统一", value: "11", sub: "/ 11 模块", color: "#F0AAD6", icon: Database },
  { label: "MODE_WORLD_READABLE 删除", value: "33", sub: "处", color: "#FF6B6B", icon: Database },
  { label: "ConfigProvider permission", value: "11", sub: "readPermission", color: "#7DD3FC", icon: Shield },
  { label: "VERSION 更新", value: "11", sub: "1.0.11→1.0.13", color: "#C6D660", icon: Tag },
  { label: "文件修改", value: "86", sub: "2294 行 patch", color: "#45D6D2", icon: FileCode2 },
];

const MODULE_RESULTS = [
  { mod: "AdBlockerX_NoRoot", hooks: 11, ir2: 1, mode: "apply", prefs: "adblockerx_noroot_prefs" },
  { mod: "AudioBoost_NoRoot", hooks: 7, ir2: 1, mode: "apply", prefs: "audioboost_noroot_prefs" },
  { mod: "BatteryOptimizer_NoRoot", hooks: 11, ir2: 1, mode: "apply", prefs: "batteryoptimizer_noroot_prefs" },
  { mod: "GameUnlockerPro_NoRoot", hooks: 10, ir2: 2, mode: "apply", prefs: "gameunlockerpro_noroot_prefs" },
  { mod: "MicroXEnhancer", hooks: 12, ir2: 1, mode: "hook", prefs: "microxenhancer_prefs" },
  { mod: "NotifyMaster_NoRoot", hooks: 8, ir2: 0, mode: "apply", prefs: "notifymaster_noroot_prefs" },
  { mod: "PrivacyGuard_NoRoot", hooks: 12, ir2: 1, mode: "apply", prefs: "privacyguard_noroot_prefs" },
  { mod: "ShizukuSceneFix", hooks: 7, ir2: 3, mode: "apply", prefs: "shizukuscenefix_prefs" },
  { mod: "StepModifier_NoRoot", hooks: 7, ir2: 2, mode: "apply", prefs: "stepmodifier_noroot_prefs" },
  { mod: "VideoSaver_NoRoot", hooks: 9, ir2: 1, mode: "apply", prefs: "videosaver_noroot_prefs" },
  { mod: "VipUnlocker_NoRoot", hooks: 7, ir2: 0, mode: "apply", prefs: "vipunlocker_noroot_prefs" },
];

const FIX_ITEMS = [
  { title: "铁律 1 · 零 import hooks/*", detail: "删除 27 条 import 语句，改为 HOOK_CLASSES 数组 + invokeHook() 反射", done: true },
  { title: "铁律 2 · Hook Class.forName 加载", detail: "101 处 invokeHook + 13 个 Hook 文件的 findAndHookMethod 改为传 Class 对象", done: true },
  { title: "铁律 3 · 进程双分支", detail: "handleLoadPackage 第一行 if (packageName == OWN_PKG) return，自身进程走 UI", done: true },
  { title: "IPC · prefs 名统一", detail: "11 模块 ConfigProvider/ConfigManager 的 PREFS_NAME 统一为 {module}_prefs", done: true },
  { title: "IPC · 删 MODE_WORLD_READABLE", detail: "33 处 MODE_WORLD_READABLE → MODE_PRIVATE，跨进程读走 ContentProvider", done: true },
  { title: "IPC · ConfigProvider permission", detail: "11 模块添加 signature 级 readPermission，防止任意 APP 读取配置", done: true },
  { title: "版本号 · 1.0.11 → 1.0.13", detail: "11 模块 VERSION + build.gradle versionName + build.yml tag 同步更新", done: true },
  { title: "深度检查 · 0 残留问题", detail: "全量扫描 11 模块 XposedLoader/Hook/Config/Manifest，0 个铁律违反", done: true },
];

const DOWNLOADS = [
  { name: "lspatch-noroot-fix-v1.0.13.patch", desc: "git patch · 86 文件 · 2294 行 · phase1+2", size: "139 KB", path: "/fix-package-v1.0.13/lspatch-noroot-fix-v1.0.13.patch", primary: true },
  { name: "apply.sh", desc: "一键应用 · 含 7 项验证", size: "3.7 KB", path: "/fix-package-v1.0.13/apply.sh" },
  { name: "fix_v1013.py", desc: "Phase1 修复脚本 · 铁律1+IPC+版本号", size: "12 KB", path: "/fix-package-v1.0.13/fix_v1013.py" },
  { name: "fix_v1013_phase2.py", desc: "Phase2 补修脚本 · 铁律2+permission", size: "3.9 KB", path: "/fix-package-v1.0.13/fix_v1013_phase2.py" },
  { name: "fix-report.json", desc: "修复报告 · 机器可读", size: "2.0 KB", path: "/fix-package-v1.0.13/fix-report.json" },
  { name: "README.md", desc: "修复包说明", size: "0.9 KB", path: "/fix-package-v1.0.13/README.md" },
];

export function V1013Tab() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="text-center">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "#6DBA95", color: "#6DBA95", background: "rgba(109,186,149,0.12)" }}
        >
          <Sparkles className="h-3 w-3" />
          v1.0.13 大完善 · 三大铁律 + IPC + 版本号一次修完
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, #6DBA95 120%)" }}>
            v1.0.13 完整修复进度看板
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-[12.5px] leading-relaxed text-white/55">
          已克隆最新仓库并执行全量修复 + 深度检查补修。<span className="text-emerald-300">11/11 模块验证通过，0 残留问题</span>，
          86 个文件、2294 行 patch 就绪。下载 apply 后 push 即得 v1.0.13 APK
        </p>
      </section>

      {/* 统计 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-3 text-center"
            >
              <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${s.color}1a`, color: s.color }}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
              <div className="mt-0.5 text-[9.5px] font-semibold text-white/75 leading-tight">{s.label}</div>
              <div className="text-[8.5px] text-white/40">{s.sub}</div>
            </motion.div>
          );
        })}
      </section>

      {/* 修复项 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">修复项清单</h2>
        <div className="glass-card rounded-3xl p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FIX_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2.5 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-white/90">{item.title}</div>
                  <div className="mt-0.5 text-[10.5px] leading-relaxed text-white/50">{item.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 逐模块验证 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">11 模块验证报告</h2>
        <div className="glass-card overflow-hidden rounded-3xl">
          <div className="grid grid-cols-12 gap-2 border-b border-white/8 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white/40">
            <div className="col-span-4">模块</div>
            <div className="col-span-2">Hook 反射</div>
            <div className="col-span-2">铁律2 文件</div>
            <div className="col-span-2">prefs 名</div>
            <div className="col-span-2 text-right">状态</div>
          </div>
          <div className="lsp-scroll max-h-[420px] overflow-y-auto">
            {MODULE_RESULTS.map((m, i) => (
              <motion.div
                key={m.mod}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 items-center gap-2 border-b border-white/4 px-4 py-2.5"
              >
                <div className="col-span-4 min-w-0">
                  <div className="truncate text-[11.5px] font-semibold text-white/85">{m.mod}</div>
                  <div className="font-mono text-[9px] text-white/35">.{m.mode}()</div>
                </div>
                <div className="col-span-2">
                  <span className="rounded-md bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                    {m.hooks}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="rounded-md bg-amber-400/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                    {m.ir2} 个
                  </span>
                </div>
                <div className="col-span-2 min-w-0">
                  <span className="truncate font-mono text-[9px] text-white/50">{m.prefs}</span>
                </div>
                <div className="col-span-2 text-right">
                  <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 下载 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">下载修复包</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DOWNLOADS.map((f, i) => (
            <motion.a
              key={f.name}
              href={f.path}
              download
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="m3-state glass-card flex items-center gap-3 rounded-2xl p-3.5"
              style={{ borderColor: f.primary ? "#6DBA95" : undefined }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: f.primary ? "#6DBA95" : "rgba(255,255,255,0.06)",
                  color: f.primary ? "#003821" : "rgba(255,255,255,0.7)",
                }}
              >
                <Download className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-[11.5px] font-semibold text-white/90">{f.name}</span>
                  {f.primary && (
                    <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-300">核心</span>
                  )}
                </div>
                <div className="mt-0.5 text-[10px] text-white/45">{f.desc}</div>
                <div className="text-[9.5px] text-white/30">{f.size}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* 应用步骤 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">3 步应用</h2>
        <div className="glass-card rounded-3xl p-4 sm:p-5">
          <div className="space-y-2">
            {[
              { n: 1, cmd: "cd LSPatch-Noroot-modle && cp /path/to/fix-package-v1.0.13/* .", desc: "复制修复包到仓库根目录" },
              { n: 2, cmd: "bash apply.sh", desc: "应用 patch + 5 项自动验证（铁律1/IPC/版本号）" },
              { n: 3, cmd: "git add -A && git commit -m 'feat: v1.0.13 大完善' && git push", desc: "push 触发 Actions，5 分钟后得 v1.0.13 APK" },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/3 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-[11px] font-bold text-emerald-300">
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10.5px] text-white/40">{s.desc}</div>
                  <code className="block font-mono text-[10.5px] text-white/85 break-all">{s.cmd}</code>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/8 p-3">
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-[11.5px] text-emerald-300/90">
              v1.0.13 修复后，APK 既能安装又能集成模式运行（不再秒崩），总开关跨进程同步生效
            </span>
          </div>
        </div>
      </section>

      {/* 对比 v1.0.12 → v1.0.13 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">v1.0.12 → v1.0.13 对比</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="glass-card rounded-2xl border border-rose-400/20 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">v1.0.12 现状</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-white/55">
              <li>• 11 APK 能构建能安装</li>
              <li className="text-rose-300/80">• 集成模式运行秒崩（27 条 import hooks）</li>
              <li className="text-rose-300/80">• 总开关跨进程失效（prefs 名不一致）</li>
              <li className="text-rose-300/80">• MODE_WORLD_READABLE 抛异常（33 处）</li>
              <li>• VERSION 显示 1.0.11</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl border border-emerald-400/20 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">v1.0.13 修复后</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-white/55">
              <li>• 11 APK 能构建能安装</li>
              <li className="text-emerald-300/80">• 集成模式稳定运行（零 import，全反射）</li>
              <li className="text-emerald-300/80">• 总开关跨进程同步（prefs 统一）</li>
              <li className="text-emerald-300/80">• MODE_PRIVATE 无异常</li>
              <li>• VERSION 显示 1.0.13</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
