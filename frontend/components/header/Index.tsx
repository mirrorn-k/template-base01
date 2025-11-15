"use client";

import { useState, useEffect } from "react";
import Content01 from "./Content01";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { usePathname } from "next/navigation";

export default function Main({}) {
  const [scrolled, setScrolled] = useState(false);

  // スラッグを取得
  const pathname = usePathname();
  const isTop = pathname === "/";

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20); // 20px以上スクロールしたら背景色ON
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <AppBar className={`appbar ${isTop && !scrolled && "transparent"}`}>
        <Toolbar>{<Content01 key={`header-content01`} />}</Toolbar>
      </AppBar>
      {!isTop && <AppBar className="appbar-shadow"></AppBar>}
    </>
  );
}
