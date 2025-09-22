"use client";
import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { ReactNode } from "react";
import { useMediaQuery } from "@mui/material";
interface ResponsiveBoxProps extends BoxProps {
  maxWidth: "xs" | "sm" | "md" | "lg" | "xl"; // ブレイクポイントを指定
}

const ResponsiveBox: React.FC<ResponsiveBoxProps> = ({
  maxWidth,
  children,
  sx,
  ...rest // BoxProps の他のプロパティ
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: theme.breakpoints.values[maxWidth], // ブレイクポイントの値を取得して設定
        padding: theme.spacing(1),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default ResponsiveBox;

export const FlexBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "gapSize", // gapSizeをDOMに渡さないようにする
})<{ gapSize?: number }>(({ theme, gapSize }) => ({
  display: "flex",
  flexFlow: "row",
  gap: gapSize ? theme.spacing(gapSize) : theme.spacing(2),
}));

export const FlexColumnBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "gapSize", // gapSizeをDOMに渡さないようにする
})<{ gapSize?: number }>(({ theme, gapSize }) => ({
  display: "flex",
  flexFlow: "column",
  gap: gapSize ? theme.spacing(gapSize) : theme.spacing(2),
}));

export const CenteredBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "padding" && prop !== "margin",
})<{ padding?: string | number; margin?: string | number }>(
  ({ padding = 0, margin = 0 }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding,
    margin,
  })
);

interface FloatingBoxProps {
  children: React.ReactNode;
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  backgroundColor?: string;
  boxShadow?: string;
  zIndex?: number;
  borderRadius?: string | number;
  padding?: string | number;
}

export const FloatingBox = styled("div")<FloatingBoxProps>(
  ({
    top,
    bottom,
    left,
    right,
    zIndex = 1000,
    borderRadius = "8px",
    padding = "16px",
  }) => ({
    position: "fixed",
    top,
    bottom,
    left,
    right,
    zIndex,
    borderRadius,
    padding,
    overflow: "hidden", // 子要素がボックスを超えないようにする
  })
);

interface ResponsiveFlexProps extends BoxProps {
  children: ReactNode[];
  breakpoint?: "xs" | "sm" | "md" | "lg" | "xl";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  breakpoint = "lg",
  maxWidth = "lg",
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const isVertical = useMediaQuery(theme.breakpoints.down(breakpoint));
  const widthPercent = 100 / children.length;

  console.log("isVertical", isVertical);
  return (
    <Box
      display="flex"
      flexDirection={isVertical ? "column" : "row"}
      flexWrap="nowrap"
      width={"100%"}
      maxWidth={`${theme.breakpoints.values[maxWidth]}px`} // ブレイクポイントの値を取得して設定}
      height={isVertical ? "auto" : "auto"}
      sx={sx}
      gap={2}
      {...rest}
    >
      {children.map((child, idx) => (
        <Box
          key={idx}
          sx={{
            width: isVertical ? "100%" : `${widthPercent}%`,
            height: isVertical ? "auto" : "100%", // 横並び時に高さ揃える
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};
