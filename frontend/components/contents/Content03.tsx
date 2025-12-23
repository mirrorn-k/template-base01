"use client";

/**
 * 画像を横いっぱいに表示するコンポーネント
 * 縦幅600pxまでの中央表示で上下を切る
 *
 * 画像の上にタイトルとキャプション、リンクボタンを表示
 * スマホ表示では文字先、画像後
 *
 */

import { FlexBox, FlexColumnBox } from "@/atoms/Box";
import { Typography, Box } from "@mui/material";
import * as Image from "@/components/media/Index";
import { ArrowForwardlosLink } from "@/atoms/Link";
import HtmlText from "@/atoms/Typography";
import { Theme } from "@mui/material/styles";
import { tContent03 } from "@/lib/api/page/type";

export default function Main(props: {
  media: tContent03["media"];
  title: tContent03["title"];
  caption: tContent03["caption"];
  linkHref?: tContent03["linkHref"];
  linkText?: tContent03["linkText"];
}) {
  const height = 800;

  return (
    <FlexBox
      className={"Content03"}
      sx={{
        width: "100vw",
        maxHeight: { xs: "auto", md: `${height}px` },
        position: "relative",
        flexDirection: { xs: "column", lg: "row" },
      }}
    >
      <FlexColumnBox
        className="caption-box"
        bgcolor="primary.contrastText"
        color="primary.main"
        sx={(theme: Theme) => ({
          border: 1,
          borderColor: "primary.dark",
          width: "90%",
          margin: "auto",
          p: 8,
          gap: 2,
          overflow: "hidden",
          justifyContent: "flex-end",
          [theme.breakpoints.up("md")]: {
            // 画像の上に表示
            position: "absolute",
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            width: "400px",
            minHeight: "65%",
            /*maxHeight: `${height * 0.7}px`,*/
            maxHeight: "90%",
            lineHeight: 1.4,
          },
        })}
      >
        <Typography
          className="title"
          variant="h5"
          component="h4"
          gutterBottom
          sx={{ borderBottom: 1 }}
        >
          {props.title}
        </Typography>
        <HtmlText
          text={props.caption}
          className="caption hide-scrollbar"
          variant="body1"
          sx={(theme: Theme) => ({
            overflow: "scroll",
            [theme.breakpoints.up("md")]: {
              lineHeight: 2.5,
            },
          })}
        />
        {props.linkHref && (
          <ArrowForwardlosLink href={props.linkHref} label={props.linkText} />
        )}
      </FlexColumnBox>
      {props.media && (
        <Box
          className="media-box"
          sx={{
            display: "contents",
            width: "100vw",
            height: "auto",
            overflow: "hidden",
          }}
        >
          <Image.MediaImage
            media={props.media}
            objectFit="cover"
            imgProps={{ style: { width: "100%", height: "auto" } }}
          />
        </Box>
      )}
    </FlexBox>
  );
}
