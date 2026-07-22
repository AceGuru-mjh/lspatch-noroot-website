"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Terminal, Bug, AlertTriangle, AlertOctagon, Zap, ChevronDown } from "lucide-react";
import { CHECKLIST, BUG_RECORDS, type BugRecord } from "@/lib/fix-data";
import { CodeBlock } from "./CodeBlock";

export function ChecklistAndBugs() {
  return (
    <div className="space-y-8">
      {/* 检查清单 */}
      <section>
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">新模块 6 项检查清单</h2>
          <p className="mt-2 text-[13px] text-white/50">
            每新增一个 LSPatch NoRoot 模块，提 PR 前必须逐项打勾
          </p>
        </div>
        <Checklist />
      </section>

      {/* 踩坑记录 */}
      <section>
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">踩坑记录 #11 – #16</h2>
          <p className="mt-2 text-[13px] text-white/50">
            本次铁律修复过程中新增的 6 条踩坑记录，覆盖类加载 / IPC / CI 签名三大类
          </p>
        </div>
        <BugRecords />
      </section>
    </div>
  );
}

/* ============ 检查清单 ============ */

function Checklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doneCount = checked.size;
  const allDone = doneCount === CHECKLIST.length;

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5">
      {/* 进度条 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-white/60" />
          <span className="text-[13px] font-semibold text-white/85">检查进度</span>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            background: allDone ? "rgba(109,186,149,0.18)" : "rgba(255,255,255,0.06)",
            color: allDone ? "#6DBA95" : "rgba(255,255,255,0.6)",
          }}
        >
          {doneCount} / {CHECKLIST.length} {allDone ? "✓ 全部通过" : ""}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: allDone ? "#6DBA95" : "var(--m3-primary)" }}
          animate={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* 清单项 */}
      <ul className="space-y-2">
        {CHECKLIST.map((item, i) => {
          const isChecked = checked.has(item.id);
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="m3-state flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all"
                style={{
                  background: isChecked ? "rgba(109,186,149,0.08)" : "rgba(255,255,255,0.03)",
                  borderColor: isChecked ? "rgba(109,186,149,0.3)" : "rgba(255,255,255,0.06)",
                }}
              >
                {isChecked ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-white/30" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold"
                      style={{
                        background: "var(--m3-primary-container)",
                        color: "var(--m3-on-primary-container)",
                      }}
                    >
                      {item.rule}
                    </span>
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{ color: isChecked ? "#6DBA95" : "rgba(255,255,255,0.9)" }}
                    >
                      {item.check}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10.5px] leading-relaxed text-white/40">
                    {item.how}
                  </p>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ============ 踩坑记录 ============ */

const BUG_SEV = {
  critical: { color: "#FF6B6B", label: "致命", icon: AlertOctagon },
  high: { color: "#FFB870", label: "高危", icon: AlertTriangle },
  medium: { color: "#FCD34D", label: "中危", icon: Zap },
};

function BugRecords() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {BUG_RECORDS.map((bug, i) => (
        <BugCard key={bug.id} bug={bug} index={i} />
      ))}
    </div>
  );
}

function BugCard({ bug, index }: { bug: BugRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = BUG_SEV[bug.severity];
  const SevIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06 }}
      className="glass-card overflow-hidden rounded-2xl"
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${cfg.color}1a`, color: cfg.color }}
        >
          <Bug className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
              style={{ background: `${cfg.color}1a`, color: cfg.color }}
            >
              #{bug.id}
            </span>
            <span
              className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
              style={{ background: `${cfg.color}14`, color: cfg.color }}
            >
              <SevIcon className="h-2.5 w-2.5" />
              {cfg.label}
            </span>
          </div>
          <h3 className="mt-1.5 text-[13px] font-bold leading-snug text-white">{bug.title}</h3>
        </div>
      </div>

      {/* 症状 */}
      <div className="px-4 pb-2">
        <div className="rounded-xl border border-rose-400/15 bg-rose-400/5 p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-rose-300/80">
            <AlertTriangle className="h-3 w-3" />
            症状
          </div>
          <p className="text-[11.5px] leading-relaxed text-white/60">{bug.symptom}</p>
        </div>
      </div>

      {/* 原因 */}
      <div className="px-4 pb-2">
        <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-300/80">
            <Zap className="h-3 w-3" />
            根因
          </div>
          <p className="text-[11.5px] leading-relaxed text-white/60">{bug.cause}</p>
        </div>
      </div>

      {/* 修复 */}
      <div className="px-4 pb-3">
        <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300/80">
            <CheckCircle2 className="h-3 w-3" />
            修复
          </div>
          <p className="text-[11.5px] leading-relaxed text-white/60">{bug.fix}</p>
        </div>
      </div>

      {/* 代码（可展开） */}
      {bug.code && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="m3-state flex w-full items-center justify-between rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] text-white/60"
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3" />
              修复前 / 修复后代码对比
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <CodeBlock code={bug.code} lang="kotlin" compact maxHeight={300} />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
