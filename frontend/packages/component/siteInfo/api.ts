// functions/api/siteInfo.ts
import getFetch from "@/packages/core/api/getFetch";
import { tSiteInfo, tSiteInfoContent } from "./type";

/**
 * サイト情報を取得
 * 最新（最終更新日が最大）の1件を返す
 */
export default async function getSiteInfo(): Promise<tSiteInfo | null> {
  try {
    const res = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_SITEINFO}?${process.env.NEXT_PUBLIC_MAP_API_SITEINFO_PARAM}`
    );

    // APIレスポンス型に合わせて変換
    if (!res?.listContent || res.listContent.length === 0) return null;

    const list = res.listContent as tSiteInfoContent[];
    // 最終更新日時でソートして最新を取得
    const latest = list.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )[0];

    return convert(latest);
  } catch (err) {
    console.error("[getSiteInfo] Error:", err);
    return null;
  }
}

function convert(data: tSiteInfoContent): tSiteInfo {
  const result: tSiteInfo = {};

  data.content_items.forEach((item) => {
    const key = item.label.trim();

    switch (key) {
      case "ロゴ":
        result.logo = item.content ?? undefined;
        break;
      case "ファビコン":
        result.favicon = item.content ?? undefined;
        break;
      case "Apple Touch Icon":
        result.appleTouchIcon = item.content ?? undefined;
        break;
      case "サイトURL":
        result.siteUrl = item.raw_value ?? undefined;
        break;
      case "OGPデフォルト画像":
        result.defaultOGP = item.content ?? undefined;
        break;
      case "GTMタグ":
        result.gtmId = item.raw_value ?? undefined;
        break;
      case "メンテナンスモード":
        result.maintenance =
          item.raw_value === "1" || item.raw_value === "true";
        break;
      case "copylight表記":
      case "copyright表記": // 万一のラベルゆれ対策
        result.copyright = item.raw_value ?? undefined;
        break;
      case "外部スクリプト":
        result.externalScript = item.raw_value ?? undefined;
        break;
      case "外部CSS追加":
        result.externalCss = item.raw_value ?? undefined;
        break;
      case "構造化データ":
        result.jsonLd = item.raw_value ?? undefined;
        break;
    }
  });

  return result;
}
