import getFetch from "@/lib/api/getFetch";
import { tHeaderApiResponse, tHeaderListContent, tHeaderItem } from "./type";
import { tResponsiveMediaItem } from "@/lib/api/media/type";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";
import { INIT } from "./const";
import isBoolean from "@/lib/converter/isBoolean";

/**
 * フッター用コンテンツを取得
 */
export default async function getHeaderContent(): Promise<tHeaderItem> {
  try {
    const res: tHeaderApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_HEADER}?${process.env.NEXT_PUBLIC_MAP_API_HEADER_PARAM}`
    );
    return convert(res.listContent[0]);
  } catch (e) {
    console.error("[getHeaderContent] fetch error", e);
    return INIT;
  }
}

/**
 * Footer構造変換関数
 */
function convert(item: tHeaderListContent): tHeaderItem {
  const logoItem = item.content_items.find((i) => i.label === "ロゴ");

  const logo: tHeaderItem["logo"] = logoItem?.content
    ? normalizeResponsiveMedia(logoItem.content as tResponsiveMediaItem)
    : undefined;

  const toBoolean = (label: string): boolean => {
    const target = item.content_items.find((i) => i.label === label);
    if (!target) return false;
    return isBoolean(target.raw_value);
  };

  return {
    uuid: item.uuid,
    type:
      (item.content_items.find((i) => i.label === "ヘッダタイプ")
        ?.raw_value as tHeaderItem["type"]) ?? "Header01",
    siteName:
      (item.content_items.find((i) => i.label === "サイト名")
        ?.raw_value as string) ?? "",
    flg: toBoolean("ヘッダ非表示") ? false : true, // フラグが逆転するのに注意
    flgMenus: toBoolean("メニュー表示"),
    flgContactButton: toBoolean("問い合わせ表示"),
    flgLogo: toBoolean("ロゴ表示"),
    logo,
  };
}

/**
 * 各ブレークポイントごとのメディアURL正規化
 */
function normalizeResponsiveMedia(
  mediaItems: tResponsiveMediaItem
): Responsive<tMedia> {
  const responsive: Responsive<tMedia> = {};
  const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;

  for (const bp of breakpoints) {
    const media = mediaItems?.[bp];
    if (media) {
      responsive[bp] = normalizeMediaUrl(media);
    }
  }

  return responsive;
}
