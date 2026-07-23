"use client";

import { Github, Heart, ExternalLink, ArrowUp } from "lucide-react";

export function SiteFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-auto border-t border-white/8 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* 主体 */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* 品牌 */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-bold tracking-tight">LSPatch NoRoot</div>
                <div className="text-[10px] text-white/45">免 Root Xposed 模块合集</div>
              </div>
            </div>
            <p className="mt-3 max-w-md text-[11.5px] leading-relaxed text-white/45">
              基于 LSPatch 框架的 11 个免 Root 模块，Material 3 毛玻璃悬浮球，
              三大铁律级架构健壮性，ContentProvider 安全 IPC。开源免费。
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle"
                target="_blank"
                rel="noopener noreferrer"
                className="m3-state flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/AceGuru-mjh"
                target="_blank"
                rel="noopener noreferrer"
                className="m3-state flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[11px] text-white/60 transition-colors hover:text-white"
              >
                @AceGuru-mjh
              </a>
            </div>
          </div>

          {/* 链接组 1 */}
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/40">模块</div>
            <ul className="space-y-2 text-[11.5px]">
              {["广告拦截", "隐私保护", "游戏加速", "微信增强", "VIP 解锁"].map((l) => (
                <li key={l}>
                  <a href="#modules" className="text-white/55 transition-colors hover:text-emerald-300">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 链接组 2 */}
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/40">资源</div>
            <ul className="space-y-2 text-[11.5px]">
              <li><a href="#download" className="text-white/55 transition-colors hover:text-emerald-300">下载 v1.0.13</a></li>
              <li><a href="#rules" className="text-white/55 transition-colors hover:text-emerald-300">三大铁律</a></li>
              <li><a href="#preview" className="text-white/55 transition-colors hover:text-emerald-300">悬浮球 Demo</a></li>
              <li><a href="#faq" className="text-white/55 transition-colors hover:text-emerald-300">FAQ</a></li>
              <li>
                <a
                  href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white/55 transition-colors hover:text-emerald-300"
                >
                  Releases <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <span>© 2026 LSPatch NoRoot</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-rose-400" /> by MJH
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/40">Material 3 · Next.js 16 · Tailwind 4</span>
            <button
              onClick={scrollToTop}
              className="m3-state flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:text-white"
              aria-label="返回顶部"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
