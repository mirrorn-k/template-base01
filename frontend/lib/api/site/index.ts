import getFetch from "@/lib/api/getFetch";
import { tSite } from "./type";

/**
 * SSR/SSG 用：ページ情報を取得
 */
export async function getSite(): Promise<tSite> {
  try {
    const url = `${process.env.NEXT_PUBLIC_MAP_API_SITE}?${process.env.NEXT_PUBLIC_MAP_API_SITE_PARAMS}`;

    //console.log("[getSite] url:", u);

    const data: tSite[] = await getFetch(url);

    //console.log("[getSite] data:", data);
    return data[0];
  } catch (e) {
    console.error(`[getSite] fetch error`, e);
    return {} as tSite;
  }
}
