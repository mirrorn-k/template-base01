"use client";

import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { usePathname } from "next/navigation";
import * as ContextMap from "@/contexts/MapData";
import Header01 from "@/components/header/Header01";

export default function Main() {
  const { site } = ContextMap.Contents();
  const [scrolled, setScrolled] = useState(false);

  const header = site.header;

  console.log("Headerコンテンツ", header);

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

  if ((isTop && !scrolled) || !header.flgShow) {
    return null;
  }

  return (
    <>
      <AppBar
        className={`header appbar ${isTop && !scrolled && "transparent"} ${
          !header.flgShow ? "un-viewable" : ""
        }`}
      >
        <Toolbar>
          {header.type === "header01" && <Header01 content={header} />}
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
