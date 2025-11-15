"use client";

/**
 * タイトルをリンク付きで表示するコンポーネント
 * 主にメニューのリストコンポーネント
 *　画像のMAXは横幅800px、縦幅600px
 *
 */

import { FlexBox, FlexColumnBox } from "@/atoms/Box";
import { Typography, Box } from "@mui/material";
import * as Image from "@/components/media/Index";
import { tMedia } from "@/types/ttnouMap";
import LinkButton from "@/atoms/LinkButton";
import HtmlText from "@/atoms/Typography";

export default function Main(props: {
  media: tMedia;
  title: string;
  caption: string;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <FlexBox
      className={"Content02"}
      maxWidth={"lg"}
      color={"primary.contrastText"}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: { xs: "column", lg: "row" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)", // ← 画面中央から左右に広げる
          width: "100vw",
          height: "100%",
          bgcolor: "primary.main",
          zIndex: -1,
        },
      }}
    >
      <FlexColumnBox
        sx={{
          flex: 1,
          bgcolor: "primary.main",
          width: "100%",
          maxWidth: { xs: "600px", lg: "50%" },
          p: 8,
          gap: 4,
        }}
      >
        <Typography variant="h3" component="h4" gutterBottom>
          {props.title}
        </Typography>
        <HtmlText text={props.caption} variant="body1" />
        <LinkButton
          linkHref={props.linkHref}
          linkText={props.linkText}
          sx={{
            backgroundColor: "primary.contrastText",
            color: "primary.main",
            mt: 2,
            maxWidth: "none",
            minWidth: "none",
            width: "90%",
            borderRadius: 20,
          }}
        />
      </FlexColumnBox>
      <Box
        sx={{
          flex: "1 1 50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: { xs: "100%", lg: "50%" },
          boxSizing: "border-box",
        }}
      >
        <Image.MediaImage
          media={props.media}
          imgProps={{
            style: {
              flex: "0 0 auto",
              width: "100%",
              height: "auto",
              maxWidth: "600px",
              maxHeight: "600px",
            },
          }}
        />
      </Box>
    </FlexBox>
  );
}
