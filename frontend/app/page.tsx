export const dynamic = "force-dynamic";
import KV from "@/components/kv/Index";
import ResponsiveBox from "@/packages/core/atoms/Box";
import Contact01 from "@/components/contact/Contact01";
import getNotices from "@/functions/api/notices";
import getKv from "@/functions/api/kv";
import getContents from "@/functions/api/contents";
import ContentsSelecter from "@/packages/component/contents/Index";
import getMeta from "@/packages/core/meta/api";

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
        <ContentsSelecter contents={contents} />
        <Contact01 />
      </ResponsiveBox>
    </>
  );
}
