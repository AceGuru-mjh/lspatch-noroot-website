"use client";

import { Search, Bell, Home, Compass, MessageSquare, User, Shield } from "lucide-react";
import { useLspStore } from "@/lib/lsp-store";

interface FeedPost {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  text: string;
  hasImage: boolean;
  color: string;
  time: string;
}

interface FeedAd {
  id: number;
  title: string;
  tag: string;
  host: string;
  color: string;
}

const POSTS: (FeedPost | FeedAd)[] = [
  { id: 1, name: "数码老张", handle: "@tech_zhang", avatar: "数", text: "今天终于把 LSPatch 模块跑通了，免 Root 注入 Xposed 太香了，毛玻璃悬浮球效果满分 ☕", hasImage: false, color: "#6DBA95", time: "3 分钟前" } as FeedPost,
  { id: 2, title: "限时特惠 · iPhone 16 Pro 直降 2000", tag: "广告", host: "ad.doubleclick.net/banner", color: "#FFB870" } as FeedAd,
  { id: 3, name: "户外阿杰", handle: "@outdoor_jie", avatar: "户", text: "周末爬了莫干山，山顶云海太治愈了，强烈推荐这条路线 🏔️", hasImage: true, color: "#45D6D2", time: "18 分钟前" } as FeedPost,
  { id: 4, name: "Kotlin 笔记", handle: "@kotlin_dev", avatar: "K", text: "协程的 8 个最佳实践：① 用 suspend 而非 callback ② structured concurrency ③ Dispatchers.IO 别滥用…", hasImage: false, color: "#F0AAD6", time: "32 分钟前" } as FeedPost,
  { id: 5, title: "游戏福利 · 充值返利 50%", tag: "广告", host: "cdn.popupads.net/native/feed", color: "#F08AD6" } as FeedAd,
  { id: 6, name: "读书的小满", handle: "@reader_xm", avatar: "读", text: "推荐《深入理解 Android 内核》——从 init 到 Zygote，再到 LSPatch 的注入原理，讲得非常透彻 📚", hasImage: false, color: "#FFD87A", time: "1 小时前" } as FeedPost,
  { id: 7, title: "贷款秒批 · 最高 50 万", tag: "广告", host: "splash.admob.com/preroll", color: "#FF8A80" } as FeedAd,
];

function isAd(p: FeedPost | FeedAd): p is FeedAd {
  return (p as FeedAd).tag !== undefined;
}

export function HostApp() {
  const adblockerOn = useLspStore((s) => s.modules.adblocker.enabled);
  const activeId = useLspStore((s) => s.activeModuleId);
  const blockedCount = useLspStore((s) => s.modules.adblocker.metrics.blocked ?? 0);

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* 状态栏 */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium text-white/90">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
            <path d="M1 9h2v1H1zM4 7h2v3H4zM7 5h2v5H7zM10 3h2v7h-2zM13 1h2v9h-2z" fill="currentColor" />
          </svg>
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M7 2.5c1.93 0 3.68.78 4.95 2.05l1.06-1.06A8.48 8.48 0 007 .5 8.48 8.48 0 00.99 3.49L2.05 4.55A6.98 6.98 0 017 2.5z" fill="currentColor" />
            <path d="M7 5.5c1.1 0 2.1.45 2.83 1.17l1.06-1.06A5.48 5.48 0 007 4a5.48 5.48 0 00-3.89 1.61l1.06 1.06A3.98 3.98 0 017 5.5z" fill="currentColor" />
            <circle cx="7" cy="9" r="1.5" fill="currentColor" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="relative h-[10px] w-[22px] rounded-[3px] border border-white/70">
              <div className="absolute inset-[1px] right-[2px] rounded-[1px] bg-white/90" style={{ width: "70%" }} />
            </div>
            <div className="h-[4px] w-[1.5px] rounded-r bg-white/70" />
          </div>
        </div>
      </div>

      {/* App 顶栏 */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: "var(--m3-primary-container)", color: "var(--m3-on-primary-container)" }}
          >
            资
          </div>
          <span className="text-[15px] font-semibold tracking-tight">今日资讯</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="m3-state flex h-8 w-8 items-center justify-center rounded-full text-white/80">
            <Search className="h-4 w-4" />
          </button>
          <button className="m3-state relative flex h-8 w-8 items-center justify-center rounded-full text-white/80">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="lsp-scroll flex-1 overflow-y-auto px-3 pb-20">
        {POSTS.map((item) =>
          isAd(item) ? (
            <AdSlot key={item.id} ad={item} blocked={adblockerOn} />
          ) : (
            <PostCard key={item.id} post={item} />
          )
        )}

        {/* 模块提示条 */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-[11px] text-white/55">
          <Shield className="h-3.5 w-3.5" style={{ color: "var(--m3-primary)" }} />
          <span>
            LSPatch 已注入当前进程 · 活跃模块：
            <span className="font-medium text-white/80">{activeId}</span>
            {activeId === "adblocker" && (
              <>
                {" "}· 累计拦截 <span className="font-semibold" style={{ color: "var(--m3-primary)" }}>{blockedCount.toLocaleString()}</span> 条
              </>
            )}
          </span>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/8 bg-black/40 px-2 pb-5 pt-2 backdrop-blur-xl">
        {[
          { icon: Home, label: "首页", active: true },
          { icon: Compass, label: "发现" },
          { icon: MessageSquare, label: "消息" },
          { icon: User, label: "我的" },
        ].map((tab) => (
          <button
            key={tab.label}
            className="m3-state flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1"
            style={{ color: tab.active ? "var(--m3-primary)" : "rgba(255,255,255,0.5)" }}
          >
            <tab.icon className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  return (
    <div className="mb-3 rounded-2xl border border-white/8 bg-white/5 p-3.5 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold text-white"
          style={{ background: post.color }}
        >
          {post.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold">{post.name}</span>
            <span className="text-[10px] text-white/40">{post.handle}</span>
          </div>
          <span className="text-[10px] text-white/40">{post.time}</span>
        </div>
      </div>
      <p className="text-[12.5px] leading-relaxed text-white/85">{post.text}</p>
      {post.hasImage && (
        <div
          className="mt-2.5 h-28 w-full rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${post.color}55, ${post.color}22), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 8px, transparent 8px 16px)`,
          }}
        />
      )}
      <div className="mt-2.5 flex items-center gap-4 text-[11px] text-white/40">
        <span>♥ 128</span>
        <span>💬 23</span>
        <span>↗ 分享</span>
      </div>
    </div>
  );
}

function AdSlot({ ad, blocked }: { ad: FeedAd; blocked: boolean }) {
  return (
    <div className="relative mb-3 overflow-hidden rounded-2xl border border-white/8">
      {/* 原广告内容 */}
      <div
        className="relative p-3.5 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${ad.color}30, ${ad.color}10)`,
          opacity: blocked ? 0.18 : 1,
          filter: blocked ? "blur(1.5px) grayscale(0.6)" : "none",
        }}
      >
        <div className="mb-1 inline-block rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-medium text-white/60">
          {ad.tag}
        </div>
        <p className="text-[12.5px] font-medium text-white/90">{ad.title}</p>
        <p className="mt-0.5 text-[10px] text-white/40">{ad.host}</p>
        <div
          className="mt-2 h-12 w-full rounded-lg"
          style={{ background: `linear-gradient(90deg, ${ad.color}40, transparent)` }}
        />
      </div>

      {/* 拦截遮罩 */}
      {blocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/55 backdrop-blur-[2px]">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
            <Shield className="h-3 w-3" style={{ color: "var(--m3-primary)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--m3-primary)" }}>
              已拦截
            </span>
          </div>
          <span className="text-[9px] text-white/50">{ad.host}</span>
        </div>
      )}
    </div>
  );
}
