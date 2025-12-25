import getFetch, { fetchWithParams } from "@/lib/api/getFetch";
import {
  tPageListApiResponse,
  tPageApiResponse,
  tPage,
  tPageContent,
} from "./type";
import { tParams, tResponsiveMedia } from "@/types/ttnouMap";

/**
 * SSR/SSG 用：ページ情報を取得
 */
export async function getPages(
  terms?: tParams<{ slug?: string }>
): Promise<tPage[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_MAP_API_PAGE}?${process.env.NEXT_PUBLIC_MAP_API_PAGE_PARAMS}`;
    const u = fetchWithParams<{ slug?: string }>(url, terms);

    const data: tPageListApiResponse = await getFetch(u);

    // スラッグのみを抽出
    const slugs = Array.from(new Set(data.map((page) => page.slug)));

    // 各スラッグに対応する最初のページ情報を取得
    const pages = slugs.map((slug) => {
      return data.find((page) => page.slug === slug)!;
    });

    return pages.map((item) => convert(item));
  } catch (e) {
    console.error("[getPages] fetch error", e);
    return [];
  }
}

/**
 * スタッグ指定でページ情報を取得
 */
export default async function getPage(slug: string): Promise<tPage> {
  try {
    const terms: tParams<{ slug?: string }> = { filter: { slug } };
    const url = `${process.env.NEXT_PUBLIC_MAP_API_PAGE}?${process.env.NEXT_PUBLIC_MAP_API_PAGE_PARAMS}`;
    const u = fetchWithParams<{ slug?: string }>(url, terms);

    const data: tPageApiResponse[] = await getFetch(u);

    console.log("[getPage] data", data);

    return convert(data[0]);
  } catch (e) {
    console.error("[getPages] fetch error", e);
    return {} as tPage;
  }
}

function convert(res: tPageApiResponse): tPage {
  if (!res || typeof res !== "object") return {} as tPage;

  const obj: tPage = {
    uuid: res.uuid,
    name: res.name || "",
    slug: res.slug || "",
    type: res.type || "",
    settings: {
      kv_uuid: null,
      kv: undefined,
      title: "",
      subtitle: "",
      catchcopy: "",
      flgShow: true,
      flgShowHeader: true,
      flgShowFooter: true,
    },
    contents: [],
  };

  // ページ設定について
  const content1 = res.content1;
  obj.settings = convertContent1(content1);

  // 表示コンテンツについて
  const content3 = res.content3;
  obj.contents = convertContent3(content3);

  console.log("[convert] obj", JSON.stringify(obj));
  return obj;
}

function convertContent1(c1: tPageApiResponse["content1"]): tPage["settings"] {
  return c1;
}

function convertContent3(c3: tPageApiResponse["content3"]): tPage["contents"] {
  if (!c3 || !Array.isArray(c3)) return [];

  return c3.flatMap<tPageContent>((item): tPageContent[] => {
    const ci = item.content.content_items;

    const pick = (label: string) => ci.find((i) => i.label === label);

    switch (item.type) {
      case "content01":
        return [
          {
            type: "content01",
            media: (pick("イメージ")?.content as tResponsiveMedia) ?? null,
            caption: (pick("キャプション")?.raw_value as string) ?? "",
            linkHref: (pick("リンク")?.raw_value as string) ?? null,
            linkText: (pick("リンクラベル")?.raw_value as string) ?? "",
          },
        ];

      case "content02":
        return [
          {
            type: "content02",
            media: (pick("イメージ")?.content as tResponsiveMedia) ?? null,
            title: (pick("タイトル")?.raw_value as string) ?? "",
            caption: (pick("キャプション")?.raw_value as string) ?? "",
          },
        ];

      case "content03":
        return [
          {
            type: "content03",
            media: (pick("イメージ")?.content as tResponsiveMedia) ?? null,
            title: (pick("タイトル")?.raw_value as string) ?? "",
            caption: (pick("キャプション")?.raw_value as string) ?? "",
            linkHref: (pick("リンク")?.raw_value as string) ?? null,
            linkText: (pick("リンクラベル")?.raw_value as string) ?? "",
          },
        ];

      case "content04":
        return [
          {
            type: "content04",
            title1: (pick("タイトル１")?.raw_value as string) ?? "",
            title2: (pick("タイトル２")?.raw_value as string) ?? "",
            caption: (pick("キャプション")?.raw_value as string) ?? "",
            linkHref: (pick("リンク")?.raw_value as string) ?? null,
            linkText: (pick("リンクラベル")?.raw_value as string) ?? "",
          },
        ];

      default:
        return [];
    }
  });
}
