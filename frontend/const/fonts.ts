export const FONT_TYPE_LIST = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
] as const;

// =====================
// fontMap
// =====================
export const fontMap = {
  noto: "'Noto Sans JP', sans-serif",
  notoSerif: "'Noto Serif JP', serif",
  mplus: "'M PLUS 1', sans-serif",
  kaku: "'Zen Kaku Gothic New', sans-serif",
  oldMincho: "'Zen Old Mincho', serif",
  shippori: "'Shippori Mincho', serif",
  kosugi: "'Kosugi Maru', sans-serif",
  inter: "'Inter', sans-serif",
} as const;

export type FontKey = keyof typeof fontMap;
