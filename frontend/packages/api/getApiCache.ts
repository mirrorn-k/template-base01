// app/actions.ts
"use server";
import { writeFile, readFile, stat } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";
//import next from "next";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_DURATION = 10 * 60 * 1000; // 10分間キャッシュ保持

/**
 * URL から一意なキャッシュファイル名を生成
 */
function getCacheFilePath(url: string): string {
  const hash = crypto.createHash("md5").update(url).digest("hex"); // URL をハッシュ化
  return path.join(CACHE_DIR, `${hash}.json`);
}

/**
 * キャッシュファイルが最新かどうかを確認
 */
async function isCacheValid(url: string): Promise<boolean> {
  try {
    const filePath = getCacheFilePath(url);
    const stats = await stat(filePath);
    return Date.now() - stats.mtimeMs < CACHE_DURATION; // 最終更新から10分未満なら有効
  } catch {
    return false; // ファイルが存在しない場合はキャッシュ無効
  }
}

/**
 * APIからデータを取得し、キャッシュを更新
 */
async function fetchDataFromApi(url: string, flgCacheClear: boolean = false) {
  console.log(`[FETCH] Fetching new data from API: ${url}`);

  try {
    let params = {};
    if (flgCacheClear) {
      // キャッシュクリアフラグが立っている場合は、キャッシュを無視して新しいデータを取得
      params = { cache: "no-store" };
    } else {
      // キャッシュクリアフラグが立っていない場合は、キャッシュを使用
      params = { cache: "force-cache", next: { revalidate: 60 * 60 } };
    }

    const res = await fetch(url, params);
    const data = await res.json();

    // キャッシュを更新
    const filePath = await getCacheFilePath(url);
    await writeFile(
      filePath,
      JSON.stringify({ data, lastUpdated: Date.now() }),
      "utf-8"
    );

    return data;
  } catch (error) {
    console.error(`[ERROR] Failed to fetch data from ${url}:`, error);
    throw error; // ここで再throw
  }
}

/**
 * キャッシュをチェックし、APIを実行するか判断
 */
export default async function getCachedData(
  url: string,
  flgCacheClear: boolean = false
) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  if (!url) {
    console.log(`[ERROR] URL is undefined or empty.`);
    return null;
  }

  const filePath = await getCacheFilePath(url);

  if ((await isCacheValid(url)) && !flgCacheClear) {
    return await readCache(filePath, url);
  }

  try {
    return await fetchDataFromApi(url, flgCacheClear);
  } catch (fetchError) {
    console.error(
      `[ERROR] Failed to fetch data from API for ${url}:`,
      fetchError
    );
    return await readCache(filePath, url);
  }
}

/**
 * キャッシュファイルの読み込み
 * @param filePath
 * @param url
 * @returns
 */
async function readCache(filePath: string, url: string) {
  try {
    const fileData = await readFile(filePath, "utf-8");
    console.log(`[CACHE] Using cached data for ${url}`);
    return JSON.parse(fileData).data;
  } catch (error) {
    console.error(`[ERROR] Failed to read cache file for ${url}:`, error);
    throw error;
  }
}
