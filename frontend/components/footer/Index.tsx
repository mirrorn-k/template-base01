"use client";

import Footer01 from "./Footer01";
import Footer02 from "./Footer02";
import * as ContextMap from "@/contexts/MapData";

export default function Main() {
  const { site } = ContextMap.Contents();

  const footer = site["footer"];

  console.log("Footerコンテンツ", footer);

  if (footer.type === "footer01") {
    return <Footer01 footer={footer} />;
  } else if (footer.type === "footer02") {
    return <Footer02 footer={footer} />;
  } else {
    console.log("未対応のスタイル", footer);
    return <></>;
  }
}
