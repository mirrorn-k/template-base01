import getFetch from "@/packages/core/api/getFetch";
import { ThemeOptions } from "@mui/material/styles";
import { ThemeApiResponse } from "@/types/mapTheme";

export default async function getTheme(): Promise<ThemeOptions> {
  try {
    const dataSetting: ThemeApiResponse = await getFetch(
      `${process.env.NEXT_PUBLIC_MAP_API_THEME}`
    );

    return convert(dataSetting);
  } catch (e) {
    console.error("[getTheme] fetch error", e);
    return {};
  }
}

/**
 * APIレスポンスをMUI Themeに変換
 */
function convert(data: ThemeApiResponse): ThemeOptions {
  // MUI の createTheme に渡すためのオプションオブジェクト
  const overrides: ThemeOptions = {};

  // API から返ってきた listContent をループ
  data.listContent.forEach((item) => {
    // 「項目名」と「値」を取り出す
    // 例: 項目名 = "palette-primary-main", 値 = "rgb(39,70,124)"
    const key = item.content_items.find((c) => c.label === "項目名")?.raw_value;
    const value = item.content_items.find((c) => c.label === "値")?.raw_value;

    if (key && value) {
      // キーを「-」で分割してパス配列に変換
      // "palette-primary-main" → ["palette", "primary", "main"]
      const path = key.split("-");

      // いま操作しているオブジェクトの参照を保持する変数
      // 最初は overrides を指す
      let current: ThemeOptions = overrides;

      // パスを順番に処理
      path.forEach((k, idx) => {
        if (idx === path.length - 1) {
          // 最後の要素（= 実際に値をセットする場所）
          // current["main"] = "rgb(39,70,124)" みたいに代入
          (current as Record<string, unknown>)[k] = value;
        } else {
          // 途中の階層ならオブジェクトを作成して掘り下げる
          // 例: current["palette"] が無ければ {} を作る
          if (!(current as Record<string, unknown>)[k]) {
            (current as Record<string, unknown>)[k] = {};
          }
          // さらに深い階層を current に更新
          current = (current as Record<string, unknown>)[k] as ThemeOptions;
        }
      });
    }
  });

  return overrides;
}
