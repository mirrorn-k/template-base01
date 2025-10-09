// functions/api/meta/getMeta.ts
import getFetch from "@/packages/core/api/getFetch";
import { Metadata } from "next";
import { tMedia } from "@/packages/component/media/type";
import {
  MetaApiResponse,
  MetaLinkedContent,
  MetaListContent,
  MetaContentItem,
} from "./type";

/* ===================== 基本型・定数 ===================== */

type MetaValue = string | tMedia | null;

interface Props {
  slug?: string; // 未指定なら TOP として扱う
}

const INIT: Metadata = {
  title: "",
  description: "",
  openGraph: {
    title: "",
    description: "",
    url: "",
    type: "website",
    siteName: "",
    images: [],
  },
  twitter: { card: "summary" },
};

const ENV_ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "").replace(
  /\/$/,
  ""
);

/* ---- OG type（厳密） ---- */
const VALID_OG_TYPES = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
] as const;
type OgType = (typeof VALID_OG_TYPES)[number];

/* ---- Twitter card（構造要件が軽い2種のみ） ---- */
const VALID_TWITTER_CARDS = ["summary", "summary_large_image"] as const;
type TwitterCard = (typeof VALID_TWITTER_CARDS)[number];

/* ===================== 小さなユーティリティ ===================== */

// そのまま使うとき用（Mapから型安全に取り出す）
function getStr(map: Map<string, MetaValue>, key: string): string | undefined {
  const v = map.get(key);
  return typeof v === "string" ? v : undefined;
}
function getMedia(
  map: Map<string, MetaValue>,
  key: string
): tMedia | undefined {
  const v = map.get(key);
  return v && typeof v !== "string" && isTMedia(v) ? v : undefined;
}

function normalizeSlug(slug?: string): string {
  const v = (slug ?? "").trim();
  return v === "" ? "TOP" : v;
}
function isTMedia(v: unknown): v is tMedia {
  return (
    typeof v === "object" &&
    v !== null &&
    "url" in (v as Record<string, unknown>) &&
    typeof (v as Record<string, unknown>).url === "string"
  );
}
function absoluteUrl(
  u: string | undefined,
  baseUrl?: string
): string | undefined {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  const path = `/${u.replace(/^\/*/, "")}`;
  const base = (baseUrl ?? ENV_ORIGIN).replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}
function readStrProp(obj: unknown, key: string): string | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === "string" ? v : undefined;
}

/* ===================== “キー”解決（そのまま使わない → 関数化） ===================== */

function extractKeyValueFromItem(item: MetaContentItem): string {
  // content の { スラッグ | slug | name } 優先
  const c = item.content as MetaLinkedContent | null;
  const fromContent =
    readStrProp(c, "スラッグ") ??
    readStrProp(c, "slug") ??
    readStrProp(c, "name");
  if (fromContent) return fromContent;

  // raw_value
  if (typeof item.raw_value === "string") return item.raw_value;

  // type_options[0]
  if (
    Array.isArray(item.type_options) &&
    typeof item.type_options[0] === "string"
  ) {
    return item.type_options[0];
  }
  return "";
}

/* ===================== Map 生成（そのまま使う項目は以降 getStr/getMedia で直取得） ===================== */

function toLabelValueMap(
  items: MetaContentItem[] | undefined
): Map<string, MetaValue> {
  const map = new Map<string, MetaValue>();
  for (const item of items ?? []) {
    let value: MetaValue = null;
    switch (item.type_kbn) {
      case 6:
        value = isTMedia(item.content) ? item.content : null;
        break; // media
      default:
        value = item.raw_value ?? null;
        break; // string/choice/textarea/boolean
    }
    map.set(item.label, value);
  }
  return map;
}

/* ===================== 派生値（そのまま使わない → 関数化） ===================== */

// metadataBase: string → URL
function deriveMetadataBase(map: Map<string, MetaValue>): URL | undefined {
  const baseStr = getStr(map, "metadataBase") ?? (ENV_ORIGIN || undefined);
  if (!baseStr) return undefined;
  try {
    return new URL(baseStr);
  } catch {
    return undefined;
  }
}

// OG.type: validate（なければ website）
function deriveOgType(map: Map<string, MetaValue>): OgType {
  const raw = getStr(map, "og:type");
  return raw && (VALID_OG_TYPES as readonly string[]).includes(raw)
    ? (raw as OgType)
    : "website";
}

// OG.title/description: フォールバック
function deriveOgTitle(map: Map<string, MetaValue>): string | undefined {
  return getStr(map, "og:title") ?? getStr(map, "title");
}
function deriveOgDescription(map: Map<string, MetaValue>): string | undefined {
  return getStr(map, "og:description") ?? getStr(map, "description");
}

// OG.image/url: 相対→絶対化（metadataBase優先）
function deriveOgImageUrl(
  map: Map<string, MetaValue>,
  metaBase?: URL
): string | undefined {
  const m = getMedia(map, "og:image");
  return absoluteUrl(m?.url, metaBase?.toString());
}
function deriveOgUrl(
  map: Map<string, MetaValue>,
  metaBase?: URL
): string | undefined {
  return absoluteUrl(getStr(map, "og:url"), metaBase?.toString());
}

// canonical: 相対→絶対化
function deriveCanonical(
  map: Map<string, MetaValue>,
  metaBase?: URL
): string | undefined {
  return absoluteUrl(getStr(map, "canonical"), metaBase?.toString());
}

// robots: 文字列→Metadata.robots
function deriveRobots(
  map: Map<string, MetaValue>
): Metadata["robots"] | undefined {
  const raw = getStr(map, "robots");
  if (!raw) return undefined;
  const s = raw.toLowerCase();
  if (s === "index,follow") return { index: true, follow: true };
  if (s === "noindex,nofollow") return { index: false, follow: false };
  return s; // 任意文字列はそのまま
}

// twitter: card/title/description/images
function deriveTwitterCard(map: Map<string, MetaValue>): TwitterCard {
  const raw = getStr(map, "twitter:card");
  return raw && (VALID_TWITTER_CARDS as readonly string[]).includes(raw)
    ? (raw as TwitterCard)
    : "summary";
}
function deriveTwitterTitle(map: Map<string, MetaValue>): string | undefined {
  return getStr(map, "twitter:title") ?? getStr(map, "title");
}
function deriveTwitterDescription(
  map: Map<string, MetaValue>
): string | undefined {
  return getStr(map, "twitter:description") ?? getStr(map, "description");
}
function deriveTwitterImageUrl(
  map: Map<string, MetaValue>,
  metaBase?: URL
): string | undefined {
  // twitter:image がなければ og:image を使う
  const tw = getMedia(map, "twitter:image");
  const og = getMedia(map, "og:image");
  const chosen = tw ?? og ?? undefined;
  return absoluteUrl(chosen?.url, metaBase?.toString());
}

// verification（google/bing）→ verification.other に集約
function deriveVerification(
  map: Map<string, MetaValue>
): Metadata["verification"] {
  const google = getStr(map, "google-site-verification");
  const bing = getStr(map, "bing-site-verification");
  const other: Record<string, string> = {};
  if (google) other["google-site-verification"] = google;
  if (bing) other["bing-site-verification"] = bing;
  return Object.keys(other).length ? { other } : undefined;
}

/* ===================== レコード選択（そのまま使わない → 関数化） ===================== */

function pickRecordBySlug(
  data: MetaApiResponse,
  slug: string
): MetaListContent | undefined {
  const wanted = normalizeSlug(slug);
  return data.listContent.find((content) => {
    const items = Array.isArray(content.content_items)
      ? content.content_items
      : [];
    const keyItem = items.find((i) => i.label === "キー");
    if (!keyItem) return false;
    return extractKeyValueFromItem(keyItem) === wanted;
  });
}

/* ===================== 変換本体 ===================== */

function convert(data: MetaApiResponse | null, slug: string): Metadata {
  if (!data?.listContent?.length) return INIT;

  const target =
    pickRecordBySlug(data, slug) ??
    (slug !== "TOP" ? pickRecordBySlug(data, "TOP") : undefined);
  if (!target) return INIT;

  const map = toLabelValueMap(target.content_items);

  // ---- そのまま使う項目（直取得） ----
  const title = getStr(map, "title");
  const description = getStr(map, "description");
  const siteName = getStr(map, "og:site_name");
  const themeColor = getStr(map, "theme-color");

  // ---- 関数で導出する項目 ----
  const metadataBase = deriveMetadataBase(map);
  const ogTitle = deriveOgTitle(map);
  const ogDescription = deriveOgDescription(map);
  const ogType = deriveOgType(map);
  const ogImageUrl = deriveOgImageUrl(map, metadataBase);
  const ogUrl = deriveOgUrl(map, metadataBase);
  const canonical = deriveCanonical(map, metadataBase);
  const robots = deriveRobots(map);
  const twitterCard = deriveTwitterCard(map);
  const twitterTitle = deriveTwitterTitle(map);
  const twitterDescription = deriveTwitterDescription(map);
  const twitterImageUrl = deriveTwitterImageUrl(map, metadataBase);
  const verification = deriveVerification(map);

  // ---- 組み立て ----
  const meta: Metadata = {
    ...(metadataBase ? { metadataBase } : {}),
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      type: ogType,
      siteName,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter:
      twitterCard === "summary" || twitterCard === "summary_large_image"
        ? {
            card: twitterCard,
            ...(twitterTitle ? { title: twitterTitle } : {}),
            ...(twitterDescription ? { description: twitterDescription } : {}),
            ...(twitterCard === "summary_large_image" && twitterImageUrl
              ? { images: [twitterImageUrl] }
              : {}),
          }
        : undefined,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(robots ? { robots } : {}),
    ...(themeColor ? { themeColor } : {}),
    ...(verification ? { verification } : {}),
  };

  return meta;
}

/* ===================== 外向け：取得＋変換 ===================== */

export default async function getMeta(props: Props): Promise<Metadata> {
  const slug = normalizeSlug(props.slug);
  try {
    const res: MetaApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_META_API_URL}`
    );
    return convert(res, slug);
  } catch (e) {
    console.error("[getMeta] API取得エラー:", e);
    return INIT;
  }
}
