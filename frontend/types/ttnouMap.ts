/**
 * メディアコンテンツの型
 */
export type tMedia = {
  url: string;
  file: string;
  name: string;
  caption: string;
  uuid: string;
  width: number;
  height: number;
  useApi?: boolean;
};

/**
 * APIのパラメータ型
 */
export type tParams<T> = {
  page?: number;
  limit?: number;
  filter?: T;
  orderby?: { field: string; direction: "asc" | "desc" }[];
};

/**
 * コンテンツタイプ定義
 */
export interface tMapContentType {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: tMapTypeItem[];
}

/**
 * コンテンツタイプの各アイテム定義
 */
export interface tMapTypeItem {
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

/**
 * MA+から取得した時のコンテンツ型
 * @uuid(string) コンテンツのUUID
 * @contentType_uuid(string) コンテンツタイプのUUID
 * @domain(string) コンテンツのドメイン
 * @order(number) コンテンツの順序
 * @name(string) コンテンツのタイトル相当
 * @caption(string) コンテンツのサブ説明
 * @released_at(string) コンテンツの公開日時
 * @deadline(string) コンテンツの締切日時
 * @created_at(string) コンテンツの作成日時
 * @updated_at(string) コンテンツの更新日時
 * @deleted_at(string | null) コンテンツの削除日時（存在する場合）
 * @content_items(T) コンテンツの各アイテム（tMapContentItem の配列など）
 *
 */
export interface tMapContent<T> {
  uuid: string;
  contentType_uuid: string;
  domain: string;
  order: number;
  name: string; // タイトル相当
  caption: string; // サブ説明
  released_at: string; // 公開日時
  deadline: string; // 締切日時
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  content_items: T[];
}

/**
 * 個々のコンテンツアイテム
 * @id(number) コンテンツアイテムID
 * @label(string) コンテンツアイテムのラベル（例: "xs", "sm", "md", "lg", "xl" など）
 * @type(string) コンテンツアイテムのタイプ（例: "string", "textarea", "choice", "media" など）
 * @raw_value(string | null) コンテンツアイテムの実際の値
 * @options(string[] | null) コンテンツアイテムのオプション（存在する場合）
 * @type_kbn(number) コンテンツアイテムのタイプ区分
 * @type_options(string[] | null) コンテンツアイテムのタイプオプション（存在する場合）
 * @content(T | null) コンテンツアイテムの内容（メディアの場合は tMedia 型）
 * @created_at(string) コンテンツアイテムの作成日時
 * @updated_at(string) コンテンツアイテムの更新日時
 * @deleted_at(string | null) コンテンツアイテムの削除日時（存在する場合）
 * @domain(string) コンテンツアイテムのドメイン
 * @content_uuid(string) コンテンツアイテムのUUID
 * @order(number) コンテンツアイテムの順序
 *
 */
export interface tMapContentItem<T> {
  id: number;
  label: string; // "xs" | "sm" | "md" | "lg" | "xl" など
  type: string; // "string" | "textarea" | "choice" | "media" etc
  raw_value: string | number | boolean | null; // 実際の値
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
  content?: T; // メディアの場合は tMedia
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  domain: string;
  content_uuid: string;
  order: number;
}

/**
 * APIレスコンス（ページネーション用）
 * ページネーション共通
 */
export interface tMapPaginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  to: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}

/**
 * コンテンツタイプ定義（APIレスポンス用）
 */
interface tMapApiResponseCT {
  uuid: string;
  domain: string;
  name: string;
  caption: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items: unknown[]; // content_type.items は定義情報なので unknown[] で良い
}

/**
 *  API レスポンス（リスト用）
 *  ページネーションなし → listContent は KvContent[] で固定
 * */
export interface tMapApiResponsePagenated<T> {
  content_type: tMapApiResponseCT;
  listContent: T;
}

/**
 *  API レスポンス（リスト用）
 *  ページネーションなし → listContent は KvContent[] で固定
 * */
export interface tMapApiResponseList<T> {
  content_type: tMapApiResponseCT;
  listContent: T[];
}

/**
 * API レスポンス（単一取得用）
 *
 * */
export interface tMapApiResponseItem<T> {
  content_type: tMapApiResponseCT;
  content: T;
}

export interface tResponsiveMedia {
  label: string;
  xs: tMedia | null;
  sm: tMedia | null;
  md: tMedia | null;
  lg: tMedia | null;
  xl: tMedia | null;
}

/**
 * メニューアイテム
 */
export interface tMenuItem {
  uuid: string;
  label: string;
  slug: string;
  img?: tResponsiveMedia;
  flgHeadr: boolean;
  flgFooter: boolean;
}
