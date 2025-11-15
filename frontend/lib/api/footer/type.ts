import { Responsive } from "@/lib/responsiveValue/type";
import * as tMap from "@/types/ttnouMap";

/**
 * 各 content_items[].content の実体
 */
export type tMediaContent = {
  name: string;
  caption: string;
  released_at: string;
} & Responsive<tMap.tMedia>;

/**
 * フッター項目（例: ロゴ、テキスト）
 */
export type tFooterContentItem = tMap.tMapContentItem<tMediaContent>;

/**
 * 1つの listContent エントリ
 */
export type tFooterListContent = tMap.tMapContent<tFooterContentItem>;

/**
 * content_type の各アイテム定義
 */
export type ttFooterContentTypeItem = tMap.tMapTypeItem;

/**
 * content_type 情報
 */
export type tFooterContentType = tMap.tMapContentType;

/**
 * API全体レスポンス
 */
export type tFooterApiResponse = tMap.tMapApiResponseList<tFooterListContent>;

/**
 * 整形後のフロント用シンプルデータ
 */
export interface tFooterItem {
  uuid: string;
  type: "Content01" | "Content02" | "Content03";
  flgAddress?: boolean;
  flgTel?: boolean;
  flgFax?: boolean;
  flgEmail?: boolean;
  flgMenus?: boolean;
  text?: string;
  logo?: Responsive<tMap.tMedia>;
  bgImg?: tMap.tMedia;
  customStyle?: string;
}
