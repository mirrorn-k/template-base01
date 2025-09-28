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
          src={replaceLocalhost(src)}
          alt={alt || "SVG"}
          {...rest}
          onError={() => setHasError(true)}
        />
      );
    }

    return (
      <Image
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
  if (url.includes("localhost:8102")) {
    return url.replace("localhost:8102", "backend");
  }
  return url;
}
