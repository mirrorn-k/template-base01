"use client";

export const dynamic = "force-dynamic";
import SubpageKv from "@/components/kv/Subpage";
import ContentsSelecter from "@/components/contents/Index";
import { FlexColumnBox } from "@/atoms/Box";
import * as ContextMapInfo from "@/contexts/MapData";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Main({ slug }: { slug: string }) {
  const { getPageBySlug } = ContextMapInfo.Contents();

  const page = getPageBySlug(slug);

  if (!page) {
    return (
      <FlexColumnBox gapSize={8}>
        <Typography variant="h4" component="h2">
          お探しのページは見つかりませんでした。
        </Typography>
      </FlexColumnBox>
    );
  }

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
      <SubpageKv
        medias={page.kv.kv || undefined}
        title={page.name}
        subtitle={page.settings.subtitle}
        catchcopy={page.kv.catchcopy}
      />
      <ContentsSelecter contents={page.contents} />
    </Box>
  );
}
