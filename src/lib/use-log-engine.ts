"use client";

import { useEffect } from "react";
import { useLspStore } from "./lsp-store";
import { getModule } from "./lsp-modules";

/**
 * 实时日志模拟引擎
 * 仅对当前激活模块（且总开关开启）按其 interval 区间随机生成日志
 * 切换模块 / 关闭开关时自动停止上一轮调度
 */
export function useLogEngine() {
  const activeModuleId = useLspStore((s) => s.activeModuleId);
  const enabled = useLspStore((s) => s.modules[s.activeModuleId]?.enabled);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const schedule = () => {
      const cur = getModule(useLspStore.getState().activeModuleId);
      const [min, max] = cur.interval;
      const delay = min + Math.random() * (max - min);
      timer = setTimeout(() => {
        if (!alive) return;
        // 仅当当前激活模块仍开启时才写入
        const st = useLspStore.getState();
        if (st.modules[st.activeModuleId]?.enabled) {
          st.addLog(st.activeModuleId);
        }
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [activeModuleId, enabled]);
}
