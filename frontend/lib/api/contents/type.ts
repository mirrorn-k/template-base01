import * as tMap from "@/types/ttnouMap";

/**
 * 「イメージ1〜3」を含む構造化されたコンテンツ
 * （実際に API から返ってくる content オブジェクト）
 */
export interface tCustomItems {
  name: string;
  caption: string;
  released_at: string;
  // 日本語キーを許容
  [key: string]:
    | string
    | number
    | null
    | tMap.tMedia
    | tMap.tResponsiveMedia
    | undefined;
}

/**
 * 各コンテンツアイテム
 */
export type tContentItem = tMap.tMapContentItem<tCustomItems>;

/**
 * コンテンツ本体
 */
export type tContent = tMap.tMapContent<tContentItem>;

/**
 * APIレスポンス（リスト）
 */
export type tContentListApiResponse = tMap.tMapApiResponseList<tContent>;

/**
 * APIレスポンス（単一）
 */
export type tContentApiResponse = tMap.tMapApiResponseItem<tContent>;

/**
 * 下層ページ用の各 Item（ページ情報がネストされる）
 */
export interface SubpageItem extends tContentItem {
  // 対象ページの content を持つ場合
  target_content?: tContent | null;
}

/**
 * 下層ページ用コンテンツ（listContent要素）
 */
export interface SubpageContent extends Omit<tContent, "content_items"> {
  content_items: SubpageItem[];
}

/**
 * 下層ページ用APIレスポンス
 */
export interface SubpageContentListApiResponse
  extends Omit<tContentListApiResponse, "listContent"> {
  listContent: SubpageContent[];
}
