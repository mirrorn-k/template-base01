// types/mapMeta.ts
import * as tMap from "@/types/ttnouMap"; // 既存の共通メディア型を再利用

type MetaContentValue = tMap.tMedia | MetaLinkedContent | null;

/**
 * ルートレスポンス
 */
export interface MetaApiResponse {
  content_type: MetaContentType;
  listContent: MetaListContent[];
}

/**
 * METAコンテンツタイプ定義
 * （フォーム構成のようなもの）
 */
export type MetaContentType = tMap.tMapContentType;

/**
 * 実際のMETAデータ1件（ページ単位）
 */
export type MetaListContent = tMap.tMapContent<MetaContentItem>;

/**
 * 各METAアイテム（title, descriptionなど）
 */
export type MetaContentItem = tMap.tMapContentItem<MetaContentValue>;

/**
 * "キー"などUUID参照型の内容
 */
export interface MetaLinkedContent {
  name: string;
  caption?: string;
  released_at?: string;
  [key: string]: unknown;
}

/**
 * 変換後にNext.jsに渡す最終型
 */
export interface MetaConverted {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: tMap.tMedia | null;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
}
