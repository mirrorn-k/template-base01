import { tMedia } from "@/types/ttnouMap";

export type tSite = {
  // =========================
  // PK / timestamps
  // =========================
  uuid: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  released_at: string;

  // =========================
  // 共通識別
  // =========================
  domain: string;

  // =========================
  // 基本情報
  // =========================
  url: string;
  name: string;
  type: string;

  // =========================
  // ロゴ（media uuid）
  // =========================
  logo_square_uuid: string | null;
  logo_horizontal_uuid: string | null;
  logo_full_uuid: string | null;

  // リレーション
  logo: tMedia | null;
  logo_square: tMedia | null;
  logo_horizontal: tMedia | null;

  // =========================
  // フラグ
  // =========================
  flg_wdc: boolean;

  // =========================
  // 外部タグ
  // =========================
  gtm_tag: string;

  // =========================
  // Basic認証（JSON）
  // =========================
  basic_auth: {
    flg: boolean;
    user?: string;
    pass?: string;
    ips?: string[];
  };

  // =========================
  // メタ情報（JSON）
  // =========================
  meta: Record<string, string> | null;

  // =========================
  // 構造化データ（JSON-LD）
  // =========================
  structured_data: Record<string, string | number | boolean | null> | null;

  // =========================
  // ヘッダー / フッター（JSON）
  // =========================
  header: {
    type: string;
    flg: boolean;
    title: string;
    flgLogo: boolean;
    flgShow: boolean;
    flgMenus: boolean;
    flgContactButton: boolean;
    logo: tMedia | null;
  };
  footer: {
    type: string;
    flgFax: boolean;
    flgTel: boolean;
    flgLogo: boolean;
    flgEmail: boolean;
    flgMenus: boolean;
    flgAddress: boolean;
    logo: tMedia | null;
    text: string;
    customCss: string;
  };
};
