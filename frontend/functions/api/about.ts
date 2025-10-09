import getFetch from "@/packages/core/api/getFetch";
import {
  tAboutApiResponse,
  tAboutListContent,
  tAbout,
} from "@/types/mapAboutList";

/**
 * 組織情報（会社情報など）を取得して配列 { uuid, label, value } に整形して返す
 */
export default async function getAboutList(): Promise<tAbout[] | null> {
  try {
    const res: tAboutApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_ABOUT_LIST}`
    );
    return convert(res);
  } catch (e) {
    console.error("[getAboutList] fetch error", e);
    return null;
  }
}

/**
 * APIレスポンス → tAbout[] へ整形
 */
function convert(data: tAboutApiResponse | null): tAbout[] {
  if (!data || !Array.isArray(data.listContent)) return [];

  // 並び順は変換前に listContent を order で確定させる
  const sorted: tAboutListContent[] = [...data.listContent].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const pickValue = (
    items: tAboutApiResponse["listContent"][number]["content_items"]
  ) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    // 1. label === "値" を優先
    const v1 = items.find(
      (i) => i?.label === "値" && i?.raw_value != null
    )?.raw_value;
    if (v1 != null) return v1;

    // 2. raw_value が入っている最初の要素
    const v2 = items.find((i) => i?.raw_value != null)?.raw_value;
    if (v2 != null) return v2;

    // 3. 先頭の raw_value（null の可能性あり）
    return items[0]?.raw_value ?? null;
  };

  return sorted
    .map<tAbout | null>((content) => {
      const label = (content.name ?? "").trim();
      if (!label) return null;

      const raw = pickValue(content.content_items);
      // tAbout.value は string 固定なので、null は空文字に寄せる
      const value = raw != null ? String(raw).trim() : "";

      return {
        uuid: content.uuid,
        label,
        value,
      };
    })
    .filter((v): v is tAbout => v !== null);
}
