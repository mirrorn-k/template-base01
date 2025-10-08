import { Typography } from "@mui/material";
import ResponsiveBox from "@/packages/core/atoms/Box";
import * as Contents from "./Content";
import getMeta from "@/functions/api/meta";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return await getMeta({ slug: params.slug || "" });
}

export default async function Main() {
  return (
    <ResponsiveBox
      maxWidth="lg"
      sx={{
        justifyItems: "center",
        m: "auto",
        p: 0,
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography variant="h3" component="h1">
        お知らせ一覧
      </Typography>
      <Contents.List />
    </ResponsiveBox>
  );
}
