"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LSP_MODULES } from "@/lib/lsp-modules";

const MODULE_FEATURES: Record<string, string[]> = {
  adblocker: [
    "WebView 广告拦截", "OkHttp 请求过滤", "Hosts 黑名单", "追踪器阻断", "弹窗关闭",
    "Cookie 清理", "Intent 拦截", "重定向阻断", "DNS 劫持", "截图解锁", "摇一摇拦截",
    "自学习检测", "DOE 加密 DNS",
  ],
  privacy: [
    "Android ID 伪造", "IMEI 屏蔽", "地理位置伪造", "传感器禁用", "运营商伪造",
    "通讯录屏蔽", "设备型号伪装", "Advertising ID 清空", "剪贴板保护", "时区语言伪造",
    "安装状态伪装", "包可见性伪造",
    "隐私审计", "音视频防护", "后台活动监控", "网络泄露检测", "反指纹",
  ],
  game: [
    "帧率上限解锁 120Hz", "机型伪装 ROG", "进程优先级提升", "网络延迟优化",
    "触控采样率 240Hz", "内存调度优化", "画质选项解锁", "温控降频绕过", "分辨率伪装", "反检测隐藏",
    "内核 IO 调度", "GPU 频率锁定", "RAM 预热加速", "输入延迟优化",
  ],
  battery: [
    "WakeLock 优化", "Alarm 心跳对齐", "后台同步合并", "AppOps 限制", "JobScheduler 优化",
    "定位降频", "动画优化", "传感器优化", "蓝牙扫描节流", "后台相机阻断", "震动节流",
    "GPU governor 控制", "AppOps 后台限制", "I/O 调度优化",
  ],
  microx: [
    "防撤回消息", "朋友圈广告去除", "在线状态隐藏", "聊天界面美化", "表情包上限解锁",
    "朋友圈更新静默", "安全绕过", "隐私保护", "批量管理", "自动回复", "语音导出",
    "消息搜索增强", "自定义主题",
    "贴纸收集", "批量消息", "朋友圈清理", "深度缓存",
  ],
  vip: [
    "去广告 VIP", "会员主题解锁", "付费章节解锁", "Pro 模式", "高清画质", "云空间解锁",
    "专属字体", "去水印",
    "sqlite3 VIP 缓存", "Play Store DB",
  ],
  video: [
    "抖音去水印", "快手去水印", "小红书下载", "B 站下载", "直播流解析", "音频提取",
    "批量下载", "Shizuku 抓包",
    "系统录屏", "系统代理", "媒体扫描",
  ],
  step: [
    "步数添加", "运动轨迹模拟", "步数同步", "心率数据生成", "爬楼模拟", "睡眠数据生成",
    "ContentProvider 注入", "传感器阻断", "多 APP 同步", "历史伪造",
    "定时步数策略", "卡路里计算", "竞赛模式", "反检测混淆", "GPX 路线",
  ],
  audio: [
    "音量增强 +6dB", "Tinymix 桥接", "低音增强", "均衡器", "扬声器增强", "麦克风增强", "音质增强",
    "应用分场景音量", "耳机自动切换", "定时静音", "蓝牙设备 EQ",
  ],
  notify: [
    "通知过滤", "防撤回通知", "通知历史", "通知美化", "批量通知", "优先级覆盖",
    "静默通知", "Shizuku 命令",
    "通知折叠分组", "VIP 白名单", "定时免打扰",
  ],
  shizuku: [
    "授权请求修复", "Shizuku 授权", "Scene 隐藏", "看门狗服务", "变体检测", "列表注入", "自动授权助手",
    "深度系统扫描", "自动权限修复", "后台服务注入",
  ],
};

const METRICS: Record<string, string> = {
  adblocker: "1,206 条已拦截",
  privacy: "5 次已保护",
  game: "120Hz 已解锁",
  battery: "-5% 省电",
  microx: "3 条防撤回",
  vip: "3 项已解锁",
  video: "3 个已下载",
  step: "3,880 步",
  audio: "+6dB 增益",
  notify: "3 条已静音",
  shizuku: "1 已修复",
};

const COLORS: Record<string, string> = {
  adblocker: "#6DBA95",
  privacy: "#4DD9DD",
  game: "#FFB870",
  battery: "#C6D660",
  microx: "#F0AAD6",
  vip: "#FFD87A",
  video: "#F08AD6",
  step: "#45D6D2",
  audio: "#FF8A80",
  notify: "#E0B68A",
  shizuku: "#7DCFA0",
};

export function ModuleShowcase() {
  const modules = useMemo(() =>
    LSP_MODULES.map((m) => ({
      id: m.id,
      name: m.name,
      nameEn: m.nameEn,
      pkg: m.pkg,
      icon: m.icon,
      desc: m.desc,
      targets: m.targets,
      features: MODULE_FEATURES[m.id] ?? [],
      metric: METRICS[m.id] ?? "",
      color: COLORS[m.id] ?? "",
    })),
  []);

  const [active, setActive] = useState(modules[0]);

  return (
    <section id="modules" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-300">
          <Shield className="h-3 w-3" />
          模块市场
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          11 个免 Root 模块
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] text-white/55">
          覆盖广告 / 隐私 / 游戏 / 省电 / 社交 / 视频 / 运动 / 音频 / 通知全场景
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 左：模块网格 */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {modules.map((m, i) => {
              const Icon = m.icon;
              const isActive = m.id === active.id;
              return (
                <motion.button
                  key={m.id}
                  onClick={() => setActive(m)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="m3-state glass-card flex flex-col items-start gap-2 rounded-2xl p-3.5 text-left transition-all"
                  style={{
                    borderColor: isActive ? m.color : undefined,
                    background: isActive ? `${m.color}15` : undefined,
                  }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: `${m.color}1a`, color: m.color }}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-bold text-white/90">{m.name}</div>
                    <div className="truncate font-mono text-[9px] text-white/40">{m.nameEn}</div>
                  </div>
                  {isActive && (
                    <motion.span
                      layoutId="mod-active"
                      className="h-1 w-8 rounded-full"
                      style={{ background: m.color }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 右：详情 */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card sticky top-24 rounded-3xl p-5"
              style={{ borderColor: `${active.color}40` }}
            >
              {/* 头部 */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: active.color, color: "#000" }}
                >
                  <active.icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-white">{active.name}</h3>
                  <div className="font-mono text-[10px] text-white/45">{active.pkg}</div>
                </div>
              </div>

              {/* 描述 */}
              <p className="mb-4 text-[12.5px] leading-relaxed text-white/60">{active.desc}</p>

              {/* 指标 */}
              <div
                className="mb-4 rounded-2xl border p-3"
                style={{ background: `${active.color}10`, borderColor: `${active.color}30` }}
              >
                <div className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: active.color }}>
                  实时指标
                </div>
                <div className="mt-0.5 text-[16px] font-bold text-white/90">{active.metric}</div>
              </div>

              {/* 功能列表 */}
              <div className="mb-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-white/40">
                  功能 ({active.features.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.features.map((f, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-[10px] text-white/65"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/module/${active.id}`}
                className="m3-state mb-4 inline-flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-[11px] text-white/50 transition-colors hover:text-white"
              >
                详情 <ArrowRight className="h-3 w-3" />
              </Link>

              {/* 目标 APP */}
              <div>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-white/40">
                  注入目标
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.targets.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
                      style={{ background: `${active.color}15`, color: active.color }}
                    >
                      <Check className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* 铁律验证 */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-3">
                {["铁律1", "铁律2", "铁律3"].map((r) => (
                  <div key={r} className="flex items-center justify-center gap-1 rounded-lg bg-emerald-400/8 py-1.5 text-[10px] text-emerald-300">
                    <Check className="h-2.5 w-2.5" />
                    {r}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
