"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { getModule, paletteToCssVars } from "@/lib/lsp-modules";
import {
  ArrowLeft,
  Shield,
  Github,
  Download,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

const IRON_RULES_CHECK = [
  { id: 1, label: "不引用 R 类", pass: true },
  { id: 2, label: "不引用宿主资源", pass: true },
  { id: 3, label: "不使用 Application 上下文", pass: true },
];

export default function ModuleDetailPage() {
  const params = useParams();
  const mod = getModule(params.id as string);

  if (!mod) {
    notFound();
  }

  const Icon = mod.icon;

  return (
    <div
      className="m3-scope relative min-h-screen bg-neutral-950 text-white"
      style={paletteToCssVars(mod.palette) as React.CSSProperties}
    >
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10 opacity-40" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="m3-state mb-8 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[12px] text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回首页
        </Link>

        {/* Hero */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20"
              style={{ background: mod.palette.primary, color: "#000" }}
            >
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {mod.name}
              </h1>
              <p className="mt-0.5 font-mono text-[11px] text-white/40">
                {mod.pkg}
              </p>
              <p className="mt-1 text-[13px] text-white/55">{mod.desc}</p>
            </div>
          </div>
        </div>

        {/* Metrics + Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className="rounded-2xl border p-4"
            style={{
              background: `${mod.palette.primary}10`,
              borderColor: `${mod.palette.primary}30`,
            }}
          >
            <div
              className="mb-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ color: mod.palette.primary }}
            >
              实时指标
            </div>
            <div className="text-xl font-bold text-white/90">
              {mod.metric.prefix ?? ""}0{mod.metric.suffix ?? ""}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://github.com/AceGuru-mjh/LSPatch-Noroot-modle/tree/main/${mod.nameEn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-state flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
              源码
            </a>
            <button className="m3-state flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-[13px] font-medium text-white/80 transition-colors hover:text-white">
              <Download className="h-4 w-4" />
              下载 APK
            </button>
          </div>
        </div>

        {/* Feature tags */}
        <div className="mb-8">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-white/40">
            功能特性 ({mod.features.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {mod.features.map((f, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-[12px] text-white/65"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Target apps */}
        <div className="mb-8">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-white/40">
            注入目标
          </h2>
          <div className="flex flex-wrap gap-2">
            {mod.targets.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
                style={{
                  background: `${mod.palette.primary}15`,
                  color: mod.palette.primary,
                }}
              >
                <Check className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Technical details */}
        <div className="mb-8">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-white/40">
            技术详情
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] text-white/40">包名</div>
              <div className="mt-0.5 truncate font-mono text-[11px] text-white/70">
                {mod.pkg}
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] text-white/40">Hook 点</div>
              <div className="mt-0.5 font-mono text-[11px] text-white/70">
                {mod.id === "adblocker"
                  ? 18
                  : mod.id === "privacy"
                    ? 22
                    : mod.id === "game"
                      ? 14
                      : mod.id === "battery"
                        ? 16
                        : mod.id === "microx"
                          ? 20
                          : mod.id === "vip"
                            ? 12
                            : mod.id === "video"
                              ? 10
                              : mod.id === "step"
                                ? 14
                                : mod.id === "audio"
                                  ? 9
                                  : mod.id === "notify"
                                    ? 10
                                    : 8}
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] text-white/40">功能项</div>
              <div className="mt-0.5 font-mono text-[11px] text-white/70">
                {mod.features.length}
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="text-[10px] text-white/40">目标应用</div>
              <div className="mt-0.5 font-mono text-[11px] text-white/70">
                {mod.targets.length}
              </div>
            </div>
          </div>
        </div>

        {/* Three Iron Rules compliance */}
        <div className="mb-8">
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-white/40">
            三大铁律合规
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {IRON_RULES_CHECK.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center gap-2 rounded-xl border px-4 py-3"
                style={{
                  borderColor: rule.pass
                    ? "rgba(52,211,153,0.3)"
                    : "rgba(251,113,133,0.3)",
                  background: rule.pass
                    ? "rgba(52,211,153,0.06)"
                    : "rgba(251,113,133,0.06)",
                }}
              >
                {rule.pass ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-rose-400" />
                )}
                <span
                  className="text-[12px] font-medium"
                  style={{
                    color: rule.pass ? "#6EE7B7" : "#FDA4AF",
                  }}
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
