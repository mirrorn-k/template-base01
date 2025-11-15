import * as tMap from "@/types/ttnouMap";

/**
 * コンテンツアイテム型
 */
export type tNoticeContentItem = tMap.tMapContentItem<tMap.tMedia | null>;

/**
 * Notice コンテンツ型
 */
export type tNoticeContent = tMap.tMapContent<tNoticeContentItem>;

/**
 * ページネーション付きリスト型
 */
export type tNoticePaginated = tMap.tMapPaginated<tNoticeContent>;

/**
 * API レスポンス型（ページネーション付きリスト）
 */
export type tNoticePaginatedApiResponse =
  tMap.tMapApiResponsePagenated<tNoticePaginated>;

/**
 * API レスポンス（リスト取得用）
 */
export type tNoticeListApiResponse = tMap.tMapApiResponseList<tNoticeContent>;

/**
 * API レスポンス（単一取得用）
 */
export type tNoticeApiResponse = tMap.tMapApiResponseItem<tNoticeContent>;
