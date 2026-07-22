"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileCode2,
  Terminal,
  CheckCircle2,
  Package,
  GitBranch,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

const FIX_FILES = [
  { name: "lspatch-noroot-fix-v1.0.12.patch", desc: "git patch · 12 文件 · 934 行", size: "63 KB", path: "/fix-package/lspatch-noroot-fix-v1.0.12.patch", icon: GitBranch, primary: true },
  { name: "apply.sh", desc: "一键应用脚本 · 自动验证铁律", size: "2.6 KB", path: "/fix-package/apply.sh", icon: Terminal },
  { name: "fix_xposed_loaders.py", desc: "铁律修复脚本 · 自动化 11 模块", size: "3.8 KB", path: "/fix-package/fix_xposed_loaders.py", icon: FileCode2 },
  { name: "README.md", desc: "修复包说明文档", size: "1.2 KB", path: "/fix-package/README.md", icon: Package },
];

const FIX_STATS = [
  { label: "修改文件", value: "12", sub: "11 XposedLoader + build.yml" },
  { label: "删除 import", value: "26", sub: "条 hooks/* 导入" },
  { label: "反射替换", value: "89", sub: "处 Hook 调用" },
  { label: "CI 签名", value: "4", sub: "项 env 对齐" },
];

const STEPS = [
  { n: 1, cmd: "git clone https://github.com/AceGuru-mjh/LSPatch-Noroot-modle.git", desc: "克隆仓库" },
  { n: 2, cmd: "cd LSPatch-Noroot-modle && cp /path/to/fix-package/* .", desc: "复制修复包到根目录" },
  { n: 3, cmd: "bash apply.sh", desc: "一键应用 patch + 验证铁律" },
  { n: 4, cmd: "git add -A && git commit -m 'fix: 三大铁律+CI签名 v1.0.12'", desc: "提交" },
  { n: 5, cmd: "git push origin main", desc: "推送触发 Actions" },
  { n: 6, cmd: "# 等待 ~5 分钟，在 Actions 页查看构建", desc: "11 模块并行构建" },
];

export function DownloadTab() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="text-center">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "var(--m3-primary)", color: "var(--m3-primary)", background: "var(--m3-primary-container)" }}
        >
          <Package className="h-3 w-3" />
          spec 模式完整修复包 · 可直接 git apply
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, var(--m3-primary) 120%)" }}>
            v1.0.12 完整修复包下载
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-[12.5px] leading-relaxed text-white/55">
          已克隆仓库并自动修复全部 11 个模块。下载 patch 文件，在仓库根目录执行 <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-white/80">bash apply.sh</code>，push 后 GitHub Actions 即可生成 v1.0.12 APK
        </p>
      </section>

      {/* 统计 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FIX_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--m3-primary)" }}>
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] font-semibold text-white/80">{s.label}</div>
            <div className="text-[9.5px] text-white/40">{s.sub}</div>
          </motion.div>
        ))}
      </section>

      {/* 下载文件列表 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">下载文件</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FIX_FILES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.a
                key={f.name}
                href={f.path}
                download
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="m3-state glass-card flex items-center gap-3 rounded-2xl p-4 transition-all hover:border-white/20"
                style={{ borderColor: f.primary ? "var(--m3-primary)" : undefined }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: f.primary ? "var(--m3-primary)" : "rgba(255,255,255,0.06)",
                    color: f.primary ? "var(--m3-on-primary)" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-mono text-[12px] font-semibold text-white/90">{f.name}</span>
                    {f.primary && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
                      >
                        核心
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-white/45">{f.desc}</div>
                  <div className="text-[9.5px] text-white/30">{f.size}</div>
                </div>
                <Download className="h-4 w-4 shrink-0 text-white/50" />
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* 应用步骤 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">应用步骤</h2>
        <div className="glass-card rounded-3xl p-4 sm:p-5">
          <div className="space-y-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/3 p-3">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                  style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
                >
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10.5px] text-white/40">{s.desc}</div>
                  <code className="block font-mono text-[11px] text-white/85 break-all">{s.cmd}</code>
                </div>
                <CopyButton text={s.cmd} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/8 p-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-[11.5px] text-emerald-300/90">
              push 后约 5 分钟，11 个模块 APK 会在 <span className="font-mono font-semibold">Releases v1.0.12</span> 页出现
            </span>
          </div>
        </div>
      </section>

      {/* 修复内容详情 */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <FixDetail
          icon={GitBranch}
          title="CI 签名修复"
          color="#FF6B6B"
          items={[
            "build.yml 添加 MJH_STORE_FILE 指向 debug.jks",
            "4 项 env 全部对齐 debug123/debug",
            "tag_name: v1.0.11 → v1.0.12",
            "Release body 修正为 11 个 NoRoot 模块",
          ]}
        />
        <FixDetail
          icon={FileCode2}
          title="铁律 1 修复"
          color="#FFB870"
          items={[
            "11 个 XposedLoader.kt 全部删除 import hooks/*",
            "AdBlockerX: 删除 11 条 import",
            "ShizukuSceneFix: 删除 7 条 import",
            "其余 9 模块: 各删除 1 条通配 import",
          ]}
        />
        <FixDetail
          icon={Terminal}
          title="铁律 2 修复"
          color="#6DBA95"
          items={[
            "89 处 Hook.apply() → invokeHook() 反射",
            "新增 invokeHook 辅助方法（10 模块）",
            "新增 invokeHookNoCfg 辅助方法（MicroXEnhancer）",
            "每个 Hook 独立 try-catch，单个失败不影响其他",
          ]}
        />
      </section>

      {/* 验证结果 */}
      <section>
        <div className="glass-card rounded-3xl p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-white/60" />
            <span className="text-[13px] font-semibold text-white/85">修复验证（本地已执行）</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              "11/11 模块 XposedLoader.kt 零 import hooks/* ✓",
              "89 处 Hook 调用改为 Class.forName 反射 ✓",
              "build.yml MJH_STORE_FILE 指向 debug.jks ✓",
              "build.yml tag_name 更新为 v1.0.12 ✓",
              "AdBlockerX Config 类型修正为 AdBlockConfig ✓",
              "MicroXEnhancer .hook() 模式特殊处理 ✓",
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span className="text-[11px] text-white/70">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FixDetail({ icon: Icon, title, color, items }: { icon: typeof GitBranch; title: string; color: string; items: string[] }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}1a`, color }}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <h3 className="text-[12.5px] font-bold text-white/90">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1.5 text-[10.5px] leading-relaxed text-white/55">
            <ArrowRight className="mt-0.5 h-2.5 w-2.5 shrink-0" style={{ color }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  };
  return (
    <button
      onClick={handleCopy}
      className="m3-state flex shrink-0 items-center justify-center rounded-lg bg-white/6 p-1.5 text-white/50 transition-colors hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
