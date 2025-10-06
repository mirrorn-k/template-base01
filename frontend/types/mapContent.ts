import { tMedia } from "@/packages/core/media/type";

/**
 * 「イメージ1〜3」を含む構造化されたコンテンツ
 * （実際に API から返ってくる content オブジェクト）
 */
export interface tContentItem {
  name: string;
  caption: string;
  released_at: string;

  // 日本語キーを許容
  [key: string]: string | number | null | tMedia | undefined;
}

/**
 * Item.content に入る可能性のある値
 */
export type ContentValue = tContentItem;

/**
 * 各コンテンツアイテム
 */
export interface Item {
  id: number;
  label: string;
  type: string;
  raw_value: string | null;
  options: string[] | null;
  type_kbn: string;
  type_options: string[] | null;
  content?: ContentValue;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
}

/**
 * コンテンツ本体
 */
export interface Content {
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
  content_items: Item[];
}

/**
 * APIレスポンス（リスト）
 */
export interface ContentListApiResponse {
  content_type: {
    uuid: string;
    domain: string;
    name: string;
    caption: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    items: unknown[];
  };
  listContent: Content[];
}

/**
 * APIレスポンス（単一）
 */
export interface ContentApiResponse {
  content_type: {
    uuid: string;
    domain: string;
    name: string;
    caption: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    items: unknown[];
  };
  content: Content;
}
