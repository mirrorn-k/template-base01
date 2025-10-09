import { tParams } from "./type";

export type CacheOptions = {
  cache?: RequestCache; // "no-store" | "force-cache" など
  next?: { revalidate?: number }; // ISR の秒数指定
};

export default async function getFetch(
  url: string,
  options: CacheOptions = {
    next: { revalidate: 3600 },
  } // デフォルト: 一時間に一回再検証
) {
  const env_cache = process.env.NEXT_PUBLIC_API_CACHE;
  const env_revalidate = process.env.NEXT_PUBLIC_API_REVALIDATE;

  if (env_cache) options.cache = "no-store"; // no-store 優先
  if (env_revalidate) options.next = { revalidate: Number(env_revalidate) };

  const u = url.replace("localhost:8102", "backend:80");

  const res = await fetch(u, options);

  if (!res.ok) throw new Error(`取得に失敗しました: ${res.status}`);

  return res.json();
}

// fetcher.ts
export function fetchWithParams<T>(url: string, params?: tParams<T>): string {
  const u = new URL(url);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        u.searchParams.append(key, String(value));
      }
    });
  }

  return u.toString();
}
