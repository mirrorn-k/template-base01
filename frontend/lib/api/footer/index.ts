import getFetch from "@/lib/api/getFetch";
import { tFooterApiResponse, tFooterListContent, tFooterItem } from "./type";
import { tResponsiveMediaItem } from "@/lib/api/media/type";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";
import { INIT } from "./const";
import isBoolean from "@/lib/converter/isBoolean";

/**
 * フッター用コンテンツを取得
 */
export default async function getFooterContent(): Promise<tFooterItem> {
  try {
    const res: tFooterApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_FOOTER}?${process.env.NEXT_PUBLIC_MAP_API_FOOTER_PARAM}`
    );
    return convert(res.listContent[0]);
  } catch (e) {
    console.error("[getFooterContent] fetch error", e);
    return INIT;
  }
}

/**
 * Footer構造変換関数
 */
function convert(item: tFooterListContent): tFooterItem {
  //console.log("convert footer item", item);
  const logoItem = item.content_items.find((i) => i.label === "ロゴ");

  const logo: tFooterItem["logo"] = logoItem?.content
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
      (item.content_items.find((i) => i.label === "フッタータイプ")
        ?.raw_value as tFooterItem["type"]) ?? "Footer01",
    flgAddress: toBoolean("住所表示"),
    flgTel: toBoolean("電話番号表示"),
    flgFax: toBoolean("FAQ番号表示"),
    flgEmail: toBoolean("メールアドレス表示"),
    flgMenus: toBoolean("メニュー表示"),
    flgLogo: toBoolean("ロゴ表示"),
    logo,
    text:
      (item.content_items.find((i) => i.label === "テキスト")
        ?.raw_value as string) ?? "",
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
