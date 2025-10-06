import { tParams } from "@/packages/api/type";
import getFetch, { fetchWithParams } from "@/packages/api/getFetch";
import normalizeMediaUrl from "@/packages/core/media/lib/nomalizeMediaUrl";
import {
  ContentListApiResponse,
  Content,
  Item,
  ContentValue,
} from "@/types/mapContent";
import { tMedia } from "@/packages/core/media/type";

/**
 * content_items[].content の「イメージ1〜3」を tMedia に変換する
 */
function normalizeContentItems(items: Item[]): Item[] {
  return items.map((item) => {
    const { content } = item;

    if (!content || typeof content !== "object") {
      return item;
    }

    // content が tMediaContent 型かどうかを型ガードで判定
    const isTMediaContent = (
      value: ContentValue
    ): value is Extract<ContentValue, Record<string, unknown>> =>
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
function convert(contentList?: Content[]): Content[] {
  if (!contentList) return [];
  return contentList.map((block) => ({
    ...block,
    content_items: normalizeContentItems(block.content_items),
  }));
}

/**
 * ページネーションがある場合・ない場合どちらにも対応するための型ガード
 */
function extractListContent(response: ContentListApiResponse): Content[] {
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
}): Promise<Content[]> {
  const u = fetchWithParams<{ id?: number }>(props.url, props.terms);

  const data: ContentListApiResponse = await getFetch(u);

  const list = extractListContent(data);

  return convert(list);
}
