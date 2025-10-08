import React from "react";
import { BaseImage } from "@/packages/core/atoms/Image";
import { tMedia } from "./type";
import Image from "next/image";
import { IMAGE_DEFAULT } from "@/const/Image";

type NextImageProps = React.ComponentProps<typeof Image>;
interface MediaImageProps {
  media?: tMedia;
  objectFit?: React.CSSProperties["objectFit"];
  fill?: boolean;
  imgProps?: Omit<NextImageProps, "src" | "alt">;
}

/**
 *
 * @param param0
 * @returns
 */
export const MediaImage: React.FC<MediaImageProps> = ({
  media = IMAGE_DEFAULT,
  imgProps,
  objectFit = "contain",
  fill = false,
}) => {
  if (!media?.url) return null;

  const finalImgProps: Omit<NextImageProps, "src" | "alt"> = {
    ...imgProps,
    ...(fill ? { fill: true, width: undefined, height: undefined } : {}),
    style: {
      objectFit,
      maxWidth: imgProps?.style?.maxWidth ?? "100%",
      maxHeight: imgProps?.style?.maxHeight ?? "100%",
      ...imgProps?.style,
    },
  };

  // fillじゃない場合のみ、width/height を media の値で補完
  if (!fill) {
    if (!finalImgProps.width && media.width) {
      finalImgProps.width = media.width;
    }
    if (!finalImgProps.height && media.height) {
      finalImgProps.height = media.height;
    }
  }

  return (
    <BaseImage
      imgProps={{
        src: media.url,
        alt: media.name || "alt",
        ...finalImgProps,
      }}
    />
  );
};
