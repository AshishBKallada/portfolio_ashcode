"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Adapted from Componentry's image-trail: the trail follows the cursor only
// while it is over this element (which can sit behind other content, since
// it reads the window's pointer), the loop sleeps the rest of the time, and
// it stays off for touch screens and reduced motion. Decorative.

interface ImageTrailProps {
  images: string[];
  imageWidth?: number;
  imageHeight?: number;
  /** Cursor travel (px) between one image and the next. */
  threshold?: number;
  duration?: number;
  className?: string;
}

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

export function ImageTrail({
  images,
  imageWidth = 200,
  imageHeight = 200,
  threshold = 50,
  duration = 1.6,
  className,
}: ImageTrailProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const imgs = Array.from(content.querySelectorAll("img"));
    if (imgs.length === 0) return;

    const mouse = { x: 0, y: 0 };
    const cache = { x: 0, y: 0 };
    const last = { x: 0, y: 0 };
    let inside = false;
    let zIndex = 1;
    let next = 0;
    let raf = 0;

    const showNextImage = () => {
      const img = imgs[next];
      if (!img) return;
      const { height } = content.getBoundingClientRect();
      gsap.killTweensOf(img);
      gsap
        .timeline()
        .set(img, {
          opacity: 1,
          scale: 1,
          zIndex,
          x: cache.x - imageWidth / 2,
          y: cache.y - imageHeight / 2,
        })
        .to(img, {
          duration,
          ease: "expo.out",
          x: mouse.x - imageWidth / 2,
          y: mouse.y - imageHeight / 2,
        })
        .to(img, { duration: 1, ease: "power1.out", opacity: 0 }, Math.max(duration - 1, 0.4))
        .to(
          img,
          { duration: 1, ease: "quint.inOut", y: `+=${height + imageHeight / 2}` },
          Math.max(duration - 1, 0.4),
        );
      zIndex += 1;
      next = (next + 1) % imgs.length;
    };

    const render = () => {
      raf = 0;
      cache.x = lerp(cache.x, mouse.x, 0.1);
      cache.y = lerp(cache.y, mouse.y, 0.1);
      if (Math.hypot(mouse.x - last.x, mouse.y - last.y) > threshold) {
        showNextImage();
        last.x = mouse.x;
        last.y = mouse.y;
      }
      if (inside) raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const rect = content.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const wasInside = inside;
      inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
      if (inside && !wasInside) {
        // Start fresh where the cursor came in, not from a stale spot.
        cache.x = last.x = x;
        cache.y = last.y = y;
      }
      if (inside && !raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      gsap.killTweensOf(imgs);
    };
  }, [duration, imageHeight, imageWidth, threshold]);

  return (
    <div
      ref={contentRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {images.map((url) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ width: imageWidth, height: imageHeight }}
          className="absolute top-0 left-0 object-cover opacity-0 will-change-transform"
        />
      ))}
    </div>
  );
}
