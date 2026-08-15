"use client";

import { useEffect } from "react";

type FastImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

export function FastImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
}: FastImageProps) {
  useEffect(() => {
    const image = new window.Image();
    image.src = src;
    if (typeof image.decode === "function") {
      image.decode().catch(() => undefined);
    }
  }, [src]);

  return (
    <>
      {priority ? <link rel="preload" as="image" href={src} /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </>
  );
}
