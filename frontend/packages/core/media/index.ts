import { tMedia } from "./type";

export const convert = async (media?: tMedia) => {
  if (!media || !media.url) {
    return null;
  }

  // urlにloclahost:8102が含まれている場合は、DockerのURLに変換
  if (media.url.includes("localhost:8102")) {
    media.url = media.url.replace("localhost:8102", "backend");
  }

  return media;
};
