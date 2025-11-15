"use client";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * モバイル端末の場合はtrue
 * @param param0
 * @returns
 */
export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.only("xs"));
}

/**
 * タブレット端末の場合は true
 * @param param0
 * @returns
 */
export function useIsTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.between("sm", "lg"));
}

/**
 * PC端末の場合はtrue
 * @param param0
 * @returns
 */
export function useIsDesktop() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up("lg"));
}

/**
 * タブレット端末以下の場合はtrue
 * @param param0
 * @returns
 */
export function useIsDownTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
}

/**
 * タブレット端末以下の場合はtrue
 * @param param0
 * @returns
 */
export function useIsUnderTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
}

/**
 * タブレット端末以上の場合はtrue
 * @param param0
 * @returns
 */
export function useIsOverTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up("md"));
}

/**
 * 以下を調べる
 * @param param0
 * @returns
 */
export function useIsDown(str: "xs" | "sm" | "md" | "lg" | "xl") {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(str));
}

/**
 * 以上を調べる
 * @param param0
 * @returns
 */
export function useIsOver(str: "xs" | "sm" | "md" | "lg" | "xl") {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(str));
}

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type SizeMap = Partial<Record<Breakpoint, number>>;

/**
 * 現在のブレイクポイントからサイズを取得する
 * @param inputMap
 * @returns
 */
export const useResponsiveSize = (inputMap: SizeMap) => {
  const theme = useTheme();

  // ブレイクポイント順
  const order: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];

  // 補完されたマップを生成
  const filledMap: Record<Breakpoint, number> = (() => {
    const result: Record<Breakpoint, number> = {
      xs: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
    };
    for (let i = 0; i < order.length; i++) {
      const key = order[i];
      if (inputMap[key] !== undefined) {
        result[key] = inputMap[key]!;
      } else if (i > 0) {
        result[key] = result[order[i - 1]];
      }
      // xsだけは常に0でOK
    }
    return result;
  })();

  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  if (isXs) return filledMap.xs;
  if (isSm) return filledMap.sm;
  if (isMd) return filledMap.md;
  if (isLg) return filledMap.lg;
  if (isXl) return filledMap.xl;

  return filledMap.xs; // fallback
};
