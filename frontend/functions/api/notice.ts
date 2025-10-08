import getFetch from "@/packages/api/getFetch";
import * as tMapNotice from "@/types/mapNotice";
import { tList01 } from "@/packages/component/list/List01";

import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";

export default async function ItemPage({ uuid }: { uuid: string }) {
  // パスパラメータ利用
  const data = await getFetch(
    `${process.env.NEXT_PUBLIC_MAP_API_BASE_NOTICE}${uuid}`
  );

  return convert(data);
}

function convert(content?: tMapNotice.NoticeContent): tList01 | undefined {
  if (!content) return undefined;

  const findValue = (label: string) =>
    content.content_items.find((ci) => ci.label === label)?.raw_value ?? "";

  const findMedia = (label: string) => {
    const m = content.content_items.find((ci) => ci.label === label)?.content;
    return normalizeMediaUrl(m || undefined);
  };

  return {
    uuid: content.uuid,
    kbn: findValue("区分"),
    title: findValue("タイトル"),
    caption: findValue("キャプション"),
    img: findMedia("イメージ"),
    released_at: content.released_at,
  };
}
