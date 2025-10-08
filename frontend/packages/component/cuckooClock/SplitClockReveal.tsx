// components/timed/SplitClockReveal.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Clock from "./Clock";

type Props = {
  open: boolean;
  size?: number;
  imageSrc?: string;
  children?: React.ReactNode;
  durationMs?: number;
  openDeg?: number;
  radius?: number | string; // 例: 16 / "24px" / "50%"
  face?: React.ReactNode;
  bezelWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  /** 外周にじみ対策：内側にわずかにクリップ（px） */
  clipInsetPx?: number; // ← 追加（既定 0.5）

  // 振動エフェクト用
  shakeAmpPx?: number;
  shakeRotDeg?: number;
  shakeScale?: number;
  shakePeriodMs?: number;
};

export default function SplitClockReveal({
  open,
  size = 180,
  imageSrc,
  children,
  durationMs = 420,
  openDeg = 110,
  radius = "50%",
  face,
  bezelWidth = 2,
  className,
  style,
  clipInsetPx = 2.5, // ← 追加
  // 振動エフェクト用
  shakeAmpPx = 1.5,
  shakeRotDeg = 0.3,
  shakeScale = 0.004, // 0.4%
  shakePeriodMs = 1200,
}: Props) {
  const rStr = typeof radius === "number" ? `${radius}px` : radius;
  const isCircle =
    rStr === "50%" || (typeof radius === "number" && radius >= size / 2);

  // 盤面は左右で別インスタンスに
  const renderFace = (key: string) =>
    React.isValidElement(face) ? (
      React.cloneElement(face, { key })
    ) : (
      <Clock key={key} size={size} tzOffsetMinutes={540} />
    );

  // ★ クリップ形状（内側に clipInsetPx 分だけ寄せて切る）
  const clipPath = isCircle
    ? `circle(calc(50% - ${clipInsetPx}px) at 50% 50%)`
    : `inset(${clipInsetPx}px round ${rStr})`;

  const parseRadiusPx = (r: number | string, box: number) => {
    if (typeof r === "number") return r;
    const s = String(r).trim();
    if (s.endsWith("%")) return (parseFloat(s) / 100) * box;
    if (s.endsWith("px")) return parseFloat(s);
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: rStr, // 見た目用（実クリップは下の ClipHost）
        overflow: "hidden",
        ...style,
      }}
    >
      {/* 枠（オーバーレイ）※レイアウト非干渉 */}
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "block",
        }}
        aria-hidden
      >
        {(() => {
          const rx = parseRadiusPx(radius ?? "50%", size);
          const sw = bezelWidth; // 枠の太さ
          const inset = sw / 2; // ストロークが内外に出ないよう内側へ半分オフセット
          return (
            <rect
              x={inset}
              y={inset}
              width={size - sw}
              height={size - sw}
              rx={rx - inset} // 角丸も内側へ補正
              ry={rx - inset}
              fill="none"
              stroke="rgba(0,0,0,.08)" // 均一な色
              strokeWidth={sw}
              shapeRendering="geometricPrecision"
            />
          );
        })()}
      </svg>

      {/* ▼ 内側 0.5px だけ縮めて“物理的に”クリップする層 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          // clip-path で最終合成結果ごと切る（にじみ抑止の本命）
          clipPath,
          WebkitClipPath: clipPath as any,
          // Safari が強い時は下行も足すとさらに安定
          // WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          isolation: "isolate",
        }}
      >
        {/* 背景（cover） */}
        <motion.div
          style={{ position: "absolute", inset: 0, background: "#000" }}
          initial={false}
          animate={
            open
              ? {
                  x: [0, shakeAmpPx, 0, -shakeAmpPx, 0],
                  y: [0, -shakeAmpPx / 2, 0, shakeAmpPx / 2, 0],
                  rotate: [0, shakeRotDeg, 0, -shakeRotDeg, 0],
                  scale: [1, 1 + shakeScale, 1, 1 + shakeScale, 1],
                }
              : { x: 0, y: 0, rotate: 0, scale: 1 }
          }
          transition={{
            duration: shakePeriodMs / 1000,
            ease: "easeInOut",
            repeat: open ? Infinity : 0,
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                userSelect: "none",
              }}
            />
          ) : (
            children
          )}
        </motion.div>

        {/* 観音開き（3D）— 子は長方形のまま */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            perspective: 1000,
            transformStyle: "preserve-3d",
          }}
        >
          {/* 左ハーフ（外ヒンジ） */}
          <motion.div
            initial={false}
            animate={{ rotateY: open ? -openDeg : 0 }}
            transition={{
              duration: durationMs / 1000,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              overflow: "hidden",
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              boxShadow: open ? "0 6px 16px rgba(0,0,0,.25)" : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: "200%",
                height: "100%",
                left: 0, // 左半分
                pointerEvents: "none",
              }}
            >
              {renderFace("face-left")}
            </div>
          </motion.div>

          {/* 右ハーフ（外ヒンジ） */}
          <motion.div
            initial={false}
            animate={{ rotateY: open ? openDeg : 0 }}
            transition={{
              duration: durationMs / 1000,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              overflow: "hidden",
              transformOrigin: "right center",
              backfaceVisibility: "hidden",
              boxShadow: open ? "0 6px 16px rgba(0,0,0,.25)" : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: "200%",
                height: "100%",
                left: "-100%", // 右半分
                pointerEvents: "none",
              }}
            >
              {renderFace("face-right")}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
