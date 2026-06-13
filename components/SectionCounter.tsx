"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "home", label: "Hero" },
  { id: "statement", label: "Statement" },
  { id: "projects", label: "Selected Work" },
  { id: "contact", label: "Connect" },
];

export default function SectionCounter() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = SECTIONS.findIndex((s) => s.id === entry.target.id);
          }
        });
        if (bestIdx >= 0) setActive(bestIdx);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Show only on middle sections — Hero has its own bottom-row chrome,
  // Contact has the back-to-top button in the same corner.
  const visible = active === 1 || active === 2;

  return (
    <div
      aria-hidden
      className="hidden md:block fixed top-20 right-6 md:right-12 z-40 pointer-events-none text-right transition-opacity duration-500"
      style={{
        mixBlendMode: "difference",
        color: "#ffffff",
        opacity: visible ? 1 : 0,
      }}
    >
      <p className="font-body text-[10px] uppercase tracking-[0.35em] tabular-nums opacity-70">
        ({String(active + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")})
      </p>
      <p className="font-headline italic text-xl mt-1">{SECTIONS[active].label}</p>
    </div>
  );
}
