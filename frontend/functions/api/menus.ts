// packages/api/getMenu.ts
import getFetch from "@/packages/api/getFetch";
import { MenuItem, MenuApiResponse } from "@/types/mapMenu";

/**
 * メニュー情報を API から取得する（変換はしない）
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
  return res.listContent.map((content) => {
    const obj: Partial<MenuItem> = {};

    for (const item of content.content_items) {
      switch (item.label) {
        case "名称":
          obj.label = item.raw_value ?? "";
          break;
        case "スラッグ":
          obj.slug = item.raw_value ?? "";
          break;
        case "KV":
          obj.img = item.content ?? undefined;
          break;
      }
    }

    return obj as MenuItem;
  });
}
