// packages/api/getMenu.ts
import getFetch from "@/packages/api/getFetch";
import {
  MenuItem,
  MenuApiResponse,
  ContentItem,
  ListContent,
} from "@/types/mapMenu";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import { tMedia } from "@/packages/component/media/type";

/**
 * メニュー情報を API から取得する
 */
export default async function getMenus(): Promise<MenuItem[]> {
  const res: MenuApiResponse = await getFetch(
    `${process.env.NEXT_PUBLIC_MAP_API_MENU}?${process.env.NEXT_PUBLIC_MAP_API_MENU_PARAMS}`
  );
  return convert(res);
}

/**
 * APIレスポンスを MenuItem[] に変換
 */
function convert(res: MenuApiResponse): MenuItem[] {
  if (!res?.listContent || !Array.isArray(res.listContent)) return [];

  return res.listContent.map((content: ListContent) => {
    const obj: Partial<MenuItem> = {};

    obj.uuid = content.uuid;

    for (const item of content.content_items) {
      switch (item.label) {
        case "名称":
          obj.label = item.raw_value ?? "";
          break;

        case "スラッグ":
          obj.slug = item.raw_value ?? "";
          break;

        case "KV":
          obj.img = convertImage(item);
          break;
      }
    }

    return obj as MenuItem;
  });
}

/**
 * KV項目の content を解析して Responsive<tMedia> に変換
 * normalizeMediaUrl は単一メディア専用のため、各breakpointごとに適用
 */
function convertImage(item: ContentItem): Responsive<tMedia> | undefined {
  const c = item.content;
  if (!c) return undefined;

  const responsive: Responsive<tMedia> = {};

  // レスポンシブ構造 (xs, sm, md, lg, xl)
  if ("xs" in c || "lg" in c) {
    for (const bp of ["xs", "sm", "md", "lg", "xl"] as const) {
      const media = c[bp];
      if (media) {
        responsive[bp] = normalizeMediaUrl(media);
      }
    }
    return responsive;
  }

  // 単一画像
  return { xs: normalizeMediaUrl(c as tMedia) };
}
