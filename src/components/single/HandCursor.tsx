"use client";

import { useEffect, useRef } from "react";

// The two cartoon hands, cropped from the Sweezy "Mickey Mouse Hand Heart" cursor pack.
const HANDS = {
  heart: { src: "/images/cursor/hand-heart.gif", width: 44, hot: { x: 2, y: 6 } },
  point: { src: "/images/cursor/hand-point.gif", width: 40, hot: { x: 4, y: 3 } },
} as const;
const CLICKABLE = "a, button, [role='button'], summary, label[for], [data-preview-kind]";

/**
 * The pointer as a pair of white cartoon gloves: hands making a heart as they move about, a
 * pointing finger over anything clickable, a small squeeze on press. Mouse only; on touch the
 * system has no pointer to replace.
 */
export function HandCursor() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    for (const hand of Object.values(HANDS)) new Image().src = hand.src;
    document.documentElement.classList.add("has-hand");
    let hand: keyof typeof HANDS = "heart";
    let x = -200;
    let y = -200;
    let down = false;

    const place = () => {
      const h = HANDS[hand];
      img.style.transform = `translate3d(${x - h.hot.x}px, ${y - h.hot.y}px, 0) scale(${down ? 0.88 : 1})`;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const next = (e.target as Element).closest?.(CLICKABLE) ? "point" : "heart";
      if (next !== hand) {
        hand = next;
        img.src = HANDS[hand].src;
        img.style.width = `${HANDS[hand].width}px`;
      }
      img.style.opacity = "1";
      place();
    };
    const onDown = () => {
      down = true;
      place();
    };
    const onUp = () => {
      down = false;
      place();
    };
    const onLeave = () => (img.style.opacity = "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-hand");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className="hand-cursor"
      src={HANDS.heart.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ width: HANDS.heart.width }}
    />
  );
}
