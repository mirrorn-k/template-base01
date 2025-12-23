import { tMedia } from "@/types/ttnouMap";

const idProd = process.env.NODE_ENV === "production";

const normalizeMediaUrl = (media?: tMedia) => {
  if (!media || !media.url) {
    return media;
  }

  return media;

  if (idProd) {
    // 本番環境の場合
    media.url = media.url.replace("https://ma-plus-backend.ttnou.com", "");
  } else {
    media.url = media.url.replace("http://localhost:8102", "");
    media.url = media.url.replace("https://ma-plus-backend.ttnou.com", ""); // バックアップからのデータを直接表示できるようにするために必要
  }

  return media;
};

export default normalizeMediaUrl;
