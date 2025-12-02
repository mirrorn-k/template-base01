import Content01 from "./Content01";
import Content02 from "./Content02";
import Content03 from "./Content03";
import Content04 from "./Content04";
import * as tMapContent from "@/lib/api/contents/type";
import { tMedia } from "@/types/ttnouMap";

interface Props {
  contents: tMapContent.tContent[];
}

export default function Main({ contents }: Props) {
  if (!Array.isArray(contents)) {
    console.error("contents is not array", contents);
    return null;
  }
  return contents.map((content) => {
    const style = content.content_items.find((ci) => ci.label === "スタイル");
    if (!style) return <></>;
    const c = content.content_items.find((ci) => ci.label === "コンテンツ");
    if (!c) return <></>;

    if (style.raw_value === "Content01") {
      return (
        <Content01
          key={`top-content-${c.id}`}
          media={c.content?.イメージ１ as tMedia}
          caption={c.content?.キャプション１ as string | ""}
          linkHref={c.content?.リンク as string}
          linkText={c.content?.リンクラベル as string}
        />
      );
    } else if (style.raw_value === "Content02") {
      return (
        <Content02
          key={`top-content-${c.id}`}
          media={c.content?.イメージ１ as tMedia}
          title={c.content?.タイトル as string}
          caption={c.content?.キャプション１ as string}
        />
      );
    } else if (style.raw_value === "Content03") {
      return (
        <Content03
          key={`top-content-${c.id}`}
          media={c.content?.イメージ１ as tMedia}
          title={c.content?.タイトル as string}
          caption={c.content?.キャプション１ as string}
          linkHref={c.content?.リンク as string}
          linkText={c.content?.リンクラベル as string}
        />
      );
    } else if (style.raw_value === "Content04") {
      return (
        <Content04
          key={`top-content-${c.id}`}
          title1={c.content?.タイトル as string}
          title2={c.content?.サブタイトル as string}
          media={c.content?.イメージ１ as tMedia}
          caption={c.content?.キャプション１ as string}
          linkHref={c.content?.リンク as string}
          linkText={c.content?.リンクラベル as string}
        />
      );
    } else {
      console.log("未対応のスタイル ", style.raw_value);
      return <></>;
    }
  });
}
