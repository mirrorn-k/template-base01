import * as TypeForm from "../core/form/type";
import { create } from "../core/axios";
import convert from "./convert";
import getCachedData from "./getApiCache";

/**
 * MA+からコンテンツ取得関数
 * @param params
 * @returns
 */
export default async function get(
  url: string | null,
  flgCacheClear?: boolean
): Promise<any> {
  if (!url) {
    console.error("[ERROR] Organize API URL is undefined or empty.");
    return null;
  }

  return await getCachedData(url, flgCacheClear);
}
