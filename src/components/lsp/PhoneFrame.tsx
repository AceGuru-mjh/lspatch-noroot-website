"use client";

import { useRef, type ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  /** 屏幕区域宽度（设计稿 px） */
  width?: number;
  height?: number;
}

/**
 * 手机设备外框 — 模拟一台 Android 旗舰机
 * 提供一个相对定位的屏幕容器，悬浮球 / 面板将 absolute 叠加其上
 */
export function PhoneFrame({ children, width = 360, height = 760 }: PhoneFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="device-frame relative shrink-0"
      style={{
        width: width + 24,
        height: height + 24,
        borderRadius: 54,
        padding: 12,
      }}
    >
      {/* 侧边按键 */}
      <div className="absolute left-[-3px] top-[140px] h-12 w-[3px] rounded-l bg-neutral-700" />
      <div className="absolute left-[-3px] top-[200px] h-20 w-[3px] rounded-l bg-neutral-700" />
      <div className="absolute right-[-3px] top-[180px] h-16 w-[3px] rounded-r bg-neutral-700" />

      {/* 屏幕区 */}
      <div
        ref={screenRef}
        data-lsp-screen
        className="relative overflow-hidden rounded-[42px] bg-black"
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}
