"use client";
import { Box, Typography } from "@mui/material";
import * as Image from "@/packages/core/media/Index";
import { tMedia } from "@/packages/core/media/type";

interface Props {
  media: tMedia;
  title: string;
  subtitle?: string;
}

export default function Main(props: Props) {
  //const { screenSize } = ContextCommon.useContents();

  return (
    <Box
      id="kv"
      sx={{
        position: "relative",
        maxWidth: "100%",
        maxHeight: "100%",
        width: "100%",
        height: "auto",
        aspectRatio: `${props.media.width} / ${props.media.height}`,
      }}
    >
      <Image.MediaImage media={props.media} fill={true} objectFit="contain" />
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
