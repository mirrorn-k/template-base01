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
export type tHeaderContentItem = tMap.tMapContentItem<tMediaContent>;

/**
 * 1つの listContent エントリ
 */
export type tHeaderListContent = tMap.tMapContent<tHeaderContentItem>;

/**
 * content_type の各アイテム定義
 */
export type tHeaderContentTypeItem = tMap.tMapTypeItem;

/**
 * content_type 情報
 */
export type tHeaderContentType = tMap.tMapContentType;

/**
 * API全体レスポンス
 */
export type tHeaderApiResponse = tMap.tMapApiResponseList<tHeaderListContent>;

/**
 * 整形後のフロント用シンプルデータ
 */
export interface tHeaderItem {
  uuid: string;
  type: "Header01" | "Header02" | "Header03";
  siteName: string;
  flg: boolean; // APIでは非表示フラグなので注意
  flgLogo: boolean;
  logo?: Responsive<tMap.tMedia>;
  flgMenus: boolean;
  flgContactButton: boolean;
}
