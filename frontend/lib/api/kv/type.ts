import * as tMap from "@/types/ttnouMap";
import { tResponsiveMediaContent } from "@/lib/api/media/type";

/**
 * content_items[].content の実体
 */
export type KvContentValue = null | tMap.tMedia | tResponsiveMediaContent;

/**
 * 各 content_items[].content の型
 */
export type KvContentItem = tMap.tMapContentItem<KvContentValue>;

/**
 * 1つの listContent エントリ
 */
export type KvContent = tMap.tMapContent<KvContentItem>;

/**
 * API レスポンス（リスト取得用）
 */
export type KvListApiResponse = tMap.tMapApiResponseList<KvContent>;

/**
 * API レスポンス（単一取得用）
 */
export type KvApiResponse = tMap.tMapApiResponseItem<KvContent>;
