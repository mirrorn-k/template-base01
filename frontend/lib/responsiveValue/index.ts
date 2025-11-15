import { Breakpoint, Responsive } from "./type";
import { BREAK_POINT } from "./const";

export function getResponsiveValue<T>(
  values: Responsive<T>,
  bp: Breakpoint,
  minBp: Breakpoint = "xs",
  maxBp: Breakpoint = "xl",
  prefer: "down" | "up" = "down",
  searchDown: boolean = true,
  searchUp: boolean = true,
  defaultValue: T | undefined = undefined
): T | undefined {
  if (!values) {
    return defaultValue;
  }

  const idx = BREAK_POINT.indexOf(bp);
  const minIdx = BREAK_POINT.indexOf(minBp);
  const maxIdx = BREAK_POINT.indexOf(maxBp);

  if (minIdx === -1 || maxIdx === -1 || idx === -1) return defaultValue;

  const from = Math.min(minIdx, maxIdx);
  const to = Math.max(minIdx, maxIdx);

  if (idx < from || idx > to) return defaultValue;

  // 1. 指定bp
  if (values[bp] != null) return values[bp]!;

  // 2. 探索順を prefer で切り替え
  const directions: ("down" | "up")[] =
    prefer === "down" ? ["down", "up"] : ["up", "down"];

  for (const dir of directions) {
    if (dir === "down" && searchDown) {
      for (let i = idx - 1; i >= from; i--) {
        const val = values[BREAK_POINT[i]];
        if (val != null) return val;
      }
    }
    if (dir === "up" && searchUp) {
      for (let i = idx + 1; i <= to; i++) {
        const val = values[BREAK_POINT[i]];
        if (val != null) return val;
      }
    }
  }

  // 3. fallback
  return defaultValue;
}
