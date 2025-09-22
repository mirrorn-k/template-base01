import { tOrganize } from "../../core/organize/type";
import INIT from "../../core/organize/const";
import convert from "../convert";
import getContents from "../getContents";

/**
 * 会社情報
 * @returns
 */
export default async function Main(
  flgCacheClear?: boolean
): Promise<tOrganize> {
  const apiUrl = convert(
    `${process.env.NEXT_PUBLIC_META_API_URL ?? ""}?${
      process.env.NEXT_PUBLIC_META_API_URL_PARAM ?? ""
    }`
  );
  if (!apiUrl) {
    console.error("[ERROR] Organize API URL is undefined or empty.");
    return INIT;
  }

  return await getContents(apiUrl, flgCacheClear);
}
