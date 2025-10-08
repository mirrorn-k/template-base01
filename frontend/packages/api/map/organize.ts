import { tOrganize } from "../../core/organize/type";
import INIT from "../../core/organize/const";
import getFetch from "../getFetch";

/**
 * 会社情報
 * @returns
 */
export default async function Main(): Promise<tOrganize> {
  console.log(
    "Fetching organize data...",
    process.env.NEXT_PUBLIC_MAP_API_ORGANIZE
  );
  const apiUrl = process.env.NEXT_PUBLIC_MAP_API_ORGANIZE ?? "";
  if (!apiUrl) {
    console.error("[ERROR] Organize API URL is undefined or empty.", apiUrl);

    return INIT;
  }

  return getFetch(apiUrl);
}
