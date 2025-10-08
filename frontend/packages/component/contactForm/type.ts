// packages/api/type/form.ts
export interface ContentItem {
  id: number;
  label: string;
  type: string; // string, choice, boolean, number, list...
  raw_value: string | null;
  options: string[] | null;
  type_kbn: number;
  type_options: string[] | null;
}

export interface ListContent {
  uuid: string;
  name: string;
  caption: string;
  released_at: string;
  content_items: ContentItem[];
}

export interface ContentTypeItem {
  id: number;
  label: string;
  type: number;
  options: string[] | null;
  require: boolean;
}

export interface ContentType {
  uuid: string;
  name: string;
  caption: string;
  items: ContentTypeItem[];
}

export interface FormApiResponse {
  content_type: ContentType;
  listContent: ListContent[];
}

// 画面での扱い方

/**
 * フォーム項目管理型
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

/**
 * フォーム送信API入力値
 */
export type tPostMapEndInput = {
  type: string;
  input: tInputItem[];
  referrer: string;
};

/**
 * フォーム入力値
 */
export type tInputItem = {
  name: string;
  required: boolean;
  label: string;
  value: tInputValue;
  mulitiLine?: boolean;
};

export type tInputValue = string | number | boolean | null;
