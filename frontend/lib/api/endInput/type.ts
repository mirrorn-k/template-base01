/**
 * フォーム送信API入力値
 */
export type tPostMapEndInput = {
  type?: string;
  domain?: string;
  input: tInputItem[];
  referrer: string;
};

/**
 * フォーム入力値
 */
export type tInputItem = {
  required: boolean;
  label: string;
  mulitiLine?: boolean;
};
