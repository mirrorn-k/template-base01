"use client";

import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { usePathname } from "next/navigation";
import * as ContextMap from "@/contexts/MapData";
import Header01 from "@/components/header/Header01";

export default function Main() {
  const { header } = ContextMap.Contents();
  const [scrolled, setScrolled] = useState(false);

  // スラッグを取得
  const pathname = usePathname();
  const isTop = pathname === "/";

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20); // 20px以上スクロールしたら背景色ON
    };

    handler();

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <AppBar
        className={`appbar ${isTop && !scrolled && "transparent"} ${
          !header.flg ? "un-viewable" : ""
        }`}
      >
        <Toolbar>
          {header.type === "Header01" && (
            <Header01 key={`header-Header01-${header.uuid}`} content={header} />
          )}
        </Toolbar>
      </AppBar>
      {!isTop && (
        <AppBar
          className={`appbar-shadow ${!header.flg && "un-viewable"}`}
        ></AppBar>
      )}
    </>
  );
}
