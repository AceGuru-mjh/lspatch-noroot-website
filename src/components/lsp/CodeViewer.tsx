"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, CheckCircle2 } from "lucide-react";
import { CORRECTED_FILES } from "@/lib/fix-data";
import { CodeBlock } from "./CodeBlock";

export function CodeViewer() {
  const [activeId, setActiveId] = useState(CORRECTED_FILES[0].id);
  const active = CORRECTED_FILES.find((f) => f.id === activeId)!;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">修正后源码</h2>
        <p className="mt-2 text-[13px] text-white/50">
          可直接覆盖到 LSPatch-Noroot-modle 仓库对应路径 · 点击文件标签切换
        </p>
      </div>

      {/* 文件标签栏 */}
      <div className="lsp-scroll flex gap-2 overflow-x-auto pb-1">
        {CORRECTED_FILES.map((file) => {
          const isActive = file.id === activeId;
          return (
            <button
              key={file.id}
              onClick={() => setActiveId(file.id)}
              className="m3-state flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 transition-all"
              style={{
                background: isActive ? "var(--m3-primary-container)" : "rgba(255,255,255,0.04)",
                borderColor: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
              }}
            >
              <FileCode2
                className="h-3.5 w-3.5"
                style={{ color: isActive ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.5)" }}
              />
              <span
                className="text-[11.5px] font-semibold whitespace-nowrap"
                style={{ color: isActive ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.7)" }}
              >
                {file.name}
              </span>
              {isActive && <CheckCircle2 className="h-3 w-3" style={{ color: "var(--m3-primary)" }} />}
            </button>
          );
        })}
      </div>

      {/* 当前文件描述 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
            <span className="font-mono text-[11px] text-white/50">{active.path}</span>
            <span className="text-white/20">·</span>
            <span className="text-[11px] text-white/60">{active.desc}</span>
          </div>

          <CodeBlock code={active.code} lang={active.lang} fileName={active.path} maxHeight={560} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
