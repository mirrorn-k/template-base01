export const dynamic = "force-dynamic";
import KV from "@/components/kv/Index";
import Box from "@mui/material/Box";
import { getNotices } from "@/lib/api/notice/index";
import getPage from "@/lib/api/page/index";
import ContentsSelecter from "@/components/contents/Index";
import metaConvert from "@/lib/meta/converter";
import Script from "next/script";
import { getSite } from "@/lib/api/site/index";

// メタデータを設定
export async function generateMetadata() {
  const site = await getSite();
  const page = await getPage(site.uuid, `/`);
  return metaConvert(page.meta);
}

export default async function Home() {
  const [site] = await Promise.all([getSite()]);

  // ✅ Promiseを並列実行（効率アップ & Suspense可）
  const [page, notices] = await Promise.all([
    getPage(site.uuid, "/"),
    getNotices({ page: 1, limit: 1 }),
  ]);

  return (
    <>
      {page.structured_data && (
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.structured_data }}
        />
      )}
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
          kv={page.kv?.kv ?? undefined}
          logo={page.kv?.logo ?? undefined}
          catchcopy={page.kv?.catchcopy ?? ""}
        />
        <ContentsSelecter contents={page.contents ?? []} />
      </Box>
    </>
  );
}
