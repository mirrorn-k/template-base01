"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "../Context";

export function PushCover() {
  const { isTransitioning, coverContent, duration } = useTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="push-cover"
          initial={{ x: "100%" }} // 画面の右外から
          animate={{ x: 0 }} // 画面全体を覆う
          exit={{ x: "-100%" }} // 左に抜けて消える
          transition={{ duration, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "black",
            zIndex: 9999,
          }}
        >
          {/* カバーの内容 */}
          push{coverContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
