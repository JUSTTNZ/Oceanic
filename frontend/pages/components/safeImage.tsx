"use client";

import { useState, CSSProperties } from "react";
import Image, { ImageProps } from "next/image";

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  ...rest
}: ImageProps) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={className}
        style={style as CSSProperties}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setUseFallback(true)}
      unoptimized
      {...rest}
    />
  );
}
