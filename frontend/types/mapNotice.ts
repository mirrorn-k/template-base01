import { tMedia } from "@/packages/component/media/type";
import { PaginatedResponse } from "@/packages/component/list/type";

// 個々のアイテム
export interface NoticeContentItem {
  id: number;
  label: string; // "区分" / "タイトル" / "キャプション" / "イメージ"
  type: string; // "string" | "textarea" | "choice" | "media" など
  raw_value: string | null; // 実際の値
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content?: tMedia | null; // メディアの場合は tMedia などになる
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
}

// listContent 内の1件
export interface NoticeContent {
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
  content_items: NoticeContentItem[];
}

// ✅ ページネーションされた Notice 用
export type PaginatedListContent = PaginatedResponse<NoticeContent>;

// API レスポンス全体
export interface NoticesApiResponse {
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
  listContent: PaginatedListContent;
}

// API レスポンス全体
export interface NoticeListApiResponse {
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
  listContent: NoticeContent[];
}

// API レスポンス（単一取得用）
export interface NoticeApiResponse {
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
  content: NoticeContent;
}
