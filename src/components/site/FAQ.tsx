"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "LSPatch 和 LSPosed 有什么区别？",
    a: "LSPosed 需要 Root 权限 + Magisk，直接在系统层注入 Xposed 模块。LSPatch 是免 Root 方案，通过重打包目标 APK 把 Xposed 运行时和模块嵌入进去。本合集是 LSPatch NoRoot 版本，无需 Root 即可使用。",
  },
  {
    q: "什么是三大铁律？为什么重要？",
    a: "铁律1: XposedLoader 禁止 import hooks/*（类加载阶段秒崩）。铁律2: Hook 必须用 Class.forName().getDeclaredMethod().invoke() 反射调用。铁律3: 进程双分支（自身进程走 UI，宿主进程走 Hook）。违反任一铁律，集成模式下 APK 装上去就闪退，到不了 handleLoadPackage。",
  },
  {
    q: "v1.0.13 和 v1.0.12 有什么区别？",
    a: "v1.0.12 的 APK 能构建能安装，但集成模式运行会秒崩（27 条 import hooks 未删除），总开关跨进程失效（prefs 名不一致）。v1.0.13 修复了三大铁律 + IPC + 版本号 + ConfigProvider permission，APK 既能安装又能稳定运行。",
  },
  {
    q: "如何使用这些模块？",
    a: "1) 从 Releases 下载需要的模块 APK 并安装。2) 安装 LSPatch 管理器（GitHub 搜 LSPatch）。3) 在 LSPatch 中选择目标 APP（如微信）+ 勾选模块。4) 选择「集成模式」打包，等待完成。5) 卸载原版 APP，安装打包后的版本。6) 打开 APP，模块自动注入生效。",
  },
  {
    q: "悬浮球权限怎么开？",
    a: "模块安装后，打开模块 APP → 设置 → 悬浮球 → 授权「显示在其他应用上层」（SYSTEM_ALERT_WINDOW）。授权后悬浮球会出现在所有 APP 上层，可拖拽移动，点击展开毛玻璃面板查看总开关与实时日志。",
  },
  {
    q: "总开关切换后多久生效？",
    a: "UI 进程切换总开关后，写入 SharedPreferences（MODE_PRIVATE）。宿主进程通过 ContentProvider 查询（content://<pkg>.configprovider/config），通常 1 秒内生效。如果宿主进程正在运行，需要重启宿主 APP 让 Hook 重新读取配置。",
  },
  {
    q: "为什么需要 Shizuku？",
    a: "Shizuku 提供免 Root 的 adb 级系统操作能力（如 settings put、wm size、am force-stop）。部分模块（如游戏加速的温控绕过、ShizukuSceneFix）需要通过 Shizuku 执行系统命令。Shizuku 不可用时这些功能会静默降级，不影响其他 Hook。",
  },
  {
    q: "apply.sh 修复脚本怎么用？",
    a: "1) 从本站下载 v1.0.13 修复包（patch + apply.sh）。2) git clone 仓库到本地。3) 把 patch 和 apply.sh 复制到仓库根目录。4) 执行 bash apply.sh，脚本会自动应用 patch 并验证 7 项（铁律1/2/3 + IPC + permission + 版本号）。5) git commit + push，GitHub Actions 自动构建 v1.0.13 APK。",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-300">
          <HelpCircle className="h-3 w-3" />
          常见问题
        </div>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          FAQ
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] text-white/55">
          关于 LSPatch、三大铁律、使用方法的常见问题解答
        </p>
      </div>

      <div className="space-y-2.5">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="m3-state flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span className="text-[13px] font-semibold text-white/90">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-4 pb-4 text-[12px] leading-relaxed text-white/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
