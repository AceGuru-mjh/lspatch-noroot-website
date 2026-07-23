"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Gamepad2, BatteryCharging, MessageCircle, Crown, Video, Footprints, Volume2, Bell, Plug, Check, X } from "lucide-react";

interface ShowcaseModule {
  id: string;
  name: string;
  nameEn: string;
  pkg: string;
  icon: typeof Shield;
  desc: string;
  targets: string[];
  features: string[];
  metric: string;
  color: string;
}

const MODULES: ShowcaseModule[] = [
  {
    id: "adblocker", name: "广告拦截", nameEn: "AdBlockerX_NoRoot", pkg: "com.adblockerx.noroot",
    icon: Shield, desc: "拦截 WebView / OkHttp 黑名单广告、开屏弹窗、追踪器",
    targets: ["浏览器", "资讯 APP", "电商 APP"],
    features: ["WebView 广告拦截", "OkHttp 请求过滤", "Hosts 黑名单", "追踪器阻断", "弹窗关闭", "Cookie 清理", "Intent 拦截", "重定向阻断", "DNS 劫持", "截图解锁", "摇一摇拦截"],
    metric: "1,206 条已拦截", color: "#6DBA95",
  },
  {
    id: "privacy", name: "隐私保护", nameEn: "PrivacyGuard_NoRoot", pkg: "com.privacyguard.noroot",
    icon: Lock, desc: "伪造设备 ID / IMEI / 地理位置 / 传感器，阻断追踪",
    targets: ["全部 APP"],
    features: ["Android ID 伪造", "IMEI 屏蔽", "地理位置伪造", "传感器禁用", "运营商伪造", "通讯录屏蔽", "设备型号伪装", "Advertising ID 清空", "剪贴板保护", "时区语言伪造", "安装状态伪装", "包可见性伪造"],
    metric: "5 次已保护", color: "#4DD9DD",
  },
  {
    id: "game", name: "游戏加速", nameEn: "GameUnlockerPro_NoRoot", pkg: "com.gameunlocker.noroot",
    icon: Gamepad2, desc: "解锁帧率 / 伪装机型 / 提升触控采样率 / 降低延迟",
    targets: ["游戏 APP"],
    features: ["帧率上限解锁 120Hz", "机型伪装 ROG", "进程优先级提升", "网络延迟优化", "触控采样率 240Hz", "内存调度优化", "画质选项解锁", "温控降频绕过", "分辨率伪装", "反检测隐藏"],
    metric: "120Hz 已解锁", color: "#FFB870",
  },
  {
    id: "battery", name: "省电优化", nameEn: "BatteryOptimizer_NoRoot", pkg: "com.batteryopt.noroot",
    icon: BatteryCharging, desc: "优化 WakeLock / Alarm / JobScheduler，冻结后台",
    targets: ["系统 / 后台 APP"],
    features: ["WakeLock 优化", "Alarm 心跳对齐", "后台同步合并", "AppOps 限制", "JobScheduler 优化", "定位降频", "动画优化", "传感器优化", "蓝牙扫描节流", "后台相机阻断", "震动节流"],
    metric: "-5% 省电", color: "#C6D660",
  },
  {
    id: "microx", name: "微信增强", nameEn: "MicroXEnhancer", pkg: "com.microx.enhancer",
    icon: MessageCircle, desc: "防撤回 / 去朋友圈广告 / 美化 / 隐藏在线状态",
    targets: ["微信", "QQ"],
    features: ["防撤回消息", "朋友圈广告去除", "在线状态隐藏", "聊天界面美化", "表情包上限解锁", "朋友圈更新静默", "安全绕过", "隐私保护", "批量管理", "自动回复", "语音导出", "消息搜索增强", "自定义主题"],
    metric: "3 条防撤回", color: "#F0AAD6",
  },
  {
    id: "vip", name: "VIP 解锁", nameEn: "VipUnlocker_NoRoot", pkg: "com.vipunlocker.noroot",
    icon: Crown, desc: "解锁去广告 / 会员主题 / 付费章节 / Pro 模式",
    targets: ["视频 / 工具 / 阅读 APP"],
    features: ["去广告 VIP", "会员主题解锁", "付费章节解锁", "Pro 模式", "高清画质", "云空间解锁", "专属字体", "去水印"],
    metric: "3 项已解锁", color: "#FFD87A",
  },
  {
    id: "video", name: "视频下载", nameEn: "VideoSaver_NoRoot", pkg: "com.videosaver.noroot",
    icon: Video, desc: "解析抖音 / 快手 / 小红书视频链接，去水印下载",
    targets: ["短视频 APP"],
    features: ["抖音去水印", "快手去水印", "小红书下载", "B 站下载", "直播流解析", "音频提取", "批量下载", "Shizuku 抓包"],
    metric: "3 个已下载", color: "#F08AD6",
  },
  {
    id: "step", name: "步数修改", nameEn: "StepModifier_NoRoot", pkg: "com.stepmod.noroot",
    icon: Footprints, desc: "添加步数 / 模拟轨迹 / 生成心率与睡眠数据",
    targets: ["运动健康 APP"],
    features: ["步数添加", "运动轨迹模拟", "步数同步", "心率数据生成", "爬楼模拟", "睡眠数据生成", "ContentProvider 注入", "传感器阻断", "多 APP 同步", "历史伪造"],
    metric: "3,880 步", color: "#45D6D2",
  },
  {
    id: "audio", name: "音量增强", nameEn: "AudioBoost_NoRoot", pkg: "com.audioboost.noroot",
    icon: Volume2, desc: "突破音量上限 / 均衡器 / 降噪 / Hi-Fi 通道",
    targets: ["音乐 / 视频 APP"],
    features: ["音量增强 +6dB", "Tinymix 桥接", "低音增强", "均衡器", "扬声器增强", "麦克风增强", "音质增强"],
    metric: "+6dB 增益", color: "#FF8A80",
  },
  {
    id: "notify", name: "通知管理", nameEn: "NotifyMaster_NoRoot", pkg: "com.notifymaster.noroot",
    icon: Bell, desc: "静音 / 合并 / 拦截营销 / 延迟 / 分类通知",
    targets: ["系统通知"],
    features: ["通知过滤", "防撤回通知", "通知历史", "通知美化", "批量通知", "优先级覆盖", "静默通知", "Shizuku 命令"],
    metric: "3 条已静音", color: "#E0B68A",
  },
  {
    id: "shizuku", name: "Shizuku 修复", nameEn: "ShizukuSceneFix", pkg: "com.mjh.shizukufix",
    icon: Plug, desc: "修复 Scene 工具箱在 Shizuku 授权列表不显示",
    targets: ["Shizuku / Scene"],
    features: ["授权请求修复", "Shizuku 授权", "Scene 隐藏", "看门狗服务", "变体检测", "列表注入", "自动授权助手"],
    metric: "1 已修复", color: "#7DCFA0",
  },
];

export function ModuleShowcase() {
  const [active, setActive] = useState<ShowcaseModule>(MODULES[0]);

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
            {MODULES.map((m, i) => {
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
