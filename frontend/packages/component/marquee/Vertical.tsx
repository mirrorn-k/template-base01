"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { toPxSafe } from "./functions";

type Props = {
  text?: string;
  children?: React.ReactNode;
  speed?: number; // default 90 (px/s)
  direction?: "up" | "down"; // default "up"
  gap?: number; // タイル下端の空き (px), default 16
  pauseOnHover?: boolean; // default true
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  color?: string;
  fade?: number; // 上下フェード (px)
  fadeColor?: string;
  className?: string;
  style?: React.CSSProperties; // { height } 指定推奨
};

export default function MarqueeVerticalChars({
  text,
  children,
  speed = 90,
  direction = "up",
  gap = 16,
  pauseOnHover = true,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  fade = 0,
  fadeColor,
  className,
  style,
}: Props) {
  const theme = useTheme();

  // ------- フォント既定値（theme.typography.h4） -------
  const fallbackFamily =
    theme.typography?.h4?.fontFamily ??
    theme.typography?.fontFamily ??
    "sans-serif";
  const fallbackSize = theme.typography?.h4?.fontSize ?? 24;
  const fallbackWeight = theme.typography?.h4?.fontWeight ?? 500;
  const fallbackColor = theme.palette?.text?.primary ?? "#000";

  const resolvedFamily = fontFamily ?? String(fallbackFamily);
  const resolvedWeight = fontWeight ?? fallbackWeight;

  // px に正規化
  const resolvedSizePx = useMemo(() => {
    if (typeof fontSize === "number") return fontSize;
    if (typeof fontSize === "string") return toPxSafe(fontSize);
    if (typeof fallbackSize === "string") return toPxSafe(fallbackSize);
    return (fallbackSize as number) || 24;
  }, [fontSize, fallbackSize]);

  const resolvedColor = color ?? fallbackColor;

  // コンテンツ（1文字ずつ縦積み）
  const content = typeof children === "string" ? children : text ?? "";
  const chars = useMemo(() => Array.from(content), [content]); // サロゲート対応

  // ------- DOM refs -------
  const containerRef = useRef<HTMLDivElement | null>(null);

  // タイル（縦に文字を積んだ画像）情報
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [tileHeightCss, setTileHeightCss] = useState<number>(0);
  const [tileWidthCss, setTileWidthCss] = useState<number>(0);

  // スクロール制御
  const posRef = useRef(0);
  const curSpeedRef = useRef(Math.max(0, speed));
  const targetSpeedRef = useRef(Math.max(0, speed));
  const lastTRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef<boolean>(false);

  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // ------- タイル生成：1文字ずつ描画して縦積み -------
  useEffect(() => {
    if (chars.length === 0) {
      setTileUrl(null);
      setTileHeightCss(0);
      setTileWidthCss(0);
      return;
    }

    let cancelled = false;

    const buildTile = () => {
      const dpr =
        typeof window !== "undefined"
          ? Math.max(1, window.devicePixelRatio || 1)
          : 1;

      // 計測
      const m = document.createElement("canvas").getContext("2d");
      if (!m) return;
      m.font = `${resolvedWeight} ${resolvedSizePx}px ${resolvedFamily}`;

      // 行高（縦積みの1段分の高さ）
      const met = m.measureText("M");
      const ascent = Math.ceil(
        met.actualBoundingBoxAscent || resolvedSizePx * 0.8
      );
      const descent = Math.ceil(
        met.actualBoundingBoxDescent || resolvedSizePx * 0.2
      );
      const lineH = Math.max(1, ascent + descent);

      // 各文字の幅を計測して最大幅を求める
      let maxW = 0;
      for (const ch of chars) {
        if (ch === "\n") continue;
        const w = Math.ceil(m.measureText(ch).width);
        if (w > maxW) maxW = w;
      }
      const padX = Math.ceil(resolvedSizePx * 0.15); // 少し左右余白
      const tileW = Math.max(1, maxW + padX * 2);

      // 高さ：文字段数 × 行高 + gap
      const visualLines = chars.reduce((n, ch) => n + (ch === "\n" ? 1 : 1), 0);
      const tileH = Math.max(1, visualLines * lineH + gap);

      // 実描画
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(tileW * dpr);
      canvas.height = Math.ceil(tileH * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, tileW, tileH);
      ctx.font = `${resolvedWeight} ${resolvedSizePx}px ${resolvedFamily}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = resolvedColor;

      let y = Math.round(lineH / 2); // 1段目の中心
      for (const ch of chars) {
        if (ch === "\n") {
          y += lineH; // 改行は1段進めるだけ
          continue;
        }
        const w = Math.ceil(ctx.measureText(ch).width);
        const x = Math.round((tileW - w) / 2); // 横中央寄せ
        ctx.fillText(ch, x, y);
        y += lineH;
      }

      if (!cancelled) {
        setTileUrl(canvas.toDataURL("image/png"));
        setTileHeightCss(tileH);
        setTileWidthCss(tileW);
      }
    };

    const doBuild = () => buildTile();
    const anyDoc = document as any;
    if (anyDoc.fonts?.ready?.then) {
      anyDoc.fonts.ready.then(doBuild).catch(doBuild);
    } else {
      doBuild();
    }

    const onResize = () => doBuild();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [
    chars,
    resolvedFamily,
    resolvedWeight,
    resolvedSizePx,
    resolvedColor,
    gap,
  ]);

  // ------- スクロール（背景 Y を更新） -------
  useEffect(() => {
    if (prefersReduce) return;
    if (!tileHeightCss || tileHeightCss <= 0) return;

    curSpeedRef.current = Math.max(0, speed);
    targetSpeedRef.current =
      hoveringRef.current && pauseOnHover ? 0 : Math.max(0, speed);

    const ease = 0.15;

    const loop = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000;
      lastTRef.current = t;

      const cur = curSpeedRef.current;
      const target = targetSpeedRef.current;
      let next = cur + (target - cur) * ease;
      if (Math.abs(next - target) < 0.001) next = target;
      if (next < 0) next = 0;
      curSpeedRef.current = next;

      const sign = direction === "up" ? 1 : -1;
      posRef.current =
        (((posRef.current + next * dt * sign) % tileHeightCss) +
          tileHeightCss) %
        tileHeightCss;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--bgy", `${-posRef.current}px`);
      }
      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTRef.current = null;
    };
  }, [tileHeightCss, speed, direction, pauseOnHover, prefersReduce]);

  // hover 停止（徐々に）
  const onEnter = () => {
    hoveringRef.current = true;
    if (pauseOnHover) targetSpeedRef.current = 0;
  };
  const onLeave = () => {
    hoveringRef.current = false;
    targetSpeedRef.current = Math.max(0, speed);
  };

  // 背景スタイル：縦方向にタイル
  const bgStyles =
    tileUrl && tileHeightCss > 0
      ? {
          backgroundImage: `url("${tileUrl}")`,
          backgroundRepeat: "repeat-y",
          backgroundSize: `${tileWidthCss}px ${tileHeightCss}px`,
          backgroundPosition: `50% var(--bgy, 0px)`,
        }
      : {};

  // 見やすい初期高さ
  const fallbackHeight = Math.max(1, tileHeightCss * 3);
  const resolvedHeight =
    typeof style?.height !== "undefined"
      ? style!.height
      : `${fallbackHeight}px`;

  // 幅はタイル幅に寄せる（未指定時）
  const fallbackWidth = tileWidthCss ? `${tileWidthCss}px` : "auto";
  const resolvedWidth =
    typeof style?.width !== "undefined" ? style!.width : fallbackWidth;

  return (
    <Box
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={className}
      style={style}
      sx={{
        width: resolvedWidth,
        position: "relative",
        overflow: "hidden",
        height: resolvedHeight,
        fontSize: `${resolvedSizePx}px`,
        margin: "0 auto", // 中央寄せ（幅が狭い時に見栄え良く）
        ...bgStyles,
        // 上下フェード
        ...(fade > 0 && fadeColor
          ? {
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                left: 0,
                right: 0,
                height: `${fade}px`,
                pointerEvents: "none",
                zIndex: 1,
              },
              "&::before": {
                top: 0,
                background: `linear-gradient(to bottom, ${fadeColor}, rgba(0,0,0,0))`,
              },
              "&::after": {
                bottom: 0,
                background: `linear-gradient(to top, ${fadeColor}, rgba(0,0,0,0))`,
              },
            }
          : {}),
        "@media (prefers-reduced-motion: reduce)": {
          backgroundAttachment: "local",
        },
      }}
      aria-label={content}
      role="img"
    />
  );
}
