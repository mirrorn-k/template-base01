"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { tMedia } from "@/packages/core/media/type";
import * as ContextCommon from "@/packages/core/context/Common";
import Link from "next/link";
import { Box, Fade } from "@mui/material";
import { useResponsiveSize } from "@/packages/core/function/isDeviceSize";
//import { MailOutlineOutlined } from "@mui/icons-material";

const apiImageLoader = ({ src }: { src: string }) => {
  return `/api/image?file=${src}`;
};

export const Main = React.memo(
  ({
    imgProps,
    useApi = false,
  }: {
    imgProps?: React.ComponentProps<typeof Image>;
    useApi?: boolean;
  }) => {
    const [hasError] = useState(false);
    if (hasError) {
      useApi = false; // ✅ エラーが発生した場合はAPIを使用しない
    }

    if (!imgProps || !imgProps.src) {
      return null; // ✅ `imgProps` が未定義なら何も表示しない
    }

    const { src, alt, width, height, style, fill, objectFit, ...rest } =
      imgProps;

    if (
      !hasError &&
      useApi &&
      typeof src === "string" &&
      src.endsWith(".svg")
    ) {
      const filteredStyle = { ...style };
      delete filteredStyle.objectFit; // ✅ `objectFit` を削除

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apiImageLoader({ src })}
          alt={alt || "SVG Image"}
          width={width}
          height={height}
          style={filteredStyle} // ✅ `objectFit` を削除済みの style を適用
          {...rest}
          onError={() => {
            // エラー時の処理（例: デフォルト画像に置き換えるなど）
            //setHasError(true);
          }}
        />
      );
    }

    return (
      <Image
        loader={useApi ? apiImageLoader : undefined}
        src={src}
        alt={alt || "Image"}
        width={width}
        height={height}
        unoptimized={false}
        fill={fill ? true : undefined} // ✅ `fill` を適切な値に変換
        style={{
          ...style,
          objectFit: objectFit as React.CSSProperties["objectFit"],
        }} // ✅ `next/image` では `objectFit` を適用可能
        {...rest}
        onError={() => {
          // エラー時の処理（例: デフォルト画像に置き換えるなど）
          //setHasError(true);
        }}
      />
    );
  }
);
Main.displayName = "Main";

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  styles?: React.CSSProperties;
  useApi?: boolean;
}
export const Contain = ({
  src,
  alt,
  className = "",
  priority = false,
  styles = {},
  useApi = false,
}: CustomImageProps) => {
  return (
    <Main
      useApi={useApi}
      imgProps={{
        src: src,
        alt: alt,
        layout: "fill",
        objectFit: "contain",
        className: className,
        priority: priority,
        style: {
          ...styles,
        },
      }}
    />
  );
};

export const Logo = () => {
  return (
    <Link href="/" style={{ display: "flex", justifyItems: "center" }}>
      <Main
        useApi={false}
        imgProps={{
          src: "/logo.svg",
          alt: "addonem. logo",
          width: useResponsiveSize({ xs: 180, md: 250, lg: 300 }),
          height: 58,
        }}
      />
    </Link>
  );
};

interface MediaImageProps {
  media: tMedia | undefined;
  containerStyle?: React.CSSProperties;
  containerHeight?: number | string;
  containerWidth?: number | string;
  imgProps?: Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
  useApi?: boolean;
  objectFit?: React.CSSProperties["objectFit"];
  fill?: boolean;
}
export const MediaImage: React.FC<MediaImageProps> = ({
  media,
  imgProps,
  useApi = false,
  objectFit = "contain",
  containerStyle,
  containerHeight,
  containerWidth,
  fill = false,
}) => {
  if (!media || !media.url) {
    return null;
  }

  if (fill) {
    // widthとheeightを削除
    if (imgProps) {
      delete imgProps.width;
      delete imgProps.height;
      imgProps["fill"] = true;
    } else {
      imgProps = {
        fill: true,
      };
    }
  }

  const Img = (
    <Main
      useApi={media.useApi ?? useApi}
      imgProps={{
        ...imgProps,
        src: media.url,
        alt: media.name || "alt",
        style: {
          maxWidth: "100%",
          maxHeight: "100%",
          ...imgProps?.style,
        },
        objectFit: objectFit,
      }}
    />
  );

  return fill ? (
    <Box
      sx={{
        position: "relative",
        width: containerWidth || "100%",
        height: containerHeight || "auto",
        ...containerStyle,
      }}
    >
      {Img}
    </Box>
  ) : (
    Img
  );
};

interface MediaImageSwitcherProps extends Omit<MediaImageProps, "media"> {
  medias: tMedia[];
}

/**
 * selectViewによる切り替え対応Imageコンポーネント
 * @param param0
 * @returns
 */
export const MediaImageSwitcher: React.FC<MediaImageSwitcherProps> = ({
  medias,
  ...rest
}) => {
  const { selectView } = ContextCommon.useContents();
  const [visibleIndex, setVisibleIndex] = useState(selectView);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (selectView === visibleIndex) return;
    if (!medias[selectView] || !medias[selectView]["url"]) return; // 切り替え先がなければスキップ

    setFadeIn(false);
    const timeout = setTimeout(() => {
      setVisibleIndex(selectView);
      setFadeIn(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [selectView, medias, visibleIndex]);

  const currentMedia = medias[visibleIndex];
  if (!currentMedia) return null;

  return (
    <Fade in={fadeIn} timeout={300} key={currentMedia.url}>
      <Box>
        <MediaImage media={currentMedia} {...rest} />
      </Box>
    </Fade>
  );
};

/**
 * アイコン用
 * @param param0
 * @returns
 */
export const CurcleIcon = ({
  media,
  useApi = false,
  thubnailSize,
}: MediaImageProps & { thubnailSize: number }) => {
  return (
    <MediaImage
      containerStyle={{
        height: thubnailSize,
        width: thubnailSize,
        overflow: "hidden",
        borderRadius: "50%",
        border: "1px solid #000",
        margin: "0 auto",
      }}
      fill={true}
      useApi={useApi}
      media={media}
      imgProps={{
        height: thubnailSize,
        width: thubnailSize,
        objectFit: "cover",
      }}
    />
  );
};
