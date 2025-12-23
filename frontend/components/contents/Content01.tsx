"use client";
import * as Image from "@/components/media/Index";
import { FlexColumnBox } from "@/atoms/Box";
import HtmlText from "@/atoms/Typography";
import ResponsiveBox from "@/atoms/Box";
import LinkButton from "@/atoms/LinkButton";
import { tContent01 } from "@/lib/api/page/type";

interface Content01Props {
  media: tContent01["media"];
  caption: tContent01["caption"];
  linkHref: tContent01["linkHref"];
  linkText: tContent01["linkText"];
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
      {props.media && <Image.MediaImage media={props.media} />}
      <ResponsiveBox maxWidth="sm" sx={{ mt: 2 }}>
        <HtmlText
          text={props.caption}
          variant="body1"
          sx={{
            mt: 2,
          }}
        />
      </ResponsiveBox>
      {props.linkHref && (
        <LinkButton
          linkHref={props.linkHref}
          linkText={props.linkHref || "リンク"}
          variant="contained"
          color="primary"
        />
      )}
    </FlexColumnBox>
  );
}
