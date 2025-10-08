import { Content, Item, ContentListApiResponse } from "@/types/mapContent";

/**
 * 下層ページ用の各 Item（ページ情報がネストされる）
 */
export interface SubpageItem extends Item {
  // 対象ページの content を持つ場合
  target_content?: Content | null;
}

/**
 * 下層ページ用コンテンツ（listContent要素）
 */
export interface SubpageContent extends Omit<Content, "content_items"> {
  content_items: SubpageItem[];
}

/**
 * 下層ページ用APIレスポンス
 */
export interface SubpageContentListApiResponse
  extends Omit<ContentListApiResponse, "listContent"> {
  listContent: SubpageContent[];
}
