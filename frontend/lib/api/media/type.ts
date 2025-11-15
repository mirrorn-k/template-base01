import { Responsive } from "@/lib/responsiveValue/type";
import {
  tMapContent,
  tMapContentItem,
  tMedia,
  tMapContentType,
} from "@/types/ttnouMap";

/**
 * 他の型などで使うための共通型定義
 */
export type tResponsiveMediaItem = {
  name: string;
  caption: string;
  released_at: string;
} & Responsive<tMedia>;

/**
 * Contentのアイテム部分をResponsive化した型
 *
 */
export type tCustomMapContent = Omit<
  tMapContent<Responsive<never>>,
  "content_items"
> & {
  content_items: Responsive<tMedia>;
};

/**
 * ContentのアイテムをResponsiveに変化したもの
 * 扱いやすくするため、最初からResponsive化しておく
 */
export type tResponsiveMediaContent = tCustomMapContent;

// 個々のコンテンツアイテム
export type tResponsiveMediaContentItem = tMapContentItem<tMedia>;

/**
 * API取得時のContent生データの型
 */
export type tResponsiveMediaContentApi =
  tMapContent<tResponsiveMediaContentItem>;

/**
 * API全体レスポンス
 */
export type tResponsiveMediaListApiResponse = {
  content_type: tMapContentType;
  listContent: tResponsiveMediaContentApi[];
};

/**
 * API全体レスポンス
 */
export type tResponsiveMediaApiResponsive = {
  content_type: tMapContentType;
  content: tResponsiveMediaContentApi;
};
