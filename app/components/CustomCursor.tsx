"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { x: -100, y: -100 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });

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
      className="pointer-events-none fixed top-0 left-0 z-[999]"
    >
      <div className="w-5 h-5 rounded-full border border-black bg-transparent flex items-center justify-center">
        <div className="w-[.5px] h-[.5px] rounded-full bg-black" />
      </div>
    </div>
  );
}


