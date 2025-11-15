// packages/api/type.ts
import { Responsive } from "@/lib/responsiveValue/type";
import * as tMap from "@/types/ttnouMap";
import { tResponsiveMediaItem } from "@/lib/api/media/type";

/**
 * 画像コンテンツの値の型
 * 画像がない場合はnull、単一画像の場合はtMedia、レスポンシブ画像の場合はtResponsiveMediaContent
 * */
export type ImgContentValue = null | tResponsiveMediaItem;

/**
 * メニューアイテム
 */
export interface tMenuItem {
  uuid: string;
  label: string;
  slug: string;
  img?: Responsive<tMap.tMedia>;
}

/**
 * コンテンツアイテム
 */
export type tMenuContentItem = tMap.tMapContentItem<ImgContentValue>;

/**
 * コンテンツリスト
 */
export type tMenuContent = tMap.tMapContent<tMenuContentItem>;

/**
 * コンテンツタイプ
 */
export type tMenuContentType = tMap.tMapContentType;

/**
 * API全体レスポンス
 */
export type tMenuListApiResponse = tMap.tMapApiResponseList<tMenuContent>;
