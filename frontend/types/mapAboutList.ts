// types/About.ts
export interface tAboutContentType {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: tAboutItemType[];
}

export interface tAboutItemType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_type_uuid: string;
  order: number;
  type: number;
  label: string;
  default: string | null;
  options: string[] | null;
  require: boolean;
}

export interface tAboutContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
  label: string;
  type: string;
  raw_value: string | null;
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content: unknown | null;
}

export interface tAboutListContent {
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
  content_items: tAboutContentItem[];
}

export interface tAboutApiResponse {
  content_type: tAboutContentType;
  listContent: tAboutListContent[];
}

// 整形後のフロント用シンプルデータ
export interface tAbout {
  uuid: string;
  label: string;
  value: string;
}
