import { tMedia, tResponsiveMedia } from "@/types/ttnouMap";

export type tPage = {
  uuid: string;
  name: string;
  slug: string;
  settings: tSetting;
  kv: tKv;
  flg_show: boolean;
  meta: Record<string, string> | null;
  structured_data: Record<string, string | number | boolean | null> | null;
  contents: tPageContent[];
};

export type tPageContent =
  | ({ type: "content01" } & tContent01)
  | ({ type: "content02" } & tContent02)
  | ({ type: "content03" } & tContent03)
  | ({ type: "content04" } & tContent04);

export interface tContent01 {
  media: tResponsiveMedia | null;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent02 {
  media: tResponsiveMedia | null;
  title: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent03 {
  media: tResponsiveMedia | null;
  title: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

export interface tContent04 {
  title1: string;
  title2: string;
  caption: string;
  linkHref?: string | null;
  linkText?: string;
}

// ==============================
// content1（TemplateBase01）
// ==============================
export type tSetting = {
  subtitle: string;
  flgShowFooter: boolean;
  flgShowHeader: boolean;
};

// ==============================
// content2（TemplateBase01）
// ==============================
export type tKv = {
  // 元データ（UUID）
  catchcopy: string;

  // 展開後（アクセサで付与）
  logo: tMedia | null;
  kv: tResponsiveMedia | null;
};

// ==============================
// content3（TemplateBase01）
// ==============================
export type tContent = {
  name: string;
  type: string;
  content_items: tContentItem[];
};

export type tContentItem = {
  label: string;
  type: string;
  raw_value: string | null;
  content: tMedia | tResponsiveMedia | null;
};

// ==============================
// Page（APIレスポンス）
// ==============================
export type tPageApiResponce = {
  uuid: string;
  name: string;
  slug: string;
  flg_show: boolean;
  meta: Record<string, string> | null;
  structured_data: Record<string, string | number | boolean | null> | null;

  content1: tSetting | null;
  content2: tKv | null;
  content3: tContent[] | null;
};
