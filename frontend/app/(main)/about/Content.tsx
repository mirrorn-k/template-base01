"use client";

export const dynamic = "force-dynamic";
import SubpageKv from "@/components/kv/Subpage";
import ContentsSelecter from "@/components/contents/Index";
import Table01 from "@/components/table/Table01";
import ResponsiveBox, { FlexColumnBox } from "@/atoms/Box";
import { tAbout } from "@/lib/api/about/type";
import * as ContextMapInfo from "@/contexts/MapData";
import { Typography } from "@mui/material";

export default function Main({ aboutList }: { aboutList: tAbout[] }) {
  const { getPageBySlug } = ContextMapInfo.Contents();

  const page = getPageBySlug("about");

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
    <FlexColumnBox gapSize={8}>
      <SubpageKv
        medias={page.kv.kv || undefined}
        title={page.name}
        subtitle={page.settings.subtitle}
        catchcopy={page.kv.catchcopy}
      />
      <ResponsiveBox maxWidth="md" sx={{ m: "auto", p: 2 }}>
        <Table01 items={aboutList} />
      </ResponsiveBox>
      <ContentsSelecter contents={page.contents} />
    </FlexColumnBox>
  );
}
