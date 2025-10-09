import getFetch from "@/packages/core/api/getFetch";
import { tOrganize } from "./type";

export default async function getOrganize(): Promise<tOrganize | null> {
  try {
    return await getFetch(`${process.env.NEXT_PUBLIC_MAP_API_ORGANIZE}`);
  } catch (e) {
    console.error("[getOrganize] fetch error", e);
    return null;
  }
}
