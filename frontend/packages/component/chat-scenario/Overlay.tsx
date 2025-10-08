// SpeechBubbleOverlay.tsx
"use client";

import React from "react";
import { Box, Avatar, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Props = {
  imageSrc: string;
  name?: string;
  message: string;
  avatarSize?: number; // デフォルト 160
  corner?: Corner; // デフォルト "top-right"
  offset?: number; // デフォルト 8px（内側: +, outside時は - にして配置）
  outside?: boolean; // デフォルト false（画像の外にはみ出させない）
  maxBubbleWidth?: number; // デフォルト 320
  bubbleBg?: string; // 吹き出し背景色（未指定なら theme.palette.background.paper）
  tailBase?: number; // しっぽのベース幅（px） デフォルト 18
};

export default function SpeechBubbleOverlay({
  imageSrc,
  name,
  message,
  avatarSize = 160,
  corner = "top-right",
  offset = 8,
  outside = false,
  maxBubbleWidth = 320,
  bubbleBg,
  tailBase = 18,
}: Props) {
  const theme = useTheme();
  const bg = bubbleBg ?? theme.palette.background.paper;

  // Paper の位置（角＋オフセット）
  const pos: Record<Corner, any> = {
    "top-left": {
      top: outside ? -offset : offset,
      left: outside ? -offset : offset,
    },
    "top-right": {
      top: outside ? -offset : offset,
      right: outside ? -offset : offset,
    },
    "bottom-left": {
      bottom: outside ? -offset : offset,
      left: outside ? -offset : offset,
    },
    "bottom-right": {
      bottom: outside ? -offset : offset,
      right: outside ? -offset : offset,
    },
  };

  // 画像中心を向かせる回転角（deg）
  const towardCenterDeg: Record<Corner, number> = {
    "top-left": 45,
    "top-right": 135,
    "bottom-left": -45,
    "bottom-right": -135,
  };

  // ▼ 120°/30°/30°のしっぽ（三角）をSVGで描く
  // 仕様：頂点（鈍角120°）が (0,0)。ベースは y = h 上に左右 ±0.5
  // 基本長を1とすると、h = (base/2) * tan(30°) = 0.5 * 0.57735... = 0.288675
  const base = 1; // 正規化ベース長
  const half = base / 2; // 0.5
  const h = half * 0.57735026919; // ≒0.288675
  const viewBox = "-0.5 -0.05 1 0.45"; // 余白分を含めた viewBox

  // SVG の実寸（px）
  // しっぽ全体の高さは h/base 比で tailBase に比例
  const svgW = tailBase;
  const svgH = (0.45 / 1.0) * tailBase; // viewBox縦幅に合わせておく（ざっくりでOK）

  // 四隅ごとのアンカー位置（Paperの角にピタ付け）と回転
  const cornerAnchorStyle: Record<Corner, React.CSSProperties> = {
    "top-left": {
      left: 0,
      top: 0,
      transform: `translate(-1px, -1px) rotate(${towardCenterDeg["top-left"]}deg)`,
    },
    "top-right": {
      right: 0,
      top: 0,
      transform: `translate(1px, -1px) rotate(${towardCenterDeg["top-right"]}deg)`,
    },
    "bottom-left": {
      left: 0,
      bottom: 0,
      transform: `translate(-1px, 1px) rotate(${towardCenterDeg["bottom-left"]}deg)`,
    },
    "bottom-right": {
      right: 0,
      bottom: 0,
      transform: `translate(1px, 1px) rotate(${towardCenterDeg["bottom-right"]}deg)`,
    },
  };

  // しっぽ（SVG）は Paper 上に absolutely 置く
  const Tail = () => (
    <svg
      width={svgW}
      height={svgH}
      viewBox={viewBox}
      style={{
        position: "absolute",
        pointerEvents: "none",
        // 角ごとの配置＋回転（画像中心へ向く）
        ...cornerAnchorStyle[corner],
        // 回転中心を頂点(0,0)に近づけるため、少し上寄せ
        transformOrigin: "0% 0%",
        overflow: "visible",
        filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
      }}
    >
      {/* 頂点(0,0)（鈍角120°）、ベース端（±0.5, h） */}
      <polygon
        points={`0,0 ${-half},${h} ${half},${h}`}
        fill="var(--bubble-bg)"
      />
    </svg>
  );

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: avatarSize,
        height: avatarSize,
      }}
    >
      <Avatar
        src={imageSrc}
        alt={name || "person"}
        sx={{ width: avatarSize, height: avatarSize, display: "block" }}
      />

      <Paper
        elevation={4}
        sx={{
          position: "absolute",
          maxWidth: maxBubbleWidth,
          p: 1.25,
          borderRadius: 2,
          zIndex: 2,
          "--bubble-bg": bg,
          bgcolor: "var(--bubble-bg)",
          ...pos[corner],
        }}
      >
        {/* しっぽ（120/30/30） */}
        <Tail />

        {name && (
          <Typography
            variant="caption"
            sx={{ opacity: 0.7, display: "block", mb: 0.25 }}
          >
            {name}
          </Typography>
        )}
        <Typography variant="body2">{message}</Typography>
      </Paper>
    </Box>
  );
}
