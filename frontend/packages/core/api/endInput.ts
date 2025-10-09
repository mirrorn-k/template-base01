import * as TypeForm from "../../core/form/type";
import { create } from "../../core/axios";

/**
 * MA+の問い合わせフォームの送信
 * @param params
 * @returns
 */
export function post(params: TypeForm.tPostMapEndInput) {
  const API_URL = process.env.NEXT_PUBLIC_MAP_TTNOU_ENDINPUT_STORE || "";
  const ins = create();
  return ins.post(API_URL, {
    ...params,
  });
}
