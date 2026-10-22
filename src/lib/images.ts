import { getImageProps } from "next/image";

/**
 * The optimized (AVIF/WebP) URL for an image used outside <Image>: a canvas,
 * a motion.img or a loader preload. Every consumer of one source gets the
 * same URL, so the browser fetches and caches it once.
 */
export function optimizedSrc(
  { src, width, height }: { src: string; width: number; height: number },
  quality?: number,
) {
  return getImageProps({ src, width, height, quality, alt: "" }).props.src;
}
