import { tParams } from "@/types/ttnouMap";
import getFetch, { fetchWithParams } from "@/lib/api/getFetch";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";
import {
  tContentListApiResponse,
  tContent,
  tContentItem,
  tCustomItems,
} from "./type";
import { tMedia } from "@/types/ttnouMap";

/**
 * content_items[].content の「イメージ1〜3」を tMedia に変換する
 */
function normalizeContentItems(items: tContentItem[]): tContentItem[] {
  return items.map((item) => {
    const { content } = item;

    if (!content || typeof content !== "object") {
      return item;
    }

    // content が tMediaContent 型かどうかを型ガードで判定
    const isTMediaContent = (
      value: tCustomItems
    ): value is Extract<tCustomItems, Record<string, unknown>> =>
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      "released_at" in value;

    if (!isTMediaContent(content)) {
      return item;
    }

    // content 内の「イメージ◯」プロパティを tMedia に変換
    const newContent: typeof content = Object.fromEntries(
      Object.entries(content).map(([key, value]) => {
        if (
          key.startsWith("イメージ") &&
          value &&
          typeof value === "object" &&
          "url" in value
        ) {
          return [key, normalizeMediaUrl(value as tMedia)];
        }
        return [key, value];
      })
    ) as typeof content;

    return {
      ...item,
      content: newContent,
    };
  });
}

/**
 * listContent を Content[] に変換
 */
function convert(contentList?: tContent[]): tContent[] {
  if (!contentList) return [];
  return contentList.map((block) => ({
    ...block,
    content_items: normalizeContentItems(block.content_items),
  }));
}

/**
 * ページネーションがある場合・ない場合どちらにも対応するための型ガード
 */
function extractListContent(response: tContentListApiResponse): tContent[] {
  const listContent = response.listContent;
  // ページネーション付き
  if (
    typeof listContent === "object" &&
    "data" in listContent &&
    Array.isArray(listContent.data)
  ) {
    return listContent.data;
  }
  // 通常配列
  if (Array.isArray(listContent)) {
    return listContent;
  }
  return [];
}

/**
 * SSR 用：TOPページコンテンツ取得
 */
export default async function getContents(props: {
  terms: tParams<{ id?: number }>;
  url: string;
}): Promise<tContent[]> {
  try {
    const u = fetchWithParams<{ id?: number }>(props.url, props.terms);

    const data: tContentListApiResponse = await getFetch(u);

    const list = extractListContent(data);

    return convert(list);
  } catch (e) {
    console.error("[getContents] fetch error", e);
    return [];
  }
}

/**
 * SSR 用：下層ページコンテンツ取得
 */
export async function getSubpageContents(props: {
  slug: string;
}): Promise<tContent[]> {
  const u = fetchWithParams<{ slug: string }>(
    `${process.env.NEXT_PUBLIC_MAP_API_CONTENT_SUBPAGE}`
  );
  const data: tContentListApiResponse = await getFetch(u);

  // 1️⃣ 一旦そのまま抽出（生データ）
  const list = extractListContent(data);

  // 2️⃣ slug で対象ページを絞り込み
  const filtered = list.filter((content) =>
    content.content_items.some((item) => {
      if (item.label !== "対象ページ" || !item.content) return false;
      const targetSlug =
        (item.content["スラッグ"] as string) ||
        (item.content["slug"] as string);
      return targetSlug === props.slug;
    })
  );

  // 3️⃣ 絞り込んだデータだけ変換
  return convert(filtered);
}
