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
        <Content01
          media={IMAGE_DEFAULT}
          caption="ここに説明文"
          linkHref="/"
          linkText="リンク"
        />

        <Box>
          <Title
            text={["見出しタイトル"]} // 配列で渡すと改行される
            component={"h2"}
          />
          <Content02
            media={IMAGE_DEFAULT}
            title={"Title"}
            caption={
              "ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文ここに説明文"
            }
          />
        </Box>

        <Contact01 />
      </ResponsiveBox>
    </>
  );
}
