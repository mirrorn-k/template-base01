import * as tMapNotice from "@/types/mapNotice";
import { tList01 } from "@/packages/component/list/List01";
import { tParams } from "@/packages/core/api/type";
import getFetch, { fetchWithParams } from "@/packages/core/api/getFetch";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";
import { NoticesApiResponse } from "@/types/mapNotice";

export type tTerms = {
  id?: number;
};

function convert(contentList?: tMapNotice.NoticeContent[]): tList01[] {
  if (!contentList) return [];
  return contentList.map((item) => {
    const findValue = (label: string) =>
      item.content_items.find((ci) => ci.label === label)?.raw_value ?? "";

    const findMedia = (label: string) => {
      const m = item.content_items.find((ci) => ci.label === label)?.content;
      return normalizeMediaUrl(m || undefined);
    };

    return {
      uuid: item.uuid,
      kbn: findValue("区分"),
      title: findValue("タイトル"),
      caption: findValue("キャプション"),
      img: findMedia("イメージ"),
      released_at: item.released_at,
    };
  });
}

// SSR 用
export default async function getNotices(
  props: tParams<tTerms>
): Promise<tList01[] | []> {
  try {
    const u = fetchWithParams<tTerms>(
      `${process.env.NEXT_PUBLIC_MAP_API_NOTICES}`,
      props
    );

    const dataSetting: NoticesApiResponse = await getFetch(u);

    return convert(dataSetting.listContent.data);
  } catch (e) {
    console.error("[getNotices] fetch error", e);
    return [];
  }
}
