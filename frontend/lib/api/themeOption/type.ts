import * as tMap from "@/types/ttnouMap";

/**
 * コンテンツアイテム型
 */
export type tThemeContentItem = tMap.tMapContentItem<string>;

/**
 * Theme コンテンツ型
 */
export type tThemeListContent = tMap.tMapContent<tThemeContentItem>;

/**
 * API レスポンス（リスト取得用）
 */
export type tThemeListApiResponse = tMap.tMapApiResponseList<tThemeListContent>;
