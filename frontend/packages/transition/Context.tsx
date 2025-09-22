"use client";

import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { Cover, DefaultCover } from "./cover/Index";
import { motion, AnimatePresence } from "framer-motion";
import * as CoverFirst from "@/packages/transition/cover/First";

type TransitionContextType = {
  isFirstLoad: boolean;
  setIsFirstLoad: (v: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;
  startTransition: (
    href: string,
    options?: { content?: React.ReactNode; duration?: number }
  ) => void;
  coverContent: React.ReactNode | null;
  duration: number;
};

const TransitionContext = createContext<TransitionContextType>({
  isFirstLoad: true,
  setIsFirstLoad: () => {},
  isTransitioning: false,
  setIsTransitioning: () => {},
  startTransition: () => {},
  coverContent: <DefaultCover />,
  duration: 4.0,
});

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coverContent, setCoverContent] = useState<React.ReactNode | null>(
    <DefaultCover />
  );
  const [duration, setDuration] = useState(1.0);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 初回ロード時に一度カバーを出す
  useEffect(() => {
    if (!isFirstLoad) return;

    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isFirstLoad]);

  const startTransition = useCallback(
    (
      href: string,
      options?: { content?: React.ReactNode; duration?: number }
    ) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      setCoverContent(options?.content ?? <DefaultCover />);
      setDuration(options?.duration ?? duration);

      setTimeout(() => {
        router.push(href);
      }, (duration * 2000) / 2); // カバーが中央に来た時点で遷移
    },
    [isTransitioning, router, duration]
  );

  return (
    <TransitionContext.Provider
      value={{
        isFirstLoad,
        setIsFirstLoad,
        isTransitioning,
        setIsTransitioning,
        startTransition,
        coverContent,
        duration,
      }}
    >
      <div
        style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
      >
        <AnimatePresence>
          <motion.main
            key={`${pathname}`}
            initial={isFirstLoad ? { x: "0%" } : { x: "100%" }}
            animate={isTransitioning ? { x: "-100%" } : { x: "0%" }}
            transition={{ duration, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <Cover />
      <CoverFirst.default />
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
