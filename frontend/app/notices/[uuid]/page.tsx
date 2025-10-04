import { Metadata } from "next";
import ResponsiveBox from "@/packages/core/atoms/Box";
import { Typography } from "@mui/material";
import { Detail } from "@/packages/core/list/List01";

import getNotice from "@/functions/api/notice";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  return {};
}
export default async function Main({ params }: { params: { uuid?: string } }) {
  // URLパラメータ（/notice/aaa/bbb → ["aaa","bbb"]）
  const uuid = params.uuid ?? "unknown";

  // サーバサイドでAPIコール
  const notice = await getNotice({ uuid: uuid });

  if (!notice) {
    return (
      <ResponsiveBox maxWidth="lg">
        <Typography variant="h3">お知らせが見つかりません</Typography>
      </ResponsiveBox>
    );
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
