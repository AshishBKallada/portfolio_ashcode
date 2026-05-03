"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Start off-screen
    gsap.set(cursor, { x: -100, y: -100 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.8, ease: "sine.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.8, ease: "sine.out" });

    const handleMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[999]"
    >
      <div className="h-4 w-4 rounded-full border border-white/40 bg-white/90 shadow-sm ring-2 ring-black/30" />
    </div>
  );
}


