import * as tPostEndInput from "./type";
import { create } from "@/lib/axios";

/**
 * MA+の問い合わせフォームの送信
 * @param params
 * @returns
 */
export function post(params: tPostEndInput.tPostMapEndInput) {
  const API_URL = process.env.NEXT_PUBLIC_MAP_TTNOU_ENDINPUT_STORE || "";
  const ins = create();
  return ins.post(API_URL, {
    ...params,
  });
}
