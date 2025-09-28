import React from "react";
import { BaseImage } from "../atoms/Image";
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

  // fill 指定なら width/height を無効化して fill を有効化
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
