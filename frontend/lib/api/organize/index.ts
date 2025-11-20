import getFetch from "@/lib/api/getFetch";
import { tOrganize } from "./type";
import { INIT } from "@/lib/api/organize/const";

export default async function getOrganize(): Promise<tOrganize> {
  try {
    const organize = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_ORGANIZE}`
    );

    if (!organize) {
      return INIT;
    } else {
      return organize;
    }
  } catch (e) {
    console.error("[getOrganize] fetch error", e);
    return INIT;
  }
}
