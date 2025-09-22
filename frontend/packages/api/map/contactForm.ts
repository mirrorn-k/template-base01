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
    `${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM ?? ""}?${
      process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM_PARAM ?? ""
    }`
  );
  if (!apiUrl) {
    console.error("[ERROR] Contact-Form API URL is undefined or empty.");
    return INIT;
  }

  return await getContents(apiUrl, flgCacheClear);
}
