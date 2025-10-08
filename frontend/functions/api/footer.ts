import getFetch from "@/packages/api/getFetch";
import {
  FooterApiResponse,
  FooterListContent,
  tFooterItem,
} from "@/types/mapFooter";
import { tMediaContent } from "@/types/mapMediaContent";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import { tMedia } from "@/packages/component/media/type";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";

/**
 * フッター用コンテンツを取得
 */
export default async function getFooterContent(): Promise<tFooterItem> {
  const res: FooterApiResponse = await getFetch(
    `${process.env.NEXT_PUBLIC_MAP_API_FOOTER}?${process.env.NEXT_PUBLIC_MAP_API_FOOTER_PARAM}`
  );
  console.log("res", res.listContent[0].content_items);
  return convert(res.listContent[0]);
}

/**
 * Footer構造変換関数
 */
function convert(item: FooterListContent): tFooterItem {
  const logoItem = item.content_items.find((i) => i.label === "ロゴ");
  const textItem = item.content_items.find((i) => i.label === "テキスト");

  const logo: tFooterItem["logo"] = logoItem?.content
    ? normalizeResponsiveMedia(logoItem.content)
    : undefined;
  const text = textItem?.raw_value ?? "";

  return {
    uuid: item.uuid,
    logo,
    text,
  };
}

/**
 * 各ブレークポイントごとのメディアURL正規化
 */
function normalizeResponsiveMedia(content: tMediaContent): Responsive<tMedia> {
  const responsive: Responsive<tMedia> = {};
  const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;

  for (const bp of breakpoints) {
    const media = content?.[bp];
    if (media) {
      responsive[bp] = normalizeMediaUrl(media);
    }
  }

  return responsive;
}
