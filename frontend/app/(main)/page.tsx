export const dynamic = "force-dynamic";
import KV from "@/components/kv/Index";
import Box from "@mui/material/Box";
import { getNotices } from "@/lib/api/notice/index";
import getPage from "@/lib/api/page/index";
import ContentsSelecter from "@/components/contents/Index";
import getMeta from "@/lib/api/meta/index";

// メタデータを設定
export async function generateMetadata() {
  return await getMeta({ slug: "" });
}

export default async function Home() {
  // ✅ Promiseを並列実行（効率アップ & Suspense可）
  const [page, notices] = await Promise.all([
    getPage("/"),
    getNotices({ page: 1, limit: 1 }),
  ]);

  console.log("[page] ", page);

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
      <KV
        notice={notices[0]}
        kv={page.settings.kv}
        catchcopy={page.settings.catchcopy}
      />
      <ContentsSelecter contents={page.contents} />
    </Box>
  );
}
