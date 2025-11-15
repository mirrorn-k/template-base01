// types/mapSiteInfo.ts
import { tMedia } from "@/types/ttnouMap";

export interface tSiteInfoContent {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  order: number;
  released_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: tSiteInfoItem[];
}

export interface tSiteInfoItem {
  id: number;
  label: string;
  type: string;
  raw_value: string | null;
  type_kbn: number;
  content: tMedia | null;
}

/**
 * 変換後の最終構造
 * サイト全体設定として使う
 */
export interface tSiteInfo {
  logo?: tMedia;
  favicon?: tMedia;
  appleTouchIcon?: tMedia;
  siteUrl?: string;
  defaultOGP?: tMedia;
  gtmId?: string;
  maintenance?: boolean;
  copyright?: string;
  externalScript?: string;
  externalCss?: string;
  jsonLd?: string;
}
