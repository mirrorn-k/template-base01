import type { Metadata } from "next";
import * as META from "./const";
import readCacheFile from "../function/readCacheFile";

export function getMetaData(
  params: { slug?: string[] },
  key: string
): Metadata {
  // メタデータを設定
  let data: Metadata = META.INIT;

  // meta/jsonファイルからデータを取得
  const jsonFile = getMetaJsonFilePath();
  const metaData: Record<string, Metadata> | null = readCacheFile(jsonFile);
  if (!metaData) {
    return data;
  }

  if (key in metaData) {
    data = metaData[key];
  }

  if (!data.alternates) {
    data.alternates = {};
  }

  // canonicalを設定
  const pathname = "/" + (params?.slug?.join("/") ?? "");
  const url = `${pathname}`;
  data.alternates.canonical = url;

  // ファビコンやicon設定
  data.icons = {
    icon: "/favicon.svg", // 通常のファビコン
    shortcut: "/favicon.png", // shortcut icon
    apple: "/favicon.png", // Apple touch icon
    other: [{ rel: "mask-icon", url: "/favicon.png" }],
  };

  return data;
}

/**
 * JSONファイルのパスを取得
 * @returns
 */
export function getMetaJsonFilePath() {
  const PROJECT_ROOT = process.cwd(); // ← npm script 実行位置(frontend/)
  return `${PROJECT_ROOT}/cache/meta/${process.env.NEXT_DOMAIN}.json`;
}
