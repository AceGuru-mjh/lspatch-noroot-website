/**
 * LSPatch NoRoot 模块数据定义
 * 对应 GitHub: AceGuru-mjh/LSPatch-Noroot-modle (11 个模块)
 * 每个模块含：M3 tonal 配色 / 图标 / 目标 APP / 最小化指标 / 日志生成器
 */

import {
  Shield,
  Lock,
  Gamepad2,
  BatteryCharging,
  MessageCircle,
  Crown,
  Video,
  Footprints,
  Volume2,
  Bell,
  Plug,
  type LucideIcon,
} from "lucide-react";

export type LogLevel = "block" | "info" | "success" | "warn";

export interface LspLog {
  id: string;
  ts: number;
  level: LogLevel;
  message: string;
  target?: string;
}

export interface ModulePalette {
  /** M3 primary (tone 80 dark mode) */
  primary: string;
  /** M3 primary-container (tone 30) */
  primaryContainer: string;
  /** M3 on-primary-container (tone 90) */
  onPrimaryContainer: string;
  /** secondary container (tone 30) */
  secondaryContainer: string;
  /** glow color (rgba) */
  glow: string;
  glowStrong: string;
}

export interface LspModule {
  id: string;
  name: string;
  nameEn: string;
  pkg: string;
  icon: LucideIcon;
  desc: string;
  features: string[];
  targets: string[];
  /** 最小化悬浮球显示的指标 */
  metric: {
    label: string;
    /** store 中的字段名，用于取值 */
    field: "blocked" | "protected" | "fps" | "savedPct" | "recall" | "unlocked" | "video" | "steps" | "db" | "muted" | "fixed";
    suffix?: string;
    prefix?: string;
    /** 是否为累计计数（带千分位） */
    isCount?: boolean;
  };
  /** 日志生成间隔（ms）— 随机区间 */
  interval: [number, number];
  palette: ModulePalette;
  /** 生成一条日志 */
  genLog: () => Omit<LspLog, "id" | "ts">;
}

/* ---------- 日志素材库 ---------- */

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const adHosts = [
  "ad.doubleclick.net",
  "googleads.g.doubleclick.net",
  "cdn.popupads.net",
  "splash.admob.com",
  "feed.adsensor.cn",
  "banner.admixer.net",
  "track.appsflyer.com",
  "log.umeng.com",
  "api.flurry.com",
  "adservice.google.com",
];
const adPaths = [
  "/banner/300x250",
  "/interstitial/show",
  "/splash/start",
  "/native/feed",
  "/popup/force",
  "/reward/video",
  "/collect/tracker",
  "/log/event",
  "/feed/ad_slot",
  "/preroll/video",
];
const adApps = ["com.ss.android.article", "com.tencent.news", "com.xunmeng.pinduoduo", "com.taobao.taobao", "com.smile.gifmaker"];

const privacyActions = [
  { m: "已伪造 Android ID", t: "a1b2c3d4e5f6g7h8" },
  { m: "已屏蔽 IMEI 读取", t: "com.target.app" },
  { m: "已伪造地理位置", t: "39.9042, 116.4074 → 31.2304, 121.4737" },
  { m: "已禁用传感器访问", t: "加速度计 / 陀螺仪" },
  { m: "已伪造运营商信息", t: "中国移动 → Unknown" },
  { m: "已屏蔽通讯录读取", t: "com.target.app" },
  { m: "已伪造设备型号", t: "Pixel 8 Pro → SM-G9910" },
  { m: "已清空 Advertising ID", t: "00000000-0000-0000-0000-000000000000" },
  { m: "已屏蔽剪贴板读取", t: "com.target.app" },
  { m: "已伪造时区 / 语言", t: "Asia/Shanghai → UTC" },
];

const gameActions = [
  { m: "已解锁帧率上限", t: "60Hz → 120Hz" },
  { m: "已伪装机型", t: "ASUS ROG Phone 8 Pro" },
  { m: "已提升进程优先级", t: "Foreground · 高" },
  { m: "已降低网络延迟", t: "RTT -23ms" },
  { m: "已提升触控采样率", t: "240Hz" },
  { m: "已优化内存调度", t: "释放 312MB" },
  { m: "已解锁画质选项", t: "极致 · 120fps" },
  { m: "已绕过温控降频", t: "CPU 大核 2.84GHz" },
];

const batteryActions = [
  { m: "已优化 WakeLock", t: "释放持有时长 1.2s" },
  { m: "已合并 JobScheduler", t: "8 个任务 → 3 个" },
  { m: "已限制后台唤醒", t: "com.app.push" },
  { m: "已对齐心跳 Alarm", t: "合并 4 次" },
  { m: "已冻结后台进程", t: "com.app.bg" },
  { m: "已抑制定位请求", t: "降频至 5min/次" },
  { m: "已优化网络保活", t: "TCP keepalive 60s → 600s" },
];

const microxActions = [
  { m: "已拦截撤回消息", t: "群聊「技术交流」· 张三" },
  { m: "已去除朋友圈广告", t: "第 3 条" },
  { m: "已防撤回", t: "好友 李四" },
  { m: "已隐藏在线状态", t: " stealth 模式" },
  { m: "已美化聊天界面", t: "启用毛玻璃气泡" },
  { m: "已解锁表情包上限", t: "999+" },
  { m: "已禁用朋友圈更新提醒", t: "静默 2h" },
];

const vipActions = [
  { m: "已解锁去广告 VIP", t: "com.video.app" },
  { m: "已解锁会员主题", t: "主题商店 · 全部" },
  { m: "已解锁付费章节", t: "第 128 章" },
  { m: "已解锁 Pro 模式", t: "com.tool.app" },
  { m: "已解锁高清画质", t: "4K HDR" },
  { m: "已解锁云空间", t: "2TB" },
  { m: "已解锁专属字体", t: "手写体 · 隶书" },
];

const videoActions = [
  { m: "已解析视频链接", t: "抖音 · 7345****" },
  { m: "已去除水印", t: "快手 · video.kuaishou.com" },
  { m: "已缓存视频", t: "小红书 · 1080P · 23MB" },
  { m: "已提取音频", t: "MP3 · 3.2MB · 128kbps" },
  { m: "已批量下载", t: "B站 · 收藏夹 12 项" },
  { m: "已解析直播流", t: "HLS · 1080P60" },
];

const stepActions = [
  { m: "已添加步数", t: "+1,250 步" },
  { m: "已模拟运动轨迹", t: "2.3km · 慢跑" },
  { m: "已同步步数", t: "8,432 → 9,682" },
  { m: "已生成心率数据", t: "78 bpm · 正常" },
  { m: "已模拟爬楼", t: "12 层" },
  { m: "已生成睡眠数据", t: "7h22m · 深睡 2h" },
];

const audioActions = [
  { m: "已增强音量", t: "+6dB" },
  { m: "已启用均衡器", t: "低音增强 · +4" },
  { m: "已绕过音量限制", t: "100% → 150%" },
  { m: "已切换音频通道", t: "Hi-Fi · 96kHz/24bit" },
  { m: "已开启降噪", t: "-12dB · 环境" },
  { m: "已增强人声", t: "+3dB · 中频" },
];

const notifyActions = [
  { m: "已静音通知", t: "com.app.push" },
  { m: "已合并通知", t: "8 → 1" },
  { m: "已拦截营销推送", t: "双 11 大促" },
  { m: "已延迟通知", t: "30 分钟" },
  { m: "已分类通知", t: "社交 → 优先" },
  { m: "已聚合通知", t: "微信 · 12 条" },
];

const shizukuActions = [
  { m: "已修复 Scene 授权列表", t: "刷新 IPC binder" },
  { m: "已注册 Shizuku 服务", t: "rikka.shizuku.provider" },
  { m: "已建立 IPC 通道", t: "pingBinder OK" },
  { m: "已检测 Shizuku 运行", t: "v13.1 · 已授权" },
  { m: "已同步权限缓存", t: "API_V23 ✓" },
];

/* ---------- 模块定义 ---------- */

export const LSP_MODULES: LspModule[] = [
  {
    id: "adblocker",
    name: "广告拦截",
    nameEn: "AdBlockerX_NoRoot",
    pkg: "com.adblocker.noroot",
    icon: Shield,
    desc: "拦截 WebView / OkHttp 黑名单广告、开屏弹窗、追踪器",
    features: ["WebView 广告拦截", "OkHttp 请求过滤", "Hosts 黑名单", "追踪器阻断", "弹窗关闭", "Cookie 清理", "Intent 拦截", "重定向阻断", "DNS 劫持", "截图解锁", "摇一摇拦截"],
    targets: ["浏览器", "资讯 APP", "电商 APP"],
    metric: { label: "已拦截", field: "blocked", suffix: "条", isCount: true },
    interval: [900, 2600],
    palette: {
      primary: "#6DBA95",
      primaryContainer: "#0F3D2A",
      onPrimaryContainer: "#B5F0CE",
      secondaryContainer: "#324938",
      glow: "rgba(109, 186, 149, 0.45)",
      glowStrong: "rgba(109, 186, 149, 0.75)",
    },
    genLog: () => ({
      level: "block",
      message: `已拦截 ${pick(["横幅", "弹窗", "开屏", "追踪器", "原生", "激励视频"])}`,
      target: `${pick(adHosts)}${pick(adPaths)}`,
    }),
  },
  {
    id: "privacy",
    name: "隐私保护",
    nameEn: "PrivacyGuard_NoRoot",
    pkg: "com.privacyguard.noroot",
    icon: Lock,
    desc: "伪造设备 ID / IMEI / 地理位置 / 传感器，阻断追踪",
    features: ["Android ID 伪造", "IMEI 屏蔽", "地理位置伪造", "传感器禁用", "运营商伪造", "通讯录屏蔽", "设备型号伪装", "Advertising ID 清空", "剪贴板保护", "时区语言伪造", "安装状态伪装", "包可见性伪造"],
    targets: ["全部 APP"],
    metric: { label: "已保护", field: "protected", suffix: "次", isCount: true },
    interval: [3200, 6500],
    palette: {
      primary: "#4DD9DD",
      primaryContainer: "#003739",
      onPrimaryContainer: "#5CF1F5",
      secondaryContainer: "#1F4748",
      glow: "rgba(77, 217, 221, 0.42)",
      glowStrong: "rgba(77, 217, 221, 0.7)",
    },
    genLog: () => {
      const a = pick(privacyActions);
      return { level: "success", message: a.m, target: a.t };
    },
  },
  {
    id: "game",
    name: "游戏加速",
    nameEn: "GameUnlockerPro_NoRoot",
    pkg: "com.gameunlocker.noroot",
    icon: Gamepad2,
    desc: "解锁帧率 / 伪装机型 / 提升触控采样率 / 降低延迟",
    features: ["帧率上限解锁 120Hz", "机型伪装 ROG", "进程优先级提升", "网络延迟优化", "触控采样率 240Hz", "内存调度优化", "画质选项解锁", "温控降频绕过", "分辨率伪装", "反检测隐藏"],
    targets: ["游戏 APP"],
    metric: { label: "帧率", field: "fps", suffix: "Hz" },
    interval: [4000, 8000],
    palette: {
      primary: "#FFB870",
      primaryContainer: "#4A2800",
      onPrimaryContainer: "#FFDCBA",
      secondaryContainer: "#4A3A24",
      glow: "rgba(255, 184, 112, 0.45)",
      glowStrong: "rgba(255, 184, 112, 0.75)",
    },
    genLog: () => {
      const a = pick(gameActions);
      return { level: "info", message: a.m, target: a.t };
    },
  },
  {
    id: "battery",
    name: "省电优化",
    nameEn: "BatteryOptimizer_NoRoot",
    pkg: "com.batteryoptimizer.noroot",
    icon: BatteryCharging,
    desc: "优化 WakeLock / Alarm / JobScheduler，冻结后台",
    features: ["WakeLock 优化", "Alarm 心跳对齐", "后台同步合并", "AppOps 限制", "JobScheduler 优化", "定位降频", "动画优化", "传感器优化", "蓝牙扫描节流", "后台相机阻断", "震动节流"],
    targets: ["系统 / 后台 APP"],
    metric: { label: "省电", field: "savedPct", suffix: "%", prefix: "-" },
    interval: [3500, 7000],
    palette: {
      primary: "#C6D660",
      primaryContainer: "#364100",
      onPrimaryContainer: "#E2F07A",
      secondaryContainer: "#3C4519",
      glow: "rgba(198, 214, 96, 0.42)",
      glowStrong: "rgba(198, 214, 96, 0.72)",
    },
    genLog: () => {
      const a = pick(batteryActions);
      return { level: "success", message: a.m, target: a.t };
    },
  },
  {
    id: "microx",
    name: "微信增强",
    nameEn: "MicroXEnhancer",
    pkg: "com.microx.enhancer",
    icon: MessageCircle,
    desc: "防撤回 / 去朋友圈广告 / 美化 / 隐藏在线状态",
    features: ["防撤回消息", "朋友圈广告去除", "在线状态隐藏", "聊天界面美化", "表情包上限解锁", "朋友圈更新静默", "安全绕过", "隐私保护", "批量管理", "自动回复", "语音导出", "消息搜索增强", "自定义主题"],
    targets: ["微信", "QQ"],
    metric: { label: "防撤回", field: "recall", suffix: "条", isCount: true },
    interval: [5000, 10000],
    palette: {
      primary: "#F0AAD6",
      primaryContainer: "#5B2B45",
      onPrimaryContainer: "#FFD8EE",
      secondaryContainer: "#4A2E3D",
      glow: "rgba(240, 170, 214, 0.45)",
      glowStrong: "rgba(240, 170, 214, 0.75)",
    },
    genLog: () => {
      const a = pick(microxActions);
      return { level: "info", message: a.m, target: a.t };
    },
  },
  {
    id: "vip",
    name: "VIP 解锁",
    nameEn: "VipUnlocker_NoRoot",
    pkg: "com.vipunlocker.noroot",
    icon: Crown,
    desc: "解锁去广告 / 会员主题 / 付费章节 / Pro 模式",
    features: ["去广告 VIP", "会员主题解锁", "付费章节解锁", "Pro 模式", "高清画质", "云空间解锁", "专属字体", "去水印"],
    targets: ["视频 / 工具 / 阅读 APP"],
    metric: { label: "已解锁", field: "unlocked", suffix: "项", isCount: true },
    interval: [6000, 11000],
    palette: {
      primary: "#FFD87A",
      primaryContainer: "#553F00",
      onPrimaryContainer: "#FFE08A",
      secondaryContainer: "#4A3D18",
      glow: "rgba(255, 216, 122, 0.5)",
      glowStrong: "rgba(255, 216, 122, 0.8)",
    },
    genLog: () => {
      const a = pick(vipActions);
      return { level: "success", message: a.m, target: a.t };
    },
  },
  {
    id: "video",
    name: "视频下载",
    nameEn: "VideoSaver_NoRoot",
    pkg: "com.videosaver.noroot",
    icon: Video,
    desc: "解析抖音 / 快手 / 小红书视频链接，去水印下载",
    features: ["抖音去水印", "快手去水印", "小红书下载", "B 站下载", "直播流解析", "音频提取", "批量下载", "Shizuku 抓包"],
    targets: ["短视频 APP"],
    metric: { label: "已下载", field: "video", suffix: "个", isCount: true },
    interval: [4500, 9000],
    palette: {
      primary: "#F08AD6",
      primaryContainer: "#5B1646",
      onPrimaryContainer: "#FFD8EE",
      secondaryContainer: "#4A2540",
      glow: "rgba(240, 138, 214, 0.45)",
      glowStrong: "rgba(240, 138, 214, 0.75)",
    },
    genLog: () => {
      const a = pick(videoActions);
      return { level: "success", message: a.m, target: a.t };
    },
  },
  {
    id: "step",
    name: "步数修改",
    nameEn: "StepModifier_NoRoot",
    pkg: "com.stepmodifier.noroot",
    icon: Footprints,
    desc: "添加步数 / 模拟轨迹 / 生成心率与睡眠数据",
    features: ["步数添加", "运动轨迹模拟", "步数同步", "心率数据生成", "爬楼模拟", "睡眠数据生成", "ContentProvider 注入", "传感器阻断", "多 APP 同步", "历史伪造"],
    targets: ["运动健康 APP"],
    metric: { label: "添加", field: "steps", suffix: "步", isCount: true },
    interval: [4000, 8500],
    palette: {
      primary: "#45D6D2",
      primaryContainer: "#004F50",
      onPrimaryContainer: "#5CF1F0",
      secondaryContainer: "#1F4A4A",
      glow: "rgba(69, 214, 210, 0.45)",
      glowStrong: "rgba(69, 214, 210, 0.75)",
    },
    genLog: () => {
      const a = pick(stepActions);
      return { level: "info", message: a.m, target: a.t };
    },
  },
  {
    id: "audio",
    name: "音量增强",
    nameEn: "AudioBoost_NoRoot",
    pkg: "com.audioboost.noroot",
    icon: Volume2,
    desc: "突破音量上限 / 均衡器 / 降噪 / Hi-Fi 通道",
    features: ["音量增强 +6dB", "Tinymix 桥接", "低音增强", "均衡器", "扬声器增强", "麦克风增强", "音质增强"],
    targets: ["音乐 / 视频 APP"],
    metric: { label: "增益", field: "db", suffix: "dB", prefix: "+" },
    interval: [5000, 9500],
    palette: {
      primary: "#FF8A80",
      primaryContainer: "#5C1300",
      onPrimaryContainer: "#FFB4A0",
      secondaryContainer: "#4A2418",
      glow: "rgba(255, 138, 128, 0.45)",
      glowStrong: "rgba(255, 138, 128, 0.75)",
    },
    genLog: () => {
      const a = pick(audioActions);
      return { level: "info", message: a.m, target: a.t };
    },
  },
  {
    id: "notify",
    name: "通知管理",
    nameEn: "NotifyMaster_NoRoot",
    pkg: "com.notifymaster.noroot",
    icon: Bell,
    desc: "静音 / 合并 / 拦截营销 / 延迟 / 分类通知",
    features: ["通知过滤", "防撤回通知", "通知历史", "通知美化", "批量通知", "优先级覆盖", "静默通知", "Shizuku 命令"],
    targets: ["系统通知"],
    metric: { label: "已静音", field: "muted", suffix: "条", isCount: true },
    interval: [3800, 7500],
    palette: {
      primary: "#E0B68A",
      primaryContainer: "#4A2D14",
      onPrimaryContainer: "#FFDCBA",
      secondaryContainer: "#423429",
      glow: "rgba(224, 182, 138, 0.42)",
      glowStrong: "rgba(224, 182, 138, 0.72)",
    },
    genLog: () => {
      const a = pick(notifyActions);
      return { level: "warn", message: a.m, target: a.t };
    },
  },
  {
    id: "shizuku",
    name: "Shizuku 修复",
    nameEn: "ShizukuSceneFix",
    pkg: "com.shizuku.scenefix",
    icon: Plug,
    desc: "修复 Scene 工具箱在 Shizuku 授权列表不显示",
    features: ["授权请求修复", "Shizuku 授权", "Scene 隐藏", "看门狗服务", "变体检测", "列表注入", "自动授权助手"],
    targets: ["Shizuku / Scene"],
    metric: { label: "状态", field: "fixed", suffix: "" },
    interval: [7000, 13000],
    palette: {
      primary: "#7DCFA0",
      primaryContainer: "#0F3D24",
      onPrimaryContainer: "#B5F0C2",
      secondaryContainer: "#2C4A36",
      glow: "rgba(125, 207, 160, 0.42)",
      glowStrong: "rgba(125, 207, 160, 0.72)",
    },
    genLog: () => {
      const a = pick(shizukuActions);
      return { level: "success", message: a.m, target: a.t };
    },
  },
];

export const getModule = (id: string) => LSP_MODULES.find((m) => m.id === id)!;

/** 把 module.palette 写成 CSS 变量对象 */
export function paletteToCssVars(p: ModulePalette): Record<string, string> {
  return {
    "--m3-primary": p.primary,
    "--m3-primary-container": p.primaryContainer,
    "--m3-on-primary-container": p.onPrimaryContainer,
    "--m3-secondary-container": p.secondaryContainer,
    "--m3-glow": p.glow,
    "--m3-glow-strong": p.glowStrong,
  };
}
