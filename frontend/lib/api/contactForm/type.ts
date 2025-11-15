import * as tMap from "@/types/ttnouMap";

/**
 * コンテンツアイテム型
 */
export type tContentItem = tMap.tMapContentItem<string | string[] | null>;

/**
 * コンテンツリスト型
 */
export type tListContent = tMap.tMapContent<tContentItem>;

/**
 * コンテンツタイプアイテム型
 */
export type tContentTypeItem = tMap.tMapTypeItem;

/**
 * コンテンツタイプ型
 */
export type tContentType = tMap.tMapContentType;

/**
 * フォームAPIレスポンス型
 */
export type tFormApiResponse = tMap.tMapApiResponseList<tListContent>;

/**
 * フォーム項目管理型 API取得関数の戻り値
 */
export type tFormItem = {
  uuid: string;
  systemName?: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox";
  placeholder: string;
  required: boolean;
  row?: number; // textareaの時のみ
  options?: string[]; // select, radio, checkboxの時のみ
};
