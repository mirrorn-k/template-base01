/**
 * APIのURL変換処理
 * @param url
 * @returns
 */
export default function Main(url: string): string | null {
  try {
    // urlをUrlオブジェクトに変換
    let parsedUrl = new URL(url);

    // ホスト名がlocalhostかどうかをチェック
    if (isServerSide()) {
      parsedUrl = isLocalhost(parsedUrl);
    }

    return parsedUrl.toString();
  } catch (error) {
    console.error(`[ERROR] Invalid URL: ${url}`, error);
    return null;
  }
}
/**
 * サーバサイド実行かどうかを判定
 * - Node.js 環境なら true
 * - ブラウザ環境なら false
 */
function isServerSide(): boolean {
  return typeof window === "undefined";
}

/**
 * ローカルホスト名の場合の処理
 * @param url
 * @returns
 */
function isLocalhost(url: URL): URL {
  // ポート番号が8102の場合はトトノウMA＋のバックエンドコンテナを指すのでエイリアス名に変換
  if (url.hostname === "localhost" && url.port === "8102") {
    url.hostname = "backend";
    url.port = "80"; // ポート番号も変更
  }

  return url;
}
