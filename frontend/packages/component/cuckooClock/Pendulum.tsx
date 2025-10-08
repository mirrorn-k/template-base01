import * as React from "react";
import { motion } from "framer-motion";

/**
 * 振り子（中心からぶら下がる単振り子風アニメ）
 *
 * @remarks
 * - 親から絶対配置され、支点は要素の「上中央」です（transform-origin）。
 * - 秒同期（`sync="second"`）を使うと、次の秒頭でスイングを開始します。
 *
 * @example
 * ```tsx
 * <Pendulum periodMs={2000} amplitudeDeg={14} sync="second" />
 * ```
 */
export interface Props {
  /**
   * 1往復（左→右→左）の周期（ミリ秒）
   * @defaultValue 2000
   */
  periodMs?: number;

  /**
   * 棒（ロッド）の長さ（px）
   * @defaultValue 110
   */
  lengthPx?: number;

  /**
   * おもり（ボブ）の直径（px）
   * @defaultValue 24
   */
  bobSizePx?: number;

  /**
   * 最大振れ角（度）。左右対称に `±amplitudeDeg` 回転します
   * @defaultValue 16
   */
  amplitudeDeg?: number;

  /**
   * 秒同期モード。
   * - `"none"`: 同期しない（初回レンダー直後に開始）
   * - `"second"`: 次の「秒頭」にアニメ開始（メトロノーム的に気持ちよく揃います）
   * @defaultValue "none"
   */
  sync?: "none" | "second";

  /**
   * 棒の先端が丸にどれだけ食い込むか（px）。
   * 見た目の隙間を消すための微調整。
   * @defaultValue 1
   */
  attachOverlapPx?: number;

  /**
   * コンテナ（振り子全体）の上端Y位置。親要素に対する絶対配置のための微調整向け。
   * @defaultValue 190
   */
  topOffsetPx?: number;
}

export function Main() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 80,
        display: "flex",
        gap: 40,
      }}
    >
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, 4, 0] }}
          transition={{
            duration: 1.6 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 10,
            height: 48,
            borderRadius: 6,
            background: "linear-gradient(180deg,#a98c5a,#7a603e)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.3)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * 振り子（中心からぶら下がる単振り子風アニメ）
 * @param param0
 * @returns
 */
export function Pendulum({
  periodMs = 2000,
  lengthPx = 110,
  bobSizePx = 24,
  amplitudeDeg = 16,
  sync = "none",
  attachOverlapPx = 1, // ★棒が丸に何px食い込むか（0でピッタリ）
}: Props) {
  const [key, setKey] = React.useState(0);

  // 秒同期：次の秒頭でアニメ再スタート
  React.useEffect(() => {
    if (sync !== "second") return;
    const delay = 1000 - new Date().getMilliseconds();
    const id = window.setTimeout(() => setKey((k) => k + 1), delay);
    return () => window.clearTimeout(id);
  }, [sync]);

  // コンテナの高さ = 棒の長さ + 丸の直径 - 重なり
  const H = lengthPx + bobSizePx - attachOverlapPx;

  return (
    <div
      style={{
        position: "absolute",
        top: 190, // 本体に合わせて微調整
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      <motion.div
        key={key}
        initial={{ rotate: -amplitudeDeg }}
        animate={{ rotate: [-amplitudeDeg, amplitudeDeg, -amplitudeDeg] }}
        transition={{
          duration: periodMs / 1000,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          // ★回転グループは「上中央」を支点に
          transformOrigin: "top center",
          position: "relative",
          width: bobSizePx, // 丸の幅に合わせる（センター基準が安定）
          height: H,
        }}
      >
        {/* 棒（ロッド）：上端から下へ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 2,
            height: lengthPx,
            background: "linear-gradient(180deg,#b9b9b9,#8c8c8c)",
            boxShadow: "0 0 1px rgba(0,0,0,.4)",
          }}
        />

        {/* おもり（ボブ）：棒の先端にぴたり */}
        <div
          style={{
            position: "absolute",
            top: lengthPx - attachOverlapPx, // ★ここで“重なり量”を調整
            left: "50%",
            transform: "translateX(-50%)",
            width: bobSizePx,
            height: bobSizePx,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #ffd27a, #cc8a2b)",
            boxShadow:
              "0 6px 10px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.6)",
            border: "1px solid rgba(0,0,0,.2)",
          }}
        />
      </motion.div>
    </div>
  );
}
