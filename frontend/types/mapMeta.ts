// types/mapMeta.ts
import { tMedia } from "@/packages/component/media/type"; // 既存の共通メディア型を再利用

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
export interface MetaContentType {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: MetaItemDefinition[];
}

/**
 * 各項目の定義（label, typeなど）
 */
export interface MetaItemDefinition {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_type_uuid: string;
  order: number;
  type: string | number;
  label: string;
  default: string | null;
  options: string[] | null;
  require: boolean;
}

/**
 * 実際のMETAデータ1件（ページ単位）
 */
export interface MetaListContent {
  uuid: string;
  contentType_uuid: string;
  domain: string;
  order: number;
  name: string;
  caption: string;
  released_at: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: MetaContentItem[];
}

/**
 * 各METAアイテム（title, descriptionなど）
 */
export interface MetaContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
  label: string; // 例: "title", "og:image", "twitter:card"
  type: string; // string, textarea, media, choice など
  raw_value: string | null;
  options: string[] | null;
  type_kbn: string | number;
  type_options: string[] | null;
  /**
   * content は type_kbn によって中身が変わる
   * 例:
   *  - type_kbn === 6 → tMedia
   *  - type_kbn === 0f8b1c3b... → 別UUIDコンテンツ
   */
  content: tMedia | MetaLinkedContent | null;
}

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
  ogImage?: tMedia | null;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
}
