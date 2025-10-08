"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

export type Props = {
  imageSrc?: string; // 表示する画像（children でも可）
  children?: React.ReactNode; // 画像の代わりに任意UIを入れてもOK
  radius?: number; // コーナーR
  openDeg?: number; // 扉の開き角度
  fit?: "cover" | "contain"; // 画像フィット
  shadow?: boolean; // 扉に影
};

export type HingedWindowProps = Props & {
  /** 親要素(時計本体)を position:relative にしておくこと */
  open: boolean; // true=開く / false=閉じる
  rect: { top: number; left: number; width: number; height: number }; // 親左上基準(px)
  durationMs?: number; // 開閉時間
  delayMs?: number; // 開始ディレイ
  zIndex?: number; // 重なり順
  onOpened?: () => void; // 開き切った
  onClosed?: () => void; // 閉じ切った
};

export function HingedWindow({
  open,
  imageSrc,
  children,
  rect,
  radius = 12,
  openDeg = 72,
  durationMs = 400,
  delayMs = 0,
  fit = "cover",
  zIndex = 10,
  shadow = true,
  onOpened,
  onClosed,
}: HingedWindowProps) {
  // 扉の到達通知（簡易）
  useEffect(() => {
    const id = setTimeout(
      () => (open ? onOpened?.() : onClosed?.()),
      durationMs + delayMs
    );
    return () => clearTimeout(id);
  }, [open, durationMs, delayMs, onOpened, onClosed]);

  return (
    <div
      style={{
        position: "absolute",
        ...rect,
        overflow: "hidden",
        borderRadius: radius,
        border: "2px solid rgba(0,0,0,.08)",
        background: "#000",
        zIndex,
        // 3D感
        perspective: 800,
      }}
    >
      {/* 中身（画像 or children） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {imageSrc ? (
          // 画像は先読み推奨（必要なら外で <link rel="preload"> 等）
          <img
            src={imageSrc}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: fit,
              objectPosition: "center",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
        ) : (
          children
        )}
      </div>

      {/* 扉：左・右（観音） */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ rotateY: open ? openDeg : 0 }}
        transition={{
          duration: durationMs / 1000,
          delay: delayMs / 1000,
          ease: [0.2, 0.7, 0.2, 1],
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(180deg,#6f492a,#4b2f1b)",
          borderRight: "1px solid rgba(0,0,0,.25)",
          transformOrigin: "right center",
          boxShadow: shadow ? "8px 0 14px rgba(0,0,0,.25)" : "none",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        aria-hidden
        initial={false}
        animate={{ rotateY: open ? -openDeg : 0 }}
        transition={{
          duration: durationMs / 1000,
          delay: delayMs / 1000,
          ease: [0.2, 0.7, 0.2, 1],
        }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(180deg,#6f492a,#4b2f1b)",
          borderLeft: "1px solid rgba(0,0,0,.25)",
          transformOrigin: "left center",
          boxShadow: shadow ? "-8px 0 14px rgba(0,0,0,.25)" : "none",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
