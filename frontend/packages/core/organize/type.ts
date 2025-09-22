/**
 * MA+の組織情報
 */
export type tOrganize = {
  number: string; // 法人番号
  domain: string; // ドメイン名
  organization_name: string; // 組織名
  ceo_name: string; // 代表者名
  ceo_post_name: string; // 代表役職
  tell: string; // 電話番号
  fax: string; // FAX番号
  postal_code: string; // 郵便番号
  address: string; // 住所
  address_other: string; // 住所その他
  email: string; // メールアドレス
  google_map: string; // Google Map URL
  google_map_link: string; // Google Mapリンク
  google_tm_script: string; // Google Tag Manager Script
  google_tm_script_body: string; // Google Tag Manager Script Body
  caption: string; // キャッチコピー
};
