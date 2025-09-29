type CacheOptions = {
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

  const u = url.replace("localhost:8102", "backend");

  const res = await fetch(u, options);

  if (!res.ok) throw new Error(`取得に失敗しました: ${res.status}`);

  return res.json();
}
