"use client";
import { Box, Typography } from "@mui/material";
import * as Image from "@/packages/component/media/Index";
import { tMedia } from "@/packages/component/media/type";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import { getResponsiveValue } from "@/packages/core/function/responsiveValue/index";
import { IMAGE_SUBPAGE_KV } from "@/const/Image";
import * as ContextCommon from "@/packages/core/context/Common";

interface Props {
  medias: Responsive<tMedia> | undefined;
  title: string;
  subtitle?: string;
}

export default function Main(props: Props) {
  const { screenSize } = ContextCommon.useContents();

  // mediasがあり、screenSizeに対応する画像があればそれを使い、なければデフォルト画像を使う
  const media = props.medias
    ? getResponsiveValue(props.medias, screenSize) || IMAGE_SUBPAGE_KV
    : IMAGE_SUBPAGE_KV;

  return (
    <Box
      id="kv"
      sx={{
        position: "relative",
        maxWidth: "100%",
        maxHeight: { xs: 300, sm: 400, md: 500, lg: 600 },
        width: "100%",
        height: "auto",
        aspectRatio: `${media.width} / ${media.height}`,
      }}
    >
      <Image.MediaImage media={media} fill={true} objectFit="contain" />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 200,
          width: "100%",
          height: "100%",
          display: "flex",
          gap: 1,
          flexDirection: "column",
          justifyContent: "center",
          letterSpacing: "5px",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          className={"font-text"}
          sx={{
            textAlign: "center",
            p: { xs: 2, sm: 8, md: 15, lg: 20 },
            width: "100%",
          }}
        >
          {props.title}
        </Typography>
        {props.subtitle && (
          <Typography
            variant="h4"
            component="h2"
            className={"font-text"}
            sx={{
              textAlign: "center",
              width: "100%",
            }}
          >
            {props.subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
