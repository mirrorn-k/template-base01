"use client";
import * as Image from "@/components/media/Index";
import { tMedia } from "@/types/ttnouMap";
import { FlexColumnBox } from "@/atoms/Box";
import HtmlText from "@/atoms/Typography";
import ResponsiveBox from "@/atoms/Box";
import LinkButton from "@/atoms/LinkButton";

interface Content01Props {
  media?: tMedia;
  caption: string;
  linkHref?: string;
  linkText?: string;
}

export default function Content01(props: Content01Props) {
  return (
    <FlexColumnBox
      className={"Content01"}
      maxWidth={"lg"}
      sx={{
        alignItems: "center",
        p: 8,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)", // ← 画面中央から左右に広げる
          width: "100vw",
          height: "100%",
          bgcolor: "primary.light",
          zIndex: -1,
        },
      }}
    >
      <Image.MediaImage media={props.media} />
      <ResponsiveBox maxWidth="sm" sx={{ mt: 2 }}>
        <HtmlText
          text={props.caption}
          variant="body1"
          sx={{
            mt: 2,
          }}
        />
      </ResponsiveBox>
      <LinkButton
        linkHref={props.linkHref}
        linkText={props.linkText}
        variant="contained"
        color="primary"
      />
    </FlexColumnBox>
  );
}
