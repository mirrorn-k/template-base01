// SSRでも安全な px 変換
export function toPxSafe(value: string, base = 16): number {
  if (value.endsWith("px")) return parseFloat(value);

  const factor = parseFloat(value);
  if (value.endsWith("rem") || value.endsWith("em")) {
    // サーバーでは window/document が無いのでフォールバック
    if (typeof window === "undefined") return factor * base;

    // クライアントのみ正確に計算
    const rootSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize || String(base)
    );
    const bodySize = parseFloat(
      getComputedStyle(document.body).fontSize || String(base)
    );
    return factor * (value.endsWith("rem") ? rootSize : bodySize);
  }

  const n = parseFloat(value);
  return isNaN(n) ? base : n;
}
