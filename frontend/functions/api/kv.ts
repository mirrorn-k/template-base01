import * as tMapKv from "@/types/mapKv";
import * as tMapMediaContent from "@/types/mapMediaContent";
import { tParams } from "@/packages/api/type";
import getFetch, { fetchWithParams } from "@/packages/api/getFetch";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";

export type tTerms = {
  uuid?: string;
};

// SSR 用
export default async function getKv(
  props?: tParams<tTerms>
): Promise<tMapKv.KvContent | undefined> {
  const u = fetchWithParams<tTerms>(
    `${process.env.NEXT_PUBLIC_MAP_API_KV}?${process.env.NEXT_PUBLIC_MAP_API_KV_PARAMS}`, // .env に定義
    props
  );

  const dataSetting: tMapKv.KvListApiResponse = await getFetch(u);

  // 複数件ある場合は先頭のみ返す
  return convertOne(dataSetting.listContent);
}

function convertOne(list: tMapKv.KvContent[]): tMapKv.KvContent | undefined {
  if (!list || list.length === 0) return undefined;

  const now = new Date();

  const candidates = list.filter((c) => {
    const deletedFlag = c.content_items.find((ci) => ci.label === "削除・終了");
    const isDeleted = deletedFlag?.raw_value === "true";

    const releaseTime = new Date(c.released_at.replace(" ", "T") + "+09:00");
    const isPastOrNow = releaseTime.getTime() <= now.getTime();

    return !isDeleted && isPastOrNow;
  });

  // 優先対象を選択
  const target =
    candidates.sort(
      (a, b) =>
        new Date(b.released_at).getTime() - new Date(a.released_at).getTime()
    )[0] ??
    // 候補が無ければ「listの中で一番新しいもの」を返す
    list[0];

  // content_items のメディアURLを normalize
  const items = target.content_items.map((ci) => {
    if (ci.content && typeof ci.content === "object") {
      (["xs", "sm", "md", "lg", "xl"] as const).forEach((bp) => {
        const content = ci.content as tMapMediaContent.tMediaContent;
        if (content[bp]) {
          content[bp] = normalizeMediaUrl(content[bp]);
        }
      });
    }
    return ci;
  });

  return {
    ...target,
    content_items: items,
  };
}
