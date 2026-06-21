"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Project } from "@/lib/constants/projects";

type Props = {
  projects: readonly Project[];
  activeIdx: number | null;
};

// Floating thumbnail that tracks the cursor while a project row is hovered.
// Each project's thumb is a sibling div that reveals via clip-path so we
// never re-render the image during pointer moves.
export default function CursorPreview({ projects, activeIdx }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.65, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.65, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 150);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none hidden md:block fixed top-0 left-0 z-50 w-[320px] h-[420px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] transition-opacity duration-300 ${
        activeIdx === null ? "opacity-0" : "opacity-100"
      }`}
      style={{ transform: "translate3d(-9999px, 0, 0)" }}
    >
      {projects.map((p, i) => (
        <div
          key={p.number}
          className="absolute inset-0 transition-[clip-path] duration-[620ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            backgroundColor: p.bgColor,
            clipPath:
              activeIdx === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          }}
        >
          <Image src={p.image} alt="" fill sizes="320px" className="object-cover" />
          <span className="absolute left-4 bottom-3 right-4 flex items-center justify-between font-body text-[9px] uppercase tracking-[0.28em] text-white/85">
            <span>{p.tag}</span>
            <span className="tabular-nums">{p.year}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
