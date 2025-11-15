"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { toPxSafe } from "./functions";

type Props = {
  /** 流すテキスト（childrenが string の場合は children 優先） */
  text?: string;
  children?: React.ReactNode;

  /** 基準速度（px/s）。大きいほど速い */
  speed?: number; // default 90

  /** 方向 */
  direction?: "left" | "right"; // default "left"

  /** 文字のあいだの余白（px）。タイルの右端に空ける余白 */
  gap?: number; // default 16

  /** hover で徐々に停止/再加速する */
  pauseOnHover?: boolean; // default true

  /** フォント指定（未指定は theme.typography.h4 を使用） */
  fontFamily?: string;
  fontSize?: number | string; // px か "1rem" など
  fontWeight?: number | string; // 400 / "bold" など
  color?: string; // 例: theme.palette.text.primary

  /** 端フェード（見た目用） */
  fade?: number; // px
  fadeColor?: string; // 背景色に合わせる

  className?: string;
  style?: React.CSSProperties;
};

export default function Marquee({
  text,
  children,
  speed = 90,
  direction = "left",
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

  // --- フォント既定値（theme.typography.h4） ---
  const fallbackFamily =
    theme.typography?.h4?.fontFamily ??
    theme.typography?.fontFamily ??
    "sans-serif";
  const fallbackSize = theme.typography?.h4?.fontSize ?? 24; // 文字列の可能性もある
  const fallbackWeight = theme.typography?.h4?.fontWeight ?? 500;
  const fallbackColor = theme.palette?.text?.primary ?? "#000";

  const resolvedFamily = fontFamily ?? String(fallbackFamily);
  const resolvedWeight = fontWeight ?? fallbackWeight;

  // fontSize は px 数値に正規化（"1rem" なども px に）
  const resolvedSizePx = useMemo(() => {
    if (typeof fontSize === "number") return fontSize;
    if (typeof fontSize === "string") return toPxSafe(fontSize);
    if (typeof fallbackSize === "string") return toPxSafe(fallbackSize);
    return (fallbackSize as number) || 24;
  }, [fontSize, fallbackSize]);

  const resolvedColor = color ?? fallbackColor;

  // コンテンツ文字列（children が string のときは優先）
  const content = typeof children === "string" ? children : text ?? "";

  // --- DOM refs ---
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 背景（タイル）情報
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [tileWidthCss, setTileWidthCss] = useState<number>(0); // CSS px 単位のタイル幅
  const [lineHeightPx, setLineHeightPx] = useState<number>(
    Math.ceil(resolvedSizePx * 1.2)
  ); // 背景高さ目安

  // スクロール制御（背景位置）
  const posRef = useRef(0); // 0..tileWidthCss
  const curSpeedRef = useRef(Math.max(0, speed));
  const targetSpeedRef = useRef(Math.max(0, speed));
  const lastTRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hoveringRef = useRef<boolean>(false);

  // 方向
  //const dirSign = direction === "left" ? 1 : -1;

  // prefers-reduced-motion
  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- タイル再生成: テキスト / フォント / gap / DPR 変化時 ---
  useEffect(() => {
    if (!content) {
      setTileUrl(null);
      setTileWidthCss(0);
      return;
    }

    let cancelled = false;

    const buildTile = () => {
      const dpr =
        typeof window !== "undefined"
          ? Math.max(1, window.devicePixelRatio || 1)
          : 1;

      // 1) 計測用 Canvas
      const measureCanvas = document.createElement("canvas");
      const mctx = measureCanvas.getContext("2d");
      if (!mctx) return;

      // CSSショートハンド： font-weight font-size font-family
      mctx.font = `${resolvedWeight} ${resolvedSizePx}px ${resolvedFamily}`;
      // 文字幅（絵文字なども含めておおよそ）
      const textWidth = Math.ceil(mctx.measureText(content).width);

      const tileWidth = Math.max(1, textWidth + gap); // 右側 gap を1回分
      // 高さは ascent/descent が取れればそれを使う
      const metrics = mctx.measureText(content);
      const ascent = Math.ceil(
        metrics.actualBoundingBoxAscent || resolvedSizePx * 0.8
      );
      const descent = Math.ceil(
        metrics.actualBoundingBoxDescent || resolvedSizePx * 0.2
      );
      const canvasHeight = ascent + descent + Math.ceil(resolvedSizePx * 0.2); // 少し余裕
      //const baselineY = ascent;

      // 2) 実描画用 Canvas（HiDPI）
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(tileWidth * dpr);
      canvas.height = Math.ceil(canvasHeight * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, tileWidth, canvasHeight);

      ctx.font = `${resolvedWeight} ${resolvedSizePx}px ${resolvedFamily}`;
      ctx.textBaseline = "middle";
      // 文字のぼかしを減らすために整数座標に置く
      const x = 0;
      const y = canvasHeight / 2;

      ctx.fillStyle = resolvedColor;
      ctx.fillText(content, x, y);

      // 3) dataURL と CSS px 幅の保存
      if (!cancelled) {
        setTileUrl(canvas.toDataURL("image/png"));
        setTileWidthCss(tileWidth);
        setLineHeightPx(canvasHeight);
      }
    };

    // フォントロード後に再測定（対応ブラウザ）
    const doBuild = () => buildTile();
    const anyDoc = document;
    if (
      anyDoc.fonts &&
      anyDoc.fonts.ready &&
      typeof anyDoc.fonts.ready.then === "function"
    ) {
      anyDoc.fonts.ready.then(doBuild).catch(doBuild);
    } else {
      doBuild();
    }

    // DPR 変化を拾いたい場合（Macの表示変更等）
    const onResize = () => {
      doBuild();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [
    content,
    resolvedFamily,
    resolvedWeight,
    resolvedSizePx,
    resolvedColor,
    gap,
  ]);

  // --- スクロールエンジン（背景位置を更新） ---
  useEffect(() => {
    if (prefersReduce) return; // 動き控えめ
    if (!tileWidthCss || tileWidthCss <= 0) return;

    // hoverの初期ターゲット速度
    curSpeedRef.current = Math.max(0, speed);
    targetSpeedRef.current =
      hoveringRef.current && pauseOnHover ? 0 : Math.max(0, speed);

    const ease = 0.15; // 速度追従率

    const loop = (t: number) => {
      if (lastTRef.current == null) lastTRef.current = t;
      const dt = (t - lastTRef.current) / 1000; // 秒
      lastTRef.current = t;

      // 速度を目標へ滑らかに
      const cur = curSpeedRef.current;
      const target = targetSpeedRef.current;
      let next = cur + (target - cur) * ease;

      if (Math.abs(next - target) < 0.001) next = target; // しきい値でスナップ
      if (next < 0) next = 0;

      curSpeedRef.current = next;

      // 位置更新（背景は常に左方向が正。右流しは pos を逆向きに進める）
      const delta = next * dt * (direction === "left" ? 1 : -1);
      posRef.current += delta;

      // 正規化（0..tileWidthCss）
      const d = tileWidthCss || 1;
      posRef.current = ((posRef.current % d) + d) % d;

      // 反映：CSS変数 --bgx を更新（背景スクロール）
      if (containerRef.current) {
        containerRef.current.style.setProperty("--bgx", `${-posRef.current}px`);
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTRef.current = null;
    };
  }, [tileWidthCss, speed, direction, pauseOnHover, prefersReduce]);

  // hover イベント
  const onEnter = () => {
    hoveringRef.current = true;
    if (pauseOnHover) targetSpeedRef.current = 0;
  };
  const onLeave = () => {
    hoveringRef.current = false;
    targetSpeedRef.current = Math.max(0, speed);
  };

  // 背景スタイル
  const bgStyles =
    tileUrl && tileWidthCss > 0
      ? {
          backgroundImage: `url("${tileUrl}")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: `${tileWidthCss}px auto`,
          backgroundPosition: `var(--bgx, 0px) 50%`,
        }
      : {};

  return (
    <Box
      ref={containerRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={className}
      style={style}
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        // 高さはタイルの高さに合わせる（行高）
        height: `${Math.max(1, lineHeightPx)}px`,
        // 視覚サイズとしてのフォントは参考（SR向け/将来の拡張用）
        fontSize: `${resolvedSizePx}px`,
        // 背景で描いているのでテキストノードは持たない
        ...bgStyles,
        // 端フェード
        ...(fade > 0 && fadeColor
          ? {
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                width: `${fade}px`,
                pointerEvents: "none",
                zIndex: 1,
              },
              "&::before": {
                left: 0,
                background: `linear-gradient(to right, ${fadeColor}, rgba(0,0,0,0))`,
              },
              "&::after": {
                right: 0,
                background: `linear-gradient(to left, ${fadeColor}, rgba(0,0,0,0))`,
              },
            }
          : {}),
        // 動きを減らす
        "@media (prefers-reduced-motion: reduce)": {
          backgroundAttachment: "local",
        },
      }}
      aria-label={content} // SR向けに内容を伝える
      role="img"
    />
  );
}
