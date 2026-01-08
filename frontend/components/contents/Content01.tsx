"use client";
import * as Image from "@/components/media/Index";
import { FlexColumnBox } from "@/atoms/Box";
import HtmlText from "@/atoms/Typography";
import ResponsiveBox from "@/atoms/Box";
import LinkButton from "@/atoms/LinkButton";
import { tContent01 } from "@/lib/api/page/type";
import { getResponsiveValue } from "@/lib/responsiveValue/index";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";
import { IMAGE_DEFAULT } from "@/const/Image";
import * as ContextCommon from "@/contexts/Common";

interface Content01Props {
  media: tContent01["media"];
  caption: tContent01["caption"];
  linkHref: tContent01["linkHref"];
  linkText: tContent01["linkText"];
}

export default function Content01(props: Content01Props) {
  const { screenSize } = ContextCommon.useContents();

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
      {props.media && (
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
              height: "auto",
            },
          }}
        />
      )}
      <ResponsiveBox maxWidth="sm" sx={{ mt: 2 }}>
        <HtmlText
          className="caption"
          text={props.caption}
          variant="body1"
          sx={{
            mt: 2,
          }}
        />
      </ResponsiveBox>
      {props.linkHref && (
        <LinkButton
          className="linkButton"
          linkHref={props.linkHref}
          linkText={props.linkText || "リンク"}
          variant="contained"
          color="primary"
        />
      )}
    </FlexColumnBox>
  );
}
