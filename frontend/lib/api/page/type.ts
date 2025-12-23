import { tMedia } from "@/types/ttnouMap";
import * as tMap from "@/types/ttnouMap";

/**
 * pageから作成するメニューリスト
 */
export interface tMenuItem {
  uuid: string;
  label: string;
  slug: string;
  img?: tMap.tResponsiveMedia;
}

export interface tPage {
  uuid: string;
  name: string;
  slug: string;
  type: string;
  settings: tPageSetting;
  contents: tPageContent[];
}

export type tPageContent =
  | ({ type: "content01" } & tContent01)
  | ({ type: "content02" } & tContent02)
  | ({ type: "content03" } & tContent03)
  | ({ type: "content04" } & tContent04);

export interface tContent01 {
  media: tMedia | null;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent02 {
  media: tMedia | null;
  title: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent03 {
  media: tMedia | null;
  title: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent04 {
  media: tMedia | null;
  title1: string;
  title2: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

/**
 * =========================
 * Page Settings
 * =========================
 */
export interface tPageSetting {
  kv_uuid: string | null;
  kv?: tMap.tResponsiveMedia;
  title: string;
  subtitle: string;
  catchcopy: string;
  flgShow: boolean;
  flgShowHeader: boolean;
  flgShowFooter: boolean;
}

/**
 * =========================
 * Page Footer（content2）
 * =========================
 */
//export interface tPageFooter {}

/**
 * =========================
 * Page に配置される Content（content3 要素）
 * =========================
 */
export type tPageContentItem = {
  type: string;
  content: tContent;
};

/**
 * 各コンテンツアイテム
 */
export type tContentItem = tMap.tMapContentItem<tMedia>;

/**
 * コンテンツ本体
 */
export type tContent = tMap.tMapContent<tContentItem>;

/**
 * =========================
 * Page 本体
 * =========================
 */
export interface tPageApiResponse {
  uuid: string;
  domain: string;
  name: string;
  key: string;
  slug: string;
  type: string;

  released_at: string;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  content1: tPageSetting;
  content2: null;
  content3: {
    type: string;
    content: tContent;
  }[];

  content4: null;
  content5: null;
}

/**
 * =========================
 * API レスポンス（配列）
 * =========================
 */
export type tPageListApiResponse = tPageApiResponse[];
