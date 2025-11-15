"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Box } from "@mui/material";
import { useTransition } from "../Context";

export function Cover() {
  const { isTransitioning, isFirstLoad, coverContent, duration } =
    useTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="cover-index"
          initial={isFirstLoad ? { x: "0%" } : { x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration, ease: "easeInOut" }} // ← Contextから取得
          style={{
            position: "fixed",
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

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function Link({ href, children }: Props) {
  const { startTransition } = useTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(href);
      }}
    >
      {children}
    </a>
  );
}

export const DefaultCover = () => {
  return (
    <Box sx={{ width: "100%", height: "100%", backgroundColor: "red" }}>
      Loading...
    </Box>
  );
};
