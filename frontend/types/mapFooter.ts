import { tMedia } from "@/packages/component/media/type";
import { Responsive } from "@/packages/core/function/responsiveValue/type";

/**
 * 各 content_items[].content の実体
 */
export type tMediaContent = {
  name: string;
  caption: string;
  released_at: string;
} & Responsive<tMedia>;

/**
 * フッター項目（例: ロゴ、テキスト）
 */
export interface FooterContentItem {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
  label: string; // "ロゴ" or "テキスト"
  type: string; // "uuid" or "textarea"
  raw_value: string | null;
  options: string[] | null;
  type_kbn: string | number;
  type_options: string[] | null;
  content: tMediaContent | null;
}

/**
 * 1つの listContent エントリ
 */
export interface FooterListContent {
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
  content_items: FooterContentItem[];
}

/**
 * content_type 情報
 */
export interface FooterContentType {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: {
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
  }[];
}

/**
 * API全体レスポンス
 */
export interface FooterApiResponse {
  content_type: FooterContentType;
  listContent: FooterListContent[];
}

export interface tFooterItem {
  uuid: string;
  logo?: Responsive<tMedia>;
  text?: string;
}
