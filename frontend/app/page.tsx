import { Metadata } from "next";
import KV from "@/components/kv/Index";
import Content01 from "@/components/contents/Content01";
import ResponsiveBox from "@/packages/core/atoms/Box";
import { IMAGE_DEFAULT } from "@/const/Image";
import Content02 from "@/components/contents/Content02";
import { Box } from "@mui/material";
import Contact01 from "@/components/contact/Contact01";
import Title from "@/atoms/Title";
import getNotices from "@/functions/api/notices";
import getKv from "@/functions/api/kv";
import * as tMapKv from "@/types/mapKv";
import * as tMapContent from "@/types/mapContent";
import getContents from "@/functions/api/contents";
import { tMedia } from "@/packages/core/media/type";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  return {};
}

// KVの取得
const kv: tMapKv.KvContent | undefined = await getKv();

// TOPページコンテンツ
const contents: tMapContent.Content[] | [] = await getContents({
  url: `${process.env.NEXT_PUBLIC_MAP_API_CONTENT_TOP}?${process.env.NEXT_PUBLIC_MAP_API_CONTENT_TOP_PARAMS}`,
  terms: {},
});

console.log("contents[0]", contents[0]);

// お知らせ最新一件のみを取得
const notices = await getNotices({ page: 1, limit: 1 });

export default function Home() {
  return (
    <>
      <KV notice={notices[0]} kv={kv} />
      <ResponsiveBox
        maxWidth="lg"
        sx={{
          m: "auto",
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {contents.map((content) => {
          const style = content.content_items.find(
            (ci) => ci.label === "スタイル"
          );
          if (!style) return <></>;
          const c = content.content_items.find(
            (ci) => ci.label === "コンテンツ"
          );
          if (!c) return <></>;

          if (style.raw_value === "Content01") {
            return (
              <Content01
                key={`top-content-${c.id}`}
                media={c.content?.イメージ１ as tMedia}
                caption={
                  content.content_items.find(
                    (ci) => ci.label === "キャプション"
                  )?.raw_value ?? ""
                }
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
                  caption={c.content?.キャプション as string}
                />
              </Box>
            );
          } else {
            console.log("未対応のスタイル TOP", style.raw_value);
            return <></>;
          }
        })}
        <Contact01 />
      </ResponsiveBox>
    </>
  );
}
