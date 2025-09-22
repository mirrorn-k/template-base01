"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Box } from "@mui/material";
import { useTransition } from "../Context";

export default function Cover() {
  const { isFirstLoad, coverContent, duration } = useTransition();

  return (
    <AnimatePresence>
      {isFirstLoad && (
        <motion.div
          key="cover-first"
          initial={{ x: 0 }} // 👈 ここが重要
          exit={{ x: "-100%" }}
          transition={{ duration, ease: "easeInOut" }} // ← Contextから取得
          style={{
            position: "fixed",
            left: 0,
            inset: 0,
            background: "black",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "2rem",
            backgroundColor: "black",
          }}
        >
          {coverContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const DefaultCover = () => {
  return (
    <Box sx={{ width: "100%", height: "100%", backgroundColor: "red" }}>
      {/* ここに何回目の訪問かなどを書く */}
      Loading...
    </Box>
  );
};
