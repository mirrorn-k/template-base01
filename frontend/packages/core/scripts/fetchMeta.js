/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config(); // .env 読み込み
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_URL = process.env.NEXT_PUBLIC_META_API_URL;

const MEDIA = {
  NO_IMAGE: {
    url: "/no-image.png", // 適宜修正
  },
};

const downloadImage = async (media) => {
  // TODO: 実際の画像ダウンロード処理を書くならここ
  return media; // 今はそのまま返す
};

async function fetchAndWriteMeta() {
  try {
    if (!API_URL) {
      throw new Error("META_API_URL is not defined in .env");
    } else {
      console.log("Fetching META from:", API_URL);
    }

    const res = await axios.get(API_URL);
    const items = res.data.listContent;

    const data = {};

    for (const obj of items) {
      const key = obj.items?.["キー"];

      if (!key || data[key]) {
        console.warn(`Duplicate or missing key in meta data: ${key}`);
        continue;
      }

      const item = obj.items;
      let img = MEDIA.NO_IMAGE;

      if (item["og:image"] && item["og:image"].url) {
        const localMedia = await downloadImage(item["og:image"]);
        if (!localMedia) {
          console.error("Failed to download image:", item["og:image"].url);
          continue;
        }
        img = localMedia;
      }
      const ALLOWED = new Set([
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
      ]);

      const ogImages = (u) => (u ? [{ url: u }] : undefined);
      const twImages = (u) => (u ? [u] : undefined);

      data[key] = {
        title: item.title,
        description: item.description,
        openGraph: {
          title: item["og:title"] ?? item.title,
          description: item["og:description"] ?? item.description,
          images: ogImages(img.url), // ← 配列+オブジェクト
          url: item["og:url"],
          type: ALLOWED.has(item["og:type"]) ? item["og:type"] : undefined,
          siteName: item["og:site_name"] || undefined, // ← null排除
        },
        twitter: {
          card:
            item["twitter:card"] === "summary_large_image"
              ? "summary_large_image"
              : "summary",
          title: item["og:title"] ?? item.title,
          description: item["og:description"] ?? item.description,
          images: twImages(img.url), // ← 配列に統一
        },
      };
    }

    const PROJECT_ROOT = process.cwd(); // ← npm script 実行位置(frontend/)
    const outputDir = path.join(PROJECT_ROOT, "cache/meta");
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${process.env.NEXT_DOMAIN}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log("✅ METAデータを書き出しました:", outputPath, data);
  } catch (error) {
    console.error("❌ METAの取得に失敗しました:", error);
    //process.exit(1);
  }
}

fetchAndWriteMeta();
