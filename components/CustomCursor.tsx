"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add("custom-cursor");

    let hover = false;
    let mx = -100;
    let my = -100;
    let lastX = mx;
    let lastY = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const next = !!t.closest("a, button");
      if (next !== hover) {
        hover = next;
        const size = hover ? 48 : 14;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
      }
    };

    const tick = () => {
      if (mx !== lastX || my !== lastY) {
        el.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        lastX = mx;
        lastY = my;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 bg-white transition-[width,height] duration-200 pointer-events-none will-change-transform"
      style={{
        width: 14,
        height: 14,
        mixBlendMode: "difference",
        zIndex: 70,
      }}
    />
  );
}
