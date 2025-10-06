// packages/api/type.ts

export interface MediaContent {
  name: string;
  caption: string;
  file: string;
  width: number;
  height: number;
  url: string;
}

export interface MenuItem {
  label: string; // 名称
  slug: string; // スラッグ
  img?: MediaContent; // KV 画像
}

export interface ContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
  label: string;
  type: string; // string | media | etc
  raw_value: string | null;
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content: MediaContent | null;
}

export interface ListContent {
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

export interface MenuContentType {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: {
    id: number;
    label: string;
    type: number;
    order: number;
    require: boolean;
  }[];
}

export interface MenuApiResponse {
  content_type: MenuContentType;
  listContent: ListContent[];
}
