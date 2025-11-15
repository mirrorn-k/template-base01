export type tInputValue = string | number | boolean | null;

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
