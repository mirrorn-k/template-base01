import { tParams } from "@/types/ttnouMap";
import { TAG_FETCH_KEY } from "@/const/fetch";

export type CacheOptions = {
  cache?: RequestCache; // "no-store" | "force-cache" など
  next?: { revalidate?: number; tags?: string[] }; // ISR の秒数指定
};

export default async function getFetch(
  url: string,
  options: CacheOptions = {
    next: { revalidate: 3600, tags: [TAG_FETCH_KEY] },
  } // デフォルト: 一時間に一回再検証
) {
  if (!options.next) {
    options.next = { revalidate: 3600, tags: [TAG_FETCH_KEY] };
  }

  const env_revalidate = process.env.NEXT_PUBLIC_API_REVALIDATE;
  if (env_revalidate) {
    options.next.revalidate = Number(env_revalidate);
  }

  const u = url.replace("localhost:8102", "backend:80");

  //console.log(`Fetching URL: ${u} with options:`, options);

  const res = await fetch(u, options);

  if (!res.ok) throw new Error(`取得に失敗しました: ${res.status} ${u}`);

  return res.json();
}

// fetcher.ts
export function fetchWithParams<T>(url: string, params?: tParams<T>): string {
  const u = new URL(url);

  if (!params) return u.toString();

  // page / limit
  if (params.page !== undefined) {
    u.searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    u.searchParams.set("limit", String(params.limit));
  }

  // filter[key]=value
  if (params.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        u.searchParams.set(`filter[${key}]`, String(value));
      }
    });
  }

  // order[n][field], order[n][direction]
  if (params.orderby) {
    params.orderby.forEach((o, i) => {
      u.searchParams.set(`order[${i}][field]`, o.field);
      u.searchParams.set(`order[${i}][direction]`, o.direction);
    });
  }

  return u.toString();
}
