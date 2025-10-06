import getFetch from "@/packages/api/getFetch";

export default async function getOrganize() {
  return await getFetch(`${process.env.NEXT_PUBLIC_MAP_API_ORGANIZE}`, {
    cache: "no-store",
  });
}
