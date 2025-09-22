"use client";

import React from "react";
import { Box, Avatar, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type Align = "left" | "right";
export type Shape = "circle" | "rounded" | "square";

type Props = {
  imageSrc: string;
  name?: string;

  /** メッセージ文字列。children を渡した場合は children を優先表示 */
  message?: string;

  /** 任意のUI（選択肢ボタン・フォームなど）を直接挿入 */
  children?: React.ReactNode;

  align?: Align; // left=画像→吹き出し, right=吹き出し→画像
  bubbleBg?: string; // 吹き出し背景色

  // サイズ指定
  bubbleWidth?: number | string; // 固定幅
  minBubbleWidth?: number | string; // 最小幅
  maxBubbleWidth?: number | string; // 最大幅

  shape?: Shape; // circle / rounded / square
  imageWidth?: number; // 画像の幅(px)
  imageHeight?: number; // 画像の高さ(px)
  roundedRadius?: number; // shape="rounded" の角丸(px)
};

export default function Main({
  imageSrc,
  name,
  message,
  children,
  align = "left",
  bubbleBg,
  bubbleWidth,
  minBubbleWidth,
  maxBubbleWidth = 360,
  shape = "circle",
  imageWidth = 64,
  imageHeight = 64,
  roundedRadius = 8,
}: Props) {
  const isLeft = align === "left";
  const theme = useTheme();
  const bg = bubbleBg ?? theme.palette.background.paper;

  const borderRadius =
    shape === "circle" ? "50%" : shape === "rounded" ? `${roundedRadius}px` : 0;

  // ▲ 尾（しっぽ）
  const tailCommon = {
    content: '""',
    position: "absolute" as const,
    width: 0,
    height: 0,
    borderStyle: "solid",
    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
  };

  const tailLeft = {
    ...tailCommon,
    left: -8,
    top: 16,
    borderWidth: "8px 8px 8px 0",
    borderColor: "transparent var(--bubble-bg) transparent transparent",
  };

  const tailRight = {
    ...tailCommon,
    right: -8,
    top: 16,
    borderWidth: "8px 0 8px 8px",
    borderColor: "transparent transparent transparent var(--bubble-bg)",
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={1.5}
      flexDirection={isLeft ? "row" : "row-reverse"}
      sx={{ marginBottom: 2 }}
    >
      <Avatar
        src={imageSrc}
        alt={name || "person"}
        sx={{
          width: imageWidth,
          height: imageHeight,
          boxShadow: 1,
          flex: "0 0 auto",
          borderRadius,
          objectFit: "cover",
        }}
        variant={shape === "circle" ? "circular" : "square"}
      />

      <Paper
        elevation={2}
        sx={{
          position: "relative",
          width: bubbleWidth,
          minWidth: minBubbleWidth,
          maxWidth: maxBubbleWidth,
          p: 1.5,
          borderRadius: 2,
          "--bubble-bg": bg,
          bgcolor: "var(--bubble-bg)",
          "&:after": isLeft ? tailLeft : tailRight,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {name && (
          <Typography
            variant="caption"
            sx={{ opacity: 0.7, display: "block", mb: 0.25 }}
          >
            {name}
          </Typography>
        )}

        {message && <Typography variant="body1">{message}</Typography>}

        {children && <Box>{children}</Box>}
      </Paper>
    </Box>
  );
}
