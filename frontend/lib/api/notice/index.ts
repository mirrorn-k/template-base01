import * as tMapNotice from "./type";
import { tList01 } from "@/components/list/List01";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";
import { tMedia, tParams } from "@/types/ttnouMap";
import getFetch, { fetchWithParams } from "@/lib/api/getFetch";

export async function getNotice({ uuid }: { uuid: string }) {
  try {
    // パスパラメータ利用
    const data = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_BASE_NOTICE}${uuid}`
    );

    return convertToItem(data);
  } catch (e) {
    console.error("[ItemPage] fetch error", e);
    return undefined;
  }
}

function convertToItem(
  content?: tMapNotice.tNoticeContent
): tList01 | undefined {
  if (!content) return undefined;

  const findValue = (label: string) =>
    content.content_items.find((ci) => ci.label === label)?.raw_value ?? "";

  const findMedia = (label: string) => {
    const m = content.content_items.find((ci) => ci.label === label)?.content;
    return normalizeMediaUrl(m || undefined);
  };

  return {
    uuid: content.uuid,
    kbn: findValue("区分") as string,
    title: findValue("タイトル") as string,
    caption: findValue("キャプション") as string,
    img: findMedia("イメージ") as tMedia | undefined,
    released_at: content.released_at,
  };
}

////////////////////////////////////////////////////////// 一覧、リスト用

export type tTerms = {
  id?: number;
};

// SSR 用
export async function getNotices(props: tParams<tTerms>): Promise<tList01[]> {
  try {
    const u = fetchWithParams<tTerms>(
      `${process.env.NEXT_PUBLIC_MAP_API_NOTICES}`,
      props
    );

    const dataSetting: tMapNotice.tNoticePaginatedApiResponse = await getFetch(
      u
    );

    if (!dataSetting.listContent?.data) {
      console.warn("[getNotices] invalid response:", dataSetting);
      return [];
    }

    const items = dataSetting.listContent.data
      .map((content) => convertToItem(content))
      .filter((item): item is tList01 => Boolean(item));

    return items;
  } catch (e) {
    console.error("[getNotices] fetch error", e);
    return [];
  }
}
