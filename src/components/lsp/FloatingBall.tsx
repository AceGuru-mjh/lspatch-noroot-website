"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause } from "lucide-react";
import { useLspStore } from "@/lib/lsp-store";
import { getModule } from "@/lib/lsp-modules";

interface FloatingBallProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  screenW: number;
  screenH: number;
}

export function FloatingBall({ containerRef, screenW, screenH }: FloatingBallProps) {
  const { activeModuleId, ball, togglePanel, setBall, modules } = useLspStore();
  const mod = getModule(activeModuleId);
  const state = modules[activeModuleId];
  const Icon = mod.icon;

  const dragState = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    moved: false,
    active: false,
  });

  const SIZE = 66;
  const half = SIZE / 2;

  const value = state.metrics[mod.metric.field] ?? 0;
  const displayValue = mod.metric.isCount
    ? value.toLocaleString()
    : `${mod.metric.prefix ?? ""}${value}${mod.metric.suffix ?? ""}`;

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      active: true,
    };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // 指针相对容器的位置 → rx/ry
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    setBall(rx, ry);
  }

  function onPointerUp() {
    if (!dragState.current.active) return;
    const wasClick = !dragState.current.moved;
    dragState.current.active = false;
    if (wasClick) togglePanel();
  }

  const left = ball.rx * screenW;
  const top = ball.ry * screenH;
  const enabled = state.enabled;

  return (
    <motion.button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="glass-ball absolute z-30 flex cursor-grab touch-none select-none flex-col items-center justify-center active:cursor-grabbing"
      style={{
        width: SIZE,
        height: SIZE,
        left: left - half,
        top: top - half,
        borderRadius: "50%",
        color: "var(--m3-primary)",
        opacity: enabled ? 1 : 0.65,
        filter: enabled ? "none" : "grayscale(0.5)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: enabled ? 1 : 0.65 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      whileTap={{ scale: 0.92 }}
      aria-label={`${mod.name} 悬浮球${enabled ? "" : "（已暂停）"}，点击展开面板，拖拽移动`}
    >
      {/* 脉冲环（运行中） */}
      {enabled && (
        <span
          className="pulse-ring pointer-events-none absolute inset-0 rounded-full"
          style={{ border: `2px solid var(--m3-primary)` }}
        />
      )}

      {/* 图标 */}
      <Icon
        className="relative z-10 h-[22px] w-[22px]"
        style={{ color: enabled ? "var(--m3-primary)" : "rgba(255,255,255,0.5)" }}
        strokeWidth={2.2}
      />

      {/* 指标值 */}
      <span
        className="relative z-10 mt-0.5 text-[11px] font-bold leading-none tabular-nums"
        style={{ color: enabled ? "var(--m3-on-primary-container)" : "rgba(255,255,255,0.55)" }}
      >
        {enabled ? displayValue : "已暂停"}
      </span>

      {/* 暂停指示 */}
      <AnimatePresence>
        {!enabled && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-800 ring-1 ring-white/20"
          >
            <Pause className="h-2.5 w-2.5 text-white/80" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* 运行中指示点 */}
      {enabled && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-black/40">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
        </span>
      )}
    </motion.button>
  );
}
