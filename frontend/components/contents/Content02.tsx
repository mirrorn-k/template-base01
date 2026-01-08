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
import LinkButton from "@/atoms/LinkButton";
import HtmlText from "@/atoms/Typography";
import { tContent02 } from "@/lib/api/page/type";
import { getResponsiveValue } from "@/lib/responsiveValue/index";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";
import { IMAGE_DEFAULT } from "@/const/Image";
import * as ContextCommon from "@/contexts/Common";

export default function Main(props: {
  media: tContent02["media"];
  title: tContent02["title"];
  caption: tContent02["caption"];
  linkHref?: tContent02["linkHref"];
  linkText?: tContent02["linkText"];
}) {
  const { screenSize } = ContextCommon.useContents();

  return (
    <FlexBox
      className={"Content02"}
      maxWidth={"lg"}
      color={"primary.contrastText"}
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flexDirection: { xs: "column", md: "row" },
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
          gap: 4,
        }}
      >
        <Box sx={{ p: 8 }}>
          <Typography
            className="title"
            variant="h3"
            component="h4"
            gutterBottom
          >
            {props.title}
          </Typography>
          <HtmlText className="caption" text={props.caption} variant="body1" />
          {props.linkHref && (
            <LinkButton
              className="linkButton"
              linkHref={props.linkHref}
              linkText={props.linkText || "リンク"}
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
          )}
        </Box>
      </FlexColumnBox>
      {props.media && (
        <Box
          className="mediaBox"
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Image.MediaImage
            media={getResponsiveValue<tMedia>(
              props.media as Responsive<tMedia>,
              screenSize,
              "xs",
              "xl",
              "down",
              true,
              true,
              IMAGE_DEFAULT
            )}
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
      )}
    </FlexBox>
  );
}
