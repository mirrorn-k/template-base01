import type { Metadata } from "next";

export default function siteMetaToMetadata(
  meta: Record<string, string> | null
): Metadata {
  if (!meta) {
    return {};
  }
  const result: Metadata = {};
  const other: Record<string, string> = {};

  for (const [key, value] of Object.entries(meta)) {
    // -------------------------
    // Basic
    // -------------------------
    if (key === "title") {
      result.title = value;
      continue;
    }

    if (key === "description") {
      result.description = value;
      continue;
    }

    if (key === "robots") {
      result.robots = process.env.NODE_ENV !== "production" ? "noindex" : value;
      continue;
    }

    if (key === "theme-color") {
      result.themeColor = value;
      continue;
    }

    // -------------------------
    // Open Graph
    // -------------------------
    if (key.startsWith("og:")) {
      const ogKey = key.slice(3);

      result.openGraph ??= {};

      switch (ogKey) {
        case "title":
          result.openGraph.title = value;
          break;
        case "description":
          result.openGraph.description = value;
          break;
        case "site_name":
          result.openGraph.siteName = value;
          break;
        case "url":
          result.openGraph.url = value;
          break;
        case "image":
        case "image:url":
          // OGImage | OGImage[]
          result.openGraph.images = [{ url: value }];
          break;
        default:
          other[key] = value;
      }
      continue;
    }

    // -------------------------
    // Twitter
    // -------------------------
    if (key.startsWith("twitter:")) {
      const twKey = key.slice(8);

      result.twitter ??= {};

      switch (twKey) {
        case "title":
          result.twitter.title = value;
          break;
        case "description":
          result.twitter.description = value;
          break;
        case "image":
          result.twitter.images = [value];
          break;
        case "site":
          result.twitter.site = value;
          break;
        // twitter:card は無視（Next.js が自動処理）
        default:
          other[key] = value;
      }
      continue;
    }

    // -------------------------
    // Icons
    // -------------------------
    if (key === "icon") {
      result.icons = {
        ...(typeof result.icons === "object" ? result.icons : {}),
        icon: value,
      };
      continue;
    }

    if (key === "apple-touch-icon") {
      result.icons = {
        ...(typeof result.icons === "object" ? result.icons : {}),
        apple: value,
      };
      continue;
    }

    // -------------------------
    // Fallback
    // -------------------------
    other[key] = value;
  }

  result.other = {
    mapttnouDomain: process.env.TTNOU_DOMAIN || "ttnou.com",
    mapttnouWdcApi: process.env.NEXT_PUBLIC_MAP_JS_EVENTDATA_POST_API || "",
  };

  console.log("siteMetaToMetadata result:", result);

  return result;
}
