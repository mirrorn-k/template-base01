// components/SiteInfoHead.tsx
import { tSiteInfo } from "./type";

export default async function SiteInfoHead({
  info,
}: {
  info: tSiteInfo | null;
}) {
  if (!info) return null;

  return (
    <>
      {/* favicon */}
      {info.favicon?.url && (
        <link rel="icon" href={info.favicon.url} sizes="any" />
      )}

      {/* Apple Touch Icon */}
      {info.appleTouchIcon?.url && (
        <link rel="apple-touch-icon" href={info.appleTouchIcon.url} />
      )}

      {/* 外部CSS */}
      {info.externalCss && (
        <style dangerouslySetInnerHTML={{ __html: info.externalCss }} />
      )}

      {/* 外部スクリプト */}
      {info.externalScript && (
        <script dangerouslySetInnerHTML={{ __html: info.externalScript }} />
      )}

      {/* 構造化データ */}
      {info.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: info.jsonLd }}
        />
      )}
    </>
  );
}
