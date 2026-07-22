"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, ArrowRight, Ban, Check, Zap, ShieldAlert } from "lucide-react";
import { IRON_RULES, type IronRule } from "@/lib/fix-data";
import { CodeBlock } from "./CodeBlock";

const SEVERITY_CFG = {
  critical: { color: "#FF6B6B", label: "致命", icon: AlertOctagon },
  high: { color: "#FFB870", label: "高危", icon: ShieldAlert },
  medium: { color: "#FCD34D", label: "中危", icon: Zap },
};

export function IronRules() {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">三大铁律</h2>
        <p className="mt-2 text-[13px] text-white/50">
          LSPatch 集成模式下，违反任一铁律都会导致类加载阶段秒崩——还没到 handleLoadPackage 就 NoClassDefFoundError
        </p>
      </div>

      {IRON_RULES.map((rule, i) => (
        <IronRuleCard key={rule.id} rule={rule} index={i} />
      ))}
    </div>
  );
}

function IronRuleCard({ rule, index }: { rule: IronRule; index: number }) {
  const [showCode, setShowCode] = useState(false);
  const cfg = SEVERITY_CFG[rule.severity];
  const SevIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card overflow-hidden rounded-3xl"
    >
      {/* 头部 */}
      <div className="flex items-start gap-3 border-b border-white/8 p-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
          style={{ background: `${cfg.color}22`, color: cfg.color }}
        >
          {rule.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-bold text-white">{rule.title}</h3>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
              style={{ background: `${cfg.color}1a`, color: cfg.color }}
            >
              <SevIcon className="h-2.5 w-2.5" />
              {cfg.label}
            </span>
            <span className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[9px] font-medium text-white/50">
              {rule.short}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-white/55">{rule.reason}</p>
        </div>
      </div>

      {/* 展开/收起 */}
      <div className="p-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="m3-state flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-[12px] font-medium text-white/75 transition-colors hover:text-white"
        >
          {showCode ? "收起代码对比" : "查看 ❌ 修复前 vs ✅ 修复后"}
          <ArrowRight className={`h-3.5 w-3.5 transition-transform ${showCode ? "rotate-90" : ""}`} />
        </button>

        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2"
          >
            {/* 修复前 */}
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Ban className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-[11px] font-semibold text-rose-400">修复前 · 违反铁律</span>
              </div>
              <CodeBlock code={rule.wrongCode} lang={rule.wrongLang} compact maxHeight={360} />
            </div>
            {/* 修复后 */}
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">修复后 · 符合铁律</span>
              </div>
              <CodeBlock code={rule.rightCode} lang={rule.rightLang} compact maxHeight={360} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
