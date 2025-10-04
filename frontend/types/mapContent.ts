// ===== メディア情報 =====
export interface MediaContent {
  name: string;
  caption: string;
  file: string;
  width: number;
  height: number;
  url: string;
}

// ===== コンテンツアイテム =====
export interface ContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;

  label: string; // "タイトル" / "サブタイトル" / "キャプション1" など
  type: string; // "string" | "textarea" | "media" | ...
  raw_value: string | null;
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;

  content: MediaContent | null;
}

// ===== コンテンツ本体 =====
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

  content_items: ContentItem[];
}

// ===== API レスポンス =====
export interface ContentApiResponse {
  content: Content;
}
