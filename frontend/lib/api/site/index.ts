import getFetch, { fetchWithParams } from "@/lib/api/getFetch";
import { tSite } from "./type";
import { tParams } from "@/types/ttnouMap";

/**
 * SSR/SSG 用：ページ情報を取得
 */
export async function getSite(
  terms?: tParams<{ slug?: string }>
): Promise<tSite> {
  try {
    const url = `${process.env.NEXT_PUBLIC_MAP_API_SITE}?${process.env.NEXT_PUBLIC_MAP_API_SITE_PARAMS}`;
    const u = fetchWithParams<{ slug?: string }>(url, terms);

    const data: tSite[] = await getFetch(u);

    console.log("[getSite] data:", data);
    return data[0];
  } catch (e) {
    console.error("[getSite] fetch error", e);
    return {} as tSite;
  }
}
