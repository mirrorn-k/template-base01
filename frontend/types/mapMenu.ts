// packages/api/type.ts
import { tMedia } from "@/packages/component/media/type";
import { tMediaContent } from "@/types/mapMediaContent";
import { Responsive } from "@/packages/core/function/responsiveValue/type";

export type ImgContentValue = null | tMedia | tMediaContent;

export interface MenuItem {
  uuid: string;
  label: string;
  slug: string;
  img?: Responsive<tMedia>;
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
  type_kbn: number | string;
  type_options: string[] | null;
  content: ImgContentValue;
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
