import { motion } from "framer-motion";

// components/timed/SplitClockReveal.tsx 内で利用する補助
export default function SpeakerPulse({
  ringColor = "rgba(255,255,255,0.22)", // リング色
  ringWidth = 2, // 線の太さ(px)
  ringCount = 3, // 同時リング数
  periodMs = 1400, // 拡散時間(ms)
  maxScale = 1.2, // 到達スケール
  initialSize = "20%", // ★ 新しい props: 初期サイズを小さく
  blend = "screen",
}: {
  ringColor?: string;
  ringWidth?: number;
  ringCount?: number;
  periodMs?: number;
  maxScale?: number;
  initialSize?: string; // % や px 指定
  blend?: React.CSSProperties["mixBlendMode"];
}) {
  const rings = Array.from({ length: ringCount });

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "flex", // ★中央寄せに効かせる
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {rings.map((_, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            width: initialSize, // ★ 初期サイズを小さめに
            height: initialSize,
            borderRadius: "50%",
            border: `${ringWidth}px solid ${ringColor}`,
            mixBlendMode: blend,
            filter: "blur(0.3px)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, maxScale, maxScale + 0.02],
          }}
          transition={{
            duration: periodMs / 1000,
            ease: "easeOut",
            repeat: Infinity,
            delay: (i * periodMs) / ringCount / 1000,
          }}
        />
      ))}
    </div>
  );
}
