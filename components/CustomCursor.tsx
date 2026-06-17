"use client";

import { useEffect, useRef } from "react";

type Mode = "default" | "hover" | "cta" | "view";

const SIZE: Record<Mode, number> = {
  default: 14,
  hover: 44,
  cta: 56,
  view: 72,
};

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;

    document.documentElement.classList.add("custom-cursor");

    let mode: Mode = "default";
    let mx = -100;
    let my = -100;
    let lastX = mx;
    let lastY = my;
    let raf = 0;

    const setMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      const size = SIZE[mode];
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      label.textContent = mode === "view" ? "VIEW" : mode === "cta" ? "↗" : "";
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const cursored = t.closest("[data-cursor]") as HTMLElement | null;
      if (cursored) {
        const m = cursored.dataset.cursor as Mode | undefined;
        setMode(m ?? "hover");
        return;
      }
      setMode(t.closest("a, button") ? "hover" : "default");
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
      className="fixed top-0 left-0 flex items-center justify-center rounded-full bg-white transition-[width,height] duration-200 pointer-events-none will-change-transform"
      style={{
        width: 14,
        height: 14,
        mixBlendMode: "difference",
        zIndex: 70,
      }}
    >
      <span
        ref={labelRef}
        className="font-body text-[10px] uppercase tracking-[0.18em] text-black"
        style={{ mixBlendMode: "difference" }}
      />
    </div>
  );
}
