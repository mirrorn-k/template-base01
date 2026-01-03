// app/api/revalidate/site/route.ts
import { revalidateTag } from "next/cache";
import { TAG_FETCH_KEY } from "@/const/fetch";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST() {
  revalidateTag(TAG_FETCH_KEY);

  return new Response(
    JSON.stringify({
      ok: true,
      message: `${TAG_FETCH_KEY} cache invalidated`,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
