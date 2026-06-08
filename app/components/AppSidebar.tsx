"use client";

import { useCallback } from "react";

import type { SectionId } from "../lib/nav-items";

function LogoMark({ dotClassName }: { dotClassName: string }) {
  return (
    <span className="inline-grid shrink-0 grid-cols-2 gap-[2px]" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`size-[3px] rounded-[1px] sm:size-[3.5px] ${dotClassName}`}
        />
      ))}
    </span>
  );
}

/** Top bar: logo + contact CTA. */
export default function AppSidebar({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void;
}) {
  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onDark = true;

  const glassPillBtn =
    "inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 py-2 font-safiro text-[11px] font-medium tracking-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition hover:border-white/45 hover:bg-white/[0.14] md:px-6 md:py-2.5 md:text-xs";

  return (
    <header
      className={`pointer-events-auto fixed left-0 right-0 top-0 z-[70] bg-transparent transition-colors duration-300 ${onDark ? "text-white" : "text-black"}`}
      aria-label="Site"
    >
      <div className="mx-auto flex w-full max-w-[min(100%,88rem)] items-center justify-between gap-4 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:px-4 lg:px-6">
        <a
          href="#home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <LogoMark dotClassName={onDark ? "bg-white" : "bg-black"} />
          <span
            className={`font-safiro text-sm font-medium lowercase tracking-[0.02em] md:text-base ${onDark ? "text-white" : "text-black"}`}
          >
            ashcode
          </span>
        </a>

        <button type="button" onClick={scrollToContact} className={glassPillBtn}>
          Get in touch hooman
        </button>
      </div>
    </header>
  );
}
