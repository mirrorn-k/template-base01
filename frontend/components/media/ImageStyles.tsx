import { Box } from "@mui/material";
import { MediaImage } from "./Index";
import { tMedia } from "@/types/ttnouMap";
import * as ContextCommon from "@/contexts/Common";
import { useState, useEffect } from "react";
import { Fade } from "@mui/material";

export const CircleIcon = ({
  media,
  thubnailSize,
}: {
  media?: tMedia;
  thubnailSize: number;
}) => (
  <Box
    sx={{
      height: thubnailSize,
      width: thubnailSize,
      borderRadius: "50%",
      overflow: "hidden",
      border: "1px solid #000",
      margin: "0 auto",
      position: "relative", // ✅ fillを使うなら必須
    }}
  >
    <MediaImage
      media={media}
      fill
      objectFit="cover"
      imgProps={{
        height: thubnailSize,
        width: thubnailSize,
      }}
    />
  </Box>
);

export const MediaImageSwitcher = ({
  medias,
  ...rest
}: { medias: tMedia[] } & Omit<
  React.ComponentProps<typeof MediaImage>,
  "media"
>) => {
  const { selectView } = ContextCommon.useContents();
  const [visible, setVisible] = useState(selectView);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (selectView === visible) return;
    if (!medias[selectView]?.url) return;

    setFadeIn(false);
    const timer = setTimeout(() => {
      setVisible(selectView);
      setFadeIn(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectView, medias, visible]);

  const current = medias[visible];
  if (!current) return null;

  return (
    <Fade in={fadeIn} timeout={300} key={current.url}>
      <Box>
        <MediaImage media={current} {...rest} />
      </Box>
    </Fade>
  );
};
