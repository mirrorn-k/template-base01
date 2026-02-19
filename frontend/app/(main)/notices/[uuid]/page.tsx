export const dynamic = "force-dynamic";
import ResponsiveBox from "@/atoms/Box";
import { Typography } from "@mui/material";
import { Detail } from "@/components/list/List01";
import { getNotice } from "@/lib/api/notice/index";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string | string[] }>;
}) {
  const resolved = await params; // 👈 awaitが必須
  const slug = Array.isArray(resolved.slug)
    ? resolved.slug[0]
    : resolved.slug ?? "";

  // サーバサイドでAPIコール
  const [notice] = await Promise.all([getNotice({ uuid: slug })]);

  return notice;
}

export default async function Main({
  params,
}: {
  params: Promise<{ uuid?: string | string[] }>;
}) {
  // URLパラメータ（/notice/aaa/bbb → {uuid: ""}
  const resolved = await params; // 👈 awaitが必須
  const uuid = Array.isArray(resolved.uuid)
    ? resolved.uuid[0]
    : resolved.uuid ?? "";

  //console.log("uuid", resolved);

  if (!uuid) {
    return <NotFound />;
  }

  // サーバサイドでAPIコール
  const [notice] = await Promise.all([getNotice({ uuid: uuid })]);

  if (!notice) {
    return <NotFound />;
  }

  return (
    <ResponsiveBox
      maxWidth="md"
      sx={{
        m: "auto",
        alignItems: "center",
        justifyItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        mt: 4,
        mb: 4,
      }}
    >
      <Typography variant="h3" component={"h1"} sx={{ textAlign: "center" }}>
        {notice.title}
      </Typography>
      <Detail item={notice} />
    </ResponsiveBox>
  );
}

const NotFound = () => {
  return (
    <ResponsiveBox maxWidth="lg">
      <Typography variant="h3">お知らせが見つかりません</Typography>
    </ResponsiveBox>
  );
};
