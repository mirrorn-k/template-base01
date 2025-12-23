// BaseImage.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";

export interface BaseImageProps {
  imgProps: Partial<React.ComponentProps<typeof Image>> & {
    src: string;
    alt?: string;
  };
}

export const BaseImage: React.FC<BaseImageProps> = React.memo(
  ({ imgProps }) => {
    const [hasError, setHasError] = useState(false);
    const { src, alt, ...rest } = imgProps;

    if (!src) return null;
    const isSvg = typeof src === "string" && src.endsWith(".svg");

    // svg は <img> で fallback
    if (isSvg && !hasError) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="BaseImage BaseImage-svg"
          src={replaceLocalhost(src)}
          alt={alt || "SVG"}
          {...rest}
          onError={() => setHasError(true)}
        />
      );
    }

    return (
      <Image
        className="BaseImage"
        alt={alt || "Image"}
        unoptimized={false}
        {...rest}
        src={replaceLocalhost(src)}
        onError={() => setHasError(true)}
      />
    );
  }
);
BaseImage.displayName = "BaseImage";

function replaceLocalhost(url: string) {
  try {
    // すでに相対パスならそのまま返す
    if (url.startsWith("/")) {
      return url;
    }

    const u = new URL(url);

    // 本番 backend 判定
    if (u.hostname === "ma-plus-backend.ttnou.com") {
      return `/prod${u.pathname}`;
    }

    // ローカル backend 判定
    if (
      u.hostname === "backend" ||
      u.hostname === "localhost" ||
      u.hostname.startsWith("127.")
    ) {
      return `/local${u.pathname}`;
    }

    // それ以外は加工しない
    return url;
  } catch {
    // 想定外の文字列が来ても落とさない
    return url;
  }
}
