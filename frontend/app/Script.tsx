"use client";
import { tSiteInfo } from "@/lib/api/siteInfo/type";
import Script from "next/script";
import * as GtmScript from "@/components/google/GtmScript";

export default function Sccript({
  info,
  gtmTag,
}: {
  info: tSiteInfo | null;
  gtmTag?: string;
}) {
  if (!info) return null;

  return (
    <>
      {gtmTag && <GtmScript.Header tag={gtmTag} />}

      <Script
        src={`${process.env.NEXT_PUBLIC_MAP_JS_EVENTDATA}`}
        strategy="afterInteractive"
      />

      {/* 外部スクリプト（next/script を使う） */}
      {info.externalScript && (
        <Script
          id="external-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: info.externalScript }}
        />
      )}

      {/* 構造化データ（これも next/script） */}
      {info.jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: info.jsonLd }}
        />
      )}
    </>
  );
}
