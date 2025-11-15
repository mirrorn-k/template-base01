export const dynamic = "force-dynamic";
import KV from "@/components/kv/Index";
import Box from "@mui/material/Box";
import Contact01 from "@/components/contact/Contact01";
import { getNotices } from "@/lib/api/notice/index";
import getKv from "@/lib/api/kv";
import getContents from "@/lib/api/contents";
import ContentsSelecter from "@/components/contents/Index";
import getMeta from "@/lib/api/meta/index";

// メタデータを設定
export async function generateMetadata() {
  return await getMeta({ slug: "" });
}

export default async function Home() {
  // ✅ Promiseを並列実行（効率アップ & Suspense可）
  const [kv, contents, notices] = await Promise.all([
    getKv(),
    getContents({
      url: `${process.env.NEXT_PUBLIC_MAP_API_CONTENT_TOP}?${process.env.NEXT_PUBLIC_MAP_API_CONTENT_TOP_PARAMS}`,
      terms: {},
    }),
    getNotices({ page: 1, limit: 1 }),
  ]);
  return (
    <Box
      sx={{
        m: "auto",
        p: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <KV notice={notices[0]} kv={kv} />
      <ContentsSelecter contents={contents} />
      <Contact01 />
    </Box>
  );
}
