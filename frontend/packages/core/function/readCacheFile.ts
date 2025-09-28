import fs from "fs";
import path from "path";

/**
 * cacheディレクトリからJSONファイルを読み込む共通関数
 * @param relativePath cache ディレクトリからの相対パス (例: "data.json")
 * @returns Record<string, string> | null
 */
export default function readCacheFile(
  relativePath: string
): Record<string, unknown> | null {
  try {
    const filePath = path.join(process.cwd(), "cache", relativePath);

    if (!fs.existsSync(filePath)) {
      console.warn(`[readCacheFile] File not found: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);

    if (typeof json === "object" && json !== null) {
      return json as Record<string, string>;
    } else {
      console.error(`[readCacheFile] Invalid JSON format: ${filePath}`);
      return null;
    }
  } catch (err) {
    console.error(`[readCacheFile] Failed to read file: ${relativePath}`, err);
    return null;
  }
}
