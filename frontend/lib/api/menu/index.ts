// packages/api/getMenu.ts
import getFetch from "@/lib/api/getFetch";
import {
  tMenuItem,
  tMenuListApiResponse,
  tMenuContentItem,
} from "@/lib/api/menu/type";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";

/**
 * メニュー情報を API から取得する
 */
export default async function getMenus(): Promise<tMenuItem[]> {
  try {
    const res: tMenuListApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_MENU}?${process.env.NEXT_PUBLIC_MAP_API_MENU_PARAMS}`
    );
    return convert(res);
  } catch (e) {
    console.error("[getMenus] fetch error", e);
    return [];
  }
}

/**
 * APIレスポンスを tMenuItem[] に変換
 */
function convert(res: tMenuListApiResponse): tMenuItem[] {
  if (!res?.listContent || !Array.isArray(res.listContent)) return [];

  return res.listContent.map((content) => {
    const obj: Partial<tMenuItem> = {};

    obj.uuid = content.uuid;

    for (const item of content.content_items) {
      switch (item.label) {
        case "名称":
          obj.label = (item.raw_value as string) ?? "";
          break;

        case "スラッグ":
          obj.slug = (item.raw_value as string) ?? "";
          break;

        case "KV":
          obj.img = convertImage(item);
          break;
      }
    }

    return obj as tMenuItem;
  });
}

/**
 * KV項目の content を解析して Responsive<tMedia> に変換
 * normalizeMediaUrl は単一メディア専用のため、各breakpointごとに適用
 */
function convertImage(item: tMenuContentItem): Responsive<tMedia> | undefined {
  const c = item.content;
  if (!c) return undefined;

  const responsive: Responsive<tMedia> = {};

  // レスポンシブ構造 (xs, sm, md, lg, xl)
  for (const bp of ["xs", "sm", "md", "lg", "xl"] as const) {
    const media = c[bp];
    if (media) {
      responsive[bp] = normalizeMediaUrl(media);
    }
  }
  return responsive;
}
