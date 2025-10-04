import { PaginatedResponse } from "@/packages/core/list/type";
import { Responsive } from "@/packages/core/function/responsiveValue/type";

export type tMedia = {
  url: string;
  file: string;
  name: string;
  caption: string;
  uuid: string;
  width: number;
  height: number;
  useApi?: boolean;
};

// 個々のコンテンツアイテム
export interface ContentItem {
  id: number;
  label: string; // "xs" | "sm" | "md" | "lg" | "xl" など
  type: string; // "string" | "textarea" | "choice" | "media" etc
  raw_value: string | null; // 実際の値
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content?: tMedia | null; // メディアの場合は tMedia
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
}

// コンテンツ（1件）
export interface Content {
  uuid: string;
  contentType_uuid: string;
  domain: string;
  order: number;
  name: string; // タイトル相当
  caption: string; // サブ説明
  released_at: string; // 公開日時
  deadline: string; // 締切日時
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: ContentItem[];
}

// ページネーション付き
export type PaginatedContentList = PaginatedResponse<Content>;

// 共通で使う content_type
export interface ContentTypeMeta {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: unknown[];
}

// API レスポンス（複数・ページネーションあり）
export interface ContentsApiResponse {
  content_type: ContentTypeMeta;
  listContent: PaginatedContentList;
}

// API レスポンス（複数・ページネーションなし）
export interface ContentListApiResponse {
  content_type: ContentTypeMeta;
  listContent: Content[];
}

// API レスポンス（単一取得）
export interface ContentApiResponse {
  content_type: ContentTypeMeta;
  content: Content;
}

/**
 * ContentのアイテムをResponsiveに変化したもの
 */
export interface tMapContent {
  uuid: string;
  contentType_uuid: string;
  domain: string;
  order: number;
  name: string; // タイトル相当
  caption: string; // サブ説明
  released_at: string; // 公開日時
  deadline: string; // 締切日時
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: Responsive<tMedia>;
}
