/**
 * フォーム項目管理型
 */
export type tFormItem = {
  uuid: string;
  label: string;
  system_name: string;
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
