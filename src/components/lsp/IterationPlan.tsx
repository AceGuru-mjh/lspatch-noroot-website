"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  GitCommit,
  Rocket,
  ShieldCheck,
  Bug,
  ArrowRight,
  ExternalLink,
  FlaskConical,
} from "lucide-react";

const BUILD_RESULTS = [
  { module: "AdBlockerX_NoRoot", status: "success", size: "12.1 MB" },
  { module: "AudioBoost_NoRoot", status: "success", size: "12.1 MB" },
  { module: "BatteryOptimizer_NoRoot", status: "success", size: "12.1 MB" },
  { module: "GameUnlockerPro_NoRoot", status: "success", size: "12.1 MB" },
  { module: "MicroXEnhancer", status: "success", size: "12.1 MB" },
  { module: "NotifyMaster_NoRoot", status: "success", size: "12.1 MB" },
  { module: "PrivacyGuard_NoRoot", status: "success", size: "12.1 MB" },
  { module: "ShizukuSceneFix", status: "success", size: "12.1 MB" },
  { module: "StepModifier_NoRoot", status: "success", size: "12.1 MB" },
  { module: "VideoSaver_NoRoot", status: "success", size: "12.1 MB" },
  { module: "VipUnlocker_NoRoot", status: "success", size: "12.1 MB" },
];

const ISSUES = [
  {
    severity: "critical",
    title: "铁律 1 全部 11 模块仍违反（27 条 import hooks/*）",
    impact: "LSPatch 集成模式下安装到目标 APP 会秒崩，APK 虽能构建但运行即闪退",
    detail: "11 个 XposedLoader.kt 仍有 `import xxx.hooks.*`（AdBlockerX 11条、ShizukuSceneFix 7条、其余各1条）。类加载阶段触发 NoClassDefFoundError，到不了 handleLoadPackage",
    fix: "应用我提供的 patch 包：删除 27 条 import，89 处 Hook 调用改为 invokeHook() 反射",
    state: "未修复",
  },
  {
    severity: "critical",
    title: "ConfigProvider 与 ConfigManager prefs 名不一致（2 模块）",
    impact: "AdBlockerX 与 GameUnlockerPro 的 ContentProvider 永远返回空配置，Hook 读不到总开关",
    detail: 'AdBlockerX: ConfigManager 写 "adblockerx_noroot_prefs"，ConfigProvider 读 "adblockerx_prefs"；GameUnlockerPro: "game_unlocker_prefs" vs "gameunlocker_prefs"（少下划线）',
    fix: "统一 prefs 名为常量，ConfigProvider 引用 ConfigManager.PREFS_NAME",
    state: "未修复",
  },
  {
    severity: "high",
    title: "MODE_WORLD_READABLE 在 11 模块的 ConfigManager + LogStore 残留",
    impact: "API 24+ 抛 SecurityException，catch 回退 MODE_PRIVATE 后宿主进程读不到配置",
    detail: "11 模块的 ConfigManager.kt 和 LogStore.kt 都用 MODE_WORLD_READABLE，LSPatch 集成模式跨进程读失效",
    fix: "全部改为 MODE_PRIVATE，跨进程读走 ContentProvider（ConfigClient）",
    state: "未修复",
  },
  {
    severity: "medium",
    title: "铁律 2 部分违反：Hook 用 String + classLoader 重载",
    impact: "集成模式下 lpparam.classLoader 可能找不到第三方 SDK 类",
    detail: "部分 Hook 用 findAndHookMethod(String, classLoader, ...) 而非 Class.forName() + 传 Class 对象",
    fix: "改为 Class.forName() + findAndHookMethod(Class, ...) 重载",
    state: "未修复",
  },
  {
    severity: "medium",
    title: "VERSION 常量仍为 1.0.11（11 模块）",
    impact: "日志和 UI 显示的版本号与 Release 不符，排查问题困难",
    detail: 'GameUnlockerPro XposedLoader.kt: const val VERSION = "1.0.11"，应改为 1.0.12',
    fix: "批量替换 VERSION 常量为 1.0.12",
    state: "未修复",
  },
];

const ITERATIONS = [
  {
    version: "v1.0.13",
    title: "铁律 1 全量修复",
    priority: "P0 · 紧急",
    color: "#FF6B6B",
    goal: "修复集成模式秒崩，让 APK 实际可用",
    tasks: [
      "应用 lspatch-noroot-fix patch（删除 27 条 import hooks/*）",
      "11 模块 XposedLoader 改为 invokeHook() 反射加载",
      "AdBlockerX Config 类型修正为 AdBlockConfig",
      "MicroXEnhancer .hook() 模式特殊处理（invokeHookNoCfg）",
      "本地 gradlew :app:compileReleaseKotlin 验证 11 模块",
    ],
    risk: "低 · 纯删除 import + 方法调用替换，不改 Hook 逻辑",
    verify: "LSPatch 集成模式安装到目标 APP 不崩溃，logcat 见 [宿主进程] Hook 注入日志",
  },
  {
    version: "v1.0.14",
    title: "IPC 配置链修复",
    priority: "P0 · 紧急",
    color: "#FFB870",
    goal: "修复总开关与配置跨进程同步失效",
    tasks: [
      "统一 11 模块 ConfigProvider/ConfigManager prefs 名（常量化）",
      "删除所有 MODE_WORLD_READABLE，改为 MODE_PRIVATE",
      "HookConfigReader 删除 XSharedPreferences 路径，仅走 ConfigClient",
      "ConfigProvider 加 android:readPermission 自定义签名权限",
      "ConfigClient.read() 加 try-catch + 默认值兜底",
    ],
    risk: "中 · 涉及跨进程配置，需在真机测试总开关切换生效",
    verify: "UI 开关切换后，Hook 进程 1 秒内读到新值（logcat 打印）",
  },
  {
    version: "v1.0.15",
    title: "铁律 2 全反射 + 版本号统一",
    priority: "P1 · 重要",
    color: "#FCD34D",
    goal: "Hook 类加载健壮性 + 版本号对齐",
    tasks: [
      "全部 Hook 内目标类改用 Class.forName() 加载",
      "findAndHookMethod 传 Class 对象而非 String+classLoader",
      "Class.forName 失败时 try-catch ClassNotFoundException 静默跳过",
      "11 模块 VERSION 常量 1.0.11 → 1.0.15",
      "build.gradle.kts versionName 同步更新",
    ],
    risk: "低 · 字符串重载改 Class 重载，行为等价",
    verify: "非 Unity 游戏不再报 UnityPlayer ClassNotFoundError",
  },
  {
    version: "v1.0.16",
    title: "铁律 3 双分支强化 + 悬浮球健壮性",
    priority: "P1 · 重要",
    color: "#6DBA95",
    goal: "防止 Hook 注入自身进程 + 悬浮球异常处理",
    tasks: [
      "handleLoadPackage 第一行强制 if (packageName == OWN_PKG) return",
      "FloatingBallService 加 WindowManager 权限检查 + 异常恢复",
      "PanelActivity 透明主题 + setDimAmount 验证",
      "ConfigProvider query() 加空指针保护",
      "添加 CrashGuard 兜底：Hook 异常不传播到宿主",
    ],
    risk: "中 · 悬浮球涉及 WindowManager，需多机型测试",
    verify: "模块自身 APP 打开不卡顿，悬浮球拖拽/点击稳定",
  },
  {
    version: "v1.1.0",
    title: "M3 毛玻璃悬浮球 UI 升级",
    priority: "P2 · 增强",
    color: "#F0AAD6",
    goal: "按设计稿升级悬浮球为 M3 毛玻璃风格",
    tasks: [
      "FloatingBallService View 改为 Compose 渲染",
      "悬浮球 glass-ball 毛玻璃背景 + 脉冲环动画",
      "PanelActivity 展开 sheet + glass-panel 强毛玻璃",
      "面板内总开关 M3 Switch + 实时日志列表",
      "模块最小化指标显示（拦截数/帧率/省电%等）",
    ],
    risk: "高 · Compose 在悬浮窗的兼容性需验证（API 26+）",
    verify: "悬浮球视觉与 Web 预览一致，面板展开动画流畅",
  },
  {
    version: "v1.2.0",
    title: "新模块扩展 + 自动化体检",
    priority: "P3 · 远期",
    color: "#7DD3FC",
    goal: "新增模块 + CI 自动体检门禁",
    tasks: [
      "healthcheck.py 修复 GBK 编码问题（Python 3 open encoding=utf-8）",
      "CI 增加 lint 门禁：grep import hooks/* → 失败",
      "新增 2-3 个 NoRoot 模块（如设备模拟器增强）",
      "Release body 自动生成 changelog",
      "APK 签名 v2/v3 验证脚本",
    ],
    risk: "低 · 纯工具链增强",
    verify: "PR 阶段自动拦截铁律违反，Release 自动附 changelog",
  },
];

export function IterationPlan() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="text-center">
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "#6DBA95", color: "#6DBA95", background: "rgba(109,186,149,0.12)" }}
        >
          <CheckCircle2 className="h-3 w-3" />
          v1.0.12 构建成功 · 11 APK 已发布
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fff 0%, #6DBA95 120%)" }}>
            构建状态检查 & 迭代计划
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-[12.5px] leading-relaxed text-white/55">
          v1.0.12 已成功生成 11 个 APK，但 <span className="text-rose-300">铁律修复未合并</span>——
          APK 虽能安装，集成模式运行会秒崩。以下是完整诊断与 v1.0.14 → v1.2.0 迭代路线
        </p>
      </section>

      {/* 构建结果 */}
      <section>
        <BuildResults />
      </section>

      {/* 风险诊断 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">运行时风险诊断</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {ISSUES.map((issue, i) => (
            <IssueCard key={i} issue={issue} />
          ))}
        </div>
      </section>

      {/* 迭代路线 */}
      <section>
        <h2 className="mb-3 text-center text-[15px] font-bold text-white/85">迭代路线图 v1.0.14 → v1.2.0</h2>
        <div className="space-y-3">
          {ITERATIONS.map((it, i) => (
            <IterationCard key={it.version} iter={it} index={i} />
          ))}
        </div>
      </section>

      {/* 行动建议 */}
      <section className="glass-card rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <Rocket className="h-4 w-4 text-emerald-400" />
          <h3 className="text-[14px] font-bold text-white/90">立即行动建议</h3>
        </div>
        <div className="space-y-2.5 text-[12px] leading-relaxed text-white/65">
          <p>
            <span className="font-semibold text-rose-300">⚠ 现状：</span>
            v1.0.12 的 APK <span className="text-white/85">能安装但集成模式会秒崩</span>（铁律1未修），
            用户反馈"装了没用"的概率极高。建议在 Release 说明中标注 <span className="font-mono text-amber-300">"已知问题：集成模式待 v1.0.13 修复"</span>。
          </p>
          <p>
            <span className="font-semibold text-emerald-300">✓ 最快路径：</span>
            下载页面 <span className="font-mono text-white/80">"完整修复包"</span> Tab 的 patch，
            apply 后 push，即得 v1.0.13。该 patch 已在本地验证 11/11 模块零 import hooks/*。
          </p>
          <p>
            <span className="font-semibold text-sky-300">→ 排期：</span>
            v1.0.13（铁律1）+ v1.0.14（IPC）建议本周内合并，二者合修后 APK 才真正可用；
            v1.0.15-v1.0.16 次周；v1.1.0（M3 悬浮球）可对照 Web 预览移植。
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle/releases/tag/v1.0.12"
            target="_blank"
            rel="noopener noreferrer"
            className="m3-state flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-[11.5px] font-medium text-white/80 transition-colors hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            查看 v1.0.12 Release
          </a>
          <a
            href="https://github.com/AceGuru-mjh/LSPatch-Noroot-modle/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="m3-state flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-[11.5px] font-medium text-white/80 transition-colors hover:text-white"
          >
            <GitCommit className="h-3.5 w-3.5" />
            Actions 构建历史
          </a>
        </div>
      </section>
    </div>
  );
}

function BuildResults() {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-emerald-400" />
          <span className="text-[13px] font-bold text-white/90">v1.0.12 构建结果</span>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
          11/11 成功
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {BUILD_RESULTS.map((r, i) => (
          <motion.div
            key={r.module}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-2"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10.5px] font-semibold text-white/85">{r.module.replace("_NoRoot", "")}</div>
              <div className="text-[9px] text-white/40">{r.size}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: typeof ISSUES[0] }) {
  const cfg = {
    critical: { color: "#FF6B6B", icon: XCircle, label: "致命" },
    high: { color: "#FFB870", icon: AlertTriangle, label: "高危" },
    medium: { color: "#FCD34D", icon: AlertTriangle, label: "中危" },
  }[issue.severity as "critical" | "high" | "medium"];
  const Icon = cfg.icon;
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-2 flex items-start gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${cfg.color}1a`, color: cfg.color }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase" style={{ background: `${cfg.color}14`, color: cfg.color }}>
              {cfg.label}
            </span>
            <span className="rounded-full bg-white/6 px-1.5 py-0.5 text-[8.5px] font-medium text-white/45">
              {issue.state}
            </span>
          </div>
          <h3 className="mt-1 text-[12.5px] font-bold leading-snug text-white/90">{issue.title}</h3>
        </div>
      </div>
      <div className="space-y-1.5 pl-9">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wide text-rose-300/70">影响</span>
          <p className="text-[11px] leading-relaxed text-white/55">{issue.impact}</p>
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wide text-amber-300/70">详情</span>
          <p className="font-mono text-[10px] leading-relaxed text-white/45">{issue.detail}</p>
        </div>
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-wide text-emerald-300/70">修复</span>
          <p className="text-[11px] leading-relaxed text-white/55">{issue.fix}</p>
        </div>
      </div>
    </div>
  );
}

function IterationCard({ iter, index }: { iter: typeof ITERATIONS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold"
          style={{ background: `${iter.color}1a`, color: iter.color }}
        >
          {iter.version.replace("v", "")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13.5px] font-bold text-white/90">{iter.title}</h3>
            <span
              className="rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase"
              style={{ background: `${iter.color}14`, color: iter.color }}
            >
              {iter.priority}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-white/50">{iter.goal}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-white/40">
            <FlaskConical className="h-3 w-3" />
            任务
          </div>
          <ul className="space-y-1">
            {iter.tasks.map((t, i) => (
              <li key={i} className="flex gap-1.5 text-[10.5px] leading-relaxed text-white/55">
                <ArrowRight className="mt-0.5 h-2.5 w-2.5 shrink-0" style={{ color: iter.color }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-white/40">
            <AlertTriangle className="h-3 w-3" />
            风险
          </div>
          <p className="text-[10.5px] leading-relaxed text-white/55">{iter.risk}</p>
        </div>
        <div>
          <div className="mb-1.5 flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-white/40">
            <CheckCircle2 className="h-3 w-3" />
            验证标准
          </div>
          <p className="text-[10.5px] leading-relaxed text-white/55">{iter.verify}</p>
        </div>
      </div>
    </motion.div>
  );
}
