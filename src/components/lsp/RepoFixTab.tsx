"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileCode2, RefreshCw, ExternalLink, GitCommit, AlertCircle } from "lucide-react";

const REPOS = [
  {
    name: "LSPatch-Noroot-modle",
    desc: "11 个免 Root Xposed 模块",
    url: "https://github.com/AceGuru-mjh/LSPatch-Noroot-modle",
    color: "#6DBA95",
    files: { total: 589, fixed: 1, alreadyUtf8: 588 },
    readme: "重写完成（模块列表 + 三大铁律 + 使用方法 + 技术栈）",
    commit: "9f6cc07",
    status: "推送成功",
  },
  {
    name: "LSPosed-root-modle",
    desc: "9 个 Root Xposed 模块",
    url: "https://github.com/AceGuru-mjh/LSPosed-root-modle",
    color: "#FF6B6B",
    files: { total: 493, fixed: 233, alreadyUtf8: 260 },
    readme: "重写完成（Root 专属 Hook + 与 NoRoot 对比 + 系统级能力）",
    commit: "6a0b8d5",
    status: "推送成功",
  },
  {
    name: "lsp-model",
    desc: "20 模块合集总仓库 + AI 开发指南",
    url: "https://github.com/AceGuru-mjh/lsp-model",
    color: "#7DD3FC",
    files: { total: 823, fixed: 0, alreadyUtf8: 823 },
    readme: "重写完成（仓库定位 + 20 模块列表 + AI_DEV_GUIDE + 体检脚本）",
    commit: "2c7682c",
    status: "推送成功",
    extra: "修复 healthcheck.py 编码（6 处 open 加 encoding=utf-8）",
  },
  {
    name: "Axmanager-modle",
    desc: "30 个 AXManager 系统工具插件",
    url: "https://github.com/AceGuru-mjh/Axmanager-modle",
    color: "#FFB870",
    files: { total: 30, fixed: 0, alreadyUtf8: 30 },
    readme: "重写完成（30 插件列表 + 插件结构 + 使用方法）",
    commit: "ea74589",
    status: "推送成功",
  },
];

const FIX_SUMMARY = [
  { label: "仓库数", value: "4", color: "#6DBA95" },
  { label: "总文件数", value: "1,935", color: "#FFB870" },
  { label: "乱码修复", value: "234", color: "#FF6B6B" },
  { label: "已是 UTF-8", value: "1,701", color: "#7DD3FC" },
  { label: "README 重写", value: "4", color: "#F0AAD6" },
  { label: "健康脚本修复", value: "1", color: "#FFD87A" },
];

const FIX_TYPES = [
  { type: "GBK → UTF-8", count: 0, desc: "纯 GBK 编码文件（PowerShell Set-Content 导致）", color: "#FF6B6B" },
  { type: "UTF-16 → UTF-8", count: 2, desc: "带 BOM 的 UTF-16 文件（health-report.json）", color: "#FFB870" },
  { type: "混合编码 → UTF-8", count: 232, desc: "UTF-8 主体但有损坏字节（? 替换无法映射字符）", color: "#FCD34D" },
  { type: "已是 UTF-8", count: 1701, desc: "原本就是正确 UTF-8，无需修复", color: "#6DBA95" },
];

export function RepoFixTab() {
  return (
    <div className="space-y-6">
      <section className="text-center">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "#6DBA95", color: "#6DBA95", background: "rgba(109,186,149,0.12)" }}
        >
          <CheckCircle2 className="h-3 w-3" />
          4 仓库乱码全面修复 + README 重写 · 已推送 GitHub
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, #6DBA95 120%)" }}>
            仓库修复进度看板
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-[12.5px] leading-relaxed text-white/55">
          全面修复 4 个仓库的编码问题（GBK/UTF-16/混合损坏），重写 README，
          修复 healthcheck.py。全部文件验证为有效 UTF-8，已推送 GitHub 触发 Actions 重建
        </p>
      </section>

      {/* 统计 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FIX_SUMMARY.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-3 text-center"
          >
            <div className="text-xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
            <div className="mt-0.5 text-[10px] font-semibold text-white/75">{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* 4 仓库卡片 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">4 仓库修复详情</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {REPOS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-3xl p-5"
              style={{ borderColor: `${r.color}30` }}
            >
              {/* 头部 */}
              <div className="mb-3 flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${r.color}1a`, color: r.color }}
                >
                  <FileCode2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-bold text-white/90">{r.name}</h3>
                    <span
                      className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ background: `${r.color}15`, color: r.color }}
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/45">{r.desc}</p>
                </div>
              </div>

              {/* 文件统计 */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/8 bg-white/3 p-2 text-center">
                  <div className="text-[9px] text-white/40">总文件</div>
                  <div className="text-[14px] font-bold text-white/85">{r.files.total}</div>
                </div>
                <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/5 p-2 text-center">
                  <div className="text-[9px] text-white/40">已修复</div>
                  <div className="text-[14px] font-bold text-emerald-400">{r.files.fixed}</div>
                </div>
                <div className="rounded-lg border border-sky-400/15 bg-sky-400/5 p-2 text-center">
                  <div className="text-[9px] text-white/40">原 UTF-8</div>
                  <div className="text-[14px] font-bold text-sky-400">{r.files.alreadyUtf8}</div>
                </div>
              </div>

              {/* README */}
              <div className="mb-2 rounded-xl border border-white/8 bg-white/3 p-2.5">
                <div className="mb-1 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wide text-white/40">
                  <RefreshCw className="h-3 w-3" />
                  README.md
                </div>
                <p className="text-[11px] text-white/60">{r.readme}</p>
              </div>

              {/* 额外修复 */}
              {r.extra && (
                <div className="mb-2 rounded-xl border border-amber-400/15 bg-amber-400/5 p-2.5">
                  <div className="mb-1 flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-300/70">
                    <AlertCircle className="h-3 w-3" />
                    额外修复
                  </div>
                  <p className="text-[11px] text-white/60">{r.extra}</p>
                </div>
              )}

              {/* commit + 链接 */}
              <div className="flex items-center justify-between border-t border-white/8 pt-2.5">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
                  <GitCommit className="h-3 w-3" />
                  {r.commit}
                </span>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-state flex items-center gap-1 text-[10.5px] font-medium text-white/60 transition-colors hover:text-white"
                >
                  查看仓库 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 修复类型分布 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">修复类型分布</h2>
        <div className="glass-card rounded-3xl p-5">
          <div className="space-y-3">
            {FIX_TYPES.map((t, i) => {
              const pct = (t.count / 1935) * 100;
              return (
                <motion.div
                  key={t.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="mb-1 flex items-center justify-between text-[11.5px]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                      <span className="font-semibold text-white/85">{t.type}</span>
                      <span className="text-white/40">{t.desc}</span>
                    </span>
                    <span className="font-bold tabular-nums" style={{ color: t.color }}>{t.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.06 + 0.2, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Actions 状态 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">GitHub Actions 触发</h2>
        <div className="glass-card rounded-3xl p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {REPOS.slice(0, 3).map((r) => (
              <div key={r.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-3">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" style={{ animationDuration: "2s" }} />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[12px] font-semibold text-white/85">{r.name}</div>
                  <div className="text-[10px] text-emerald-300/80">Actions 已触发，构建中</div>
                </div>
                <a
                  href={`${r.url}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-state flex items-center gap-1 rounded-lg bg-white/6 px-2 py-1 text-[10px] text-white/60"
                >
                  查看 <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 p-3">
              <CheckCircle2 className="h-4 w-4 text-white/40" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-[12px] font-semibold text-white/85">Axmanager-modle</div>
                <div className="text-[10px] text-white/40">无 workflow（插件 zip，无需构建）</div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/8 p-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-[11.5px] text-emerald-300/90">
              4 仓库全部推送成功。LSPatch-NoRoot / LSPosed-Root / lsp-model 的 Actions 已触发，
              约 5-10 分钟后生成新 APK。Axmanager 无需构建（插件为 zip 格式）。
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
