import Content01 from "./Content01";
import Content02 from "./Content02";
import { Box } from "@mui/material";
import Title from "@/atoms/Title";
import * as tMapContent from "@/types/mapContent";
import { tMedia } from "@/packages/component/media/type";

interface Props {
  contents: tMapContent.Content[];
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
        <Box key={`top-content-${c.id}`}>
          <Title
            text={["見出しタイトル"]} // 配列で渡すと改行される
            component={"h2"}
          />
          <Content02
            key={c.id}
            media={c.content?.イメージ１ as tMedia}
            title={c.content?.タイトル as string}
            caption={c.content?.キャプション１ as string}
          />
        </Box>
      );
    } else {
      console.log("未対応のスタイル TOP", style.raw_value);
      return <></>;
    }
  });
}
