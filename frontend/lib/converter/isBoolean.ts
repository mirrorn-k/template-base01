/**
 * 真偽値に変換（できなければfalseを返す）
 * @param val
 * @returns
 */
export default function isBoolean(val: unknown): boolean {
  if (val == null) return false;

  if (typeof val === "boolean") return val;

  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(lower)) return true;
    if (["false", "0", "no", "off"].includes(lower)) return false;
    return false;
  }

  if (typeof val === "number") {
    if (val === 1) return true;
    if (val === 0) return false;
    return false;
  }

  return false;
}
