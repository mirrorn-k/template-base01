// app/api/revalidate/site/route.ts
import { revalidateTag } from "next/cache";
import { TAG_FETCH_KEY } from "@/const/fetch";

export async function POST() {
  revalidateTag(TAG_FETCH_KEY);

  return Response.json({
    ok: true,
    message: `{TAG_FETCH_KEY} cache invalidated`,
  });
}
