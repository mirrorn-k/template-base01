import { tMedia } from "@/packages/core/media/type";
import { tMediaContent } from "@/types/mapMediaContent";

export type KvContentValue = null | tMedia | tMediaContent;

// 個々のアイテム
export interface KvContentItem {
  id: number;
  label: string; // "KV" / "キャッチコピー" / "ロゴ" / "削除・終了" など
  type: string; // "string" | "boolean" | "media" など
  raw_value: string | null; // 実際の値
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content?: KvContentValue; // メディアの場合は tMedia
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
}

// listContent 内の1件
export interface KvContent {
  uuid: string;
  contentType_uuid: string;
  domain: string;
  order: number;
  name: string; // タイトル相当（例: "デフォルト"）
  caption: string; // サブ説明
  released_at: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: KvContentItem[];
}

// API レスポンス（リスト用）
// ページネーションなし → listContent は KvContent[] で固定
export interface KvListApiResponse {
  content_type: {
    uuid: string;
    domain: string;
    name: string;
    caption: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    items: unknown[]; // content_type.items は定義情報なので unknown[] で良い
  };
  listContent: KvContent[];
}

// API レスポンス（単一取得用）
export interface KvApiResponse {
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
  content: KvContent;
}
