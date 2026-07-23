"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Download, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "#features", label: "特性" },
  { href: "#modules", label: "模块" },
  { href: "#rules", label: "铁律" },
  { href: "#preview", label: "Demo" },
  { href: "#v1013", label: "v1.0.13" },
  { href: "#download", label: "下载" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-neutral-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
              <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-bold tracking-tight">LSPatch NoRoot</div>
            <div className="text-[9.5px] text-white/45">11 模块 · v1.0.13</div>
          </div>
        </a>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="m3-state rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* 右侧按钮 */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle"
            target="_blank"
            rel="noopener noreferrer"
            className="m3-state hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 sm:flex"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="#download"
            className="m3-state flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-[12px] font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">下载</span>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="m3-state flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/8 bg-neutral-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-1 p-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="m3-state rounded-lg px-3 py-2 text-[12.5px] font-medium text-white/70"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
