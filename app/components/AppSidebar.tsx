"use client";

import { useCallback } from "react";

export const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Footer", id: "footer" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];

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

/** Top bar: transparent; type color follows color scheme. */
export default function AppSidebar({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void;
}) {
  const handleNavigate = useCallback(
    (id: SectionId) => {
      onNavigate(id);
    },
    [onNavigate],
  );

  const onDark = true;

  return (
    <header
      className={`pointer-events-auto fixed left-0 right-0 top-0 z-[70] bg-transparent transition-colors duration-300 ${onDark ? "text-white" : "text-black"}`}
      aria-label="Site"
    >
      <div className="mx-auto grid w-full max-w-[min(100%,88rem)] grid-cols-[1fr_auto] grid-rows-[auto_auto_auto] gap-x-4 gap-y-4 px-0 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:grid-rows-1 md:gap-x-8 md:gap-y-0 lg:gap-x-12">
        <a
          href="#home"
          className="col-start-1 row-start-1 flex shrink-0 items-center gap-2.5 md:col-start-1 md:row-start-1"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("home");
          }}
        >
          <LogoMark dotClassName={onDark ? "bg-white" : "bg-black"} />
          <span
            className={`font-safiro text-sm font-medium lowercase tracking-[0.02em] md:text-base ${onDark ? "text-white" : "text-black"}`}
          >
            ashcode
          </span>
        </a>

        <div
          className="col-start-2 row-start-1 justify-self-end md:col-start-4 md:row-start-1 md:justify-self-end"
          aria-hidden
        >
          <div className="h-9 w-[10.5rem] md:h-10 md:w-[12rem]" />
        </div>

        <p
          className={`col-span-2 row-start-2 max-w-[17rem] text-[10px] font-normal leading-[1.55] md:col-span-1 md:col-start-2 md:row-start-1 md:max-w-[15rem] md:justify-self-start lg:max-w-[17rem] lg:text-[11px] ${onDark ? "text-white/75" : "text-black/75"}`}
        >
          Pushing on a clearly marked &quot;Pull&quot; door with full confidence while others
          watch.
        </p>

        <div
          className={`col-span-2 row-start-3 flex flex-col gap-1.5 text-left text-[10px] leading-snug md:col-span-1 md:col-start-3 md:row-start-1 md:text-[11px] ${onDark ? "text-white/70" : "text-black/70"}`}
        >
          <a
            href="mailto:ashercode4u@gmail.com"
            className={`font-safiro font-normal tracking-tight hover:opacity-70 ${onDark ? "text-white" : "text-black"}`}
          >
            ashercode4u@gmail.com
          </a>
          <span className={`font-safiro ${onDark ? "text-white/50" : "text-black/50"}`}>
            MERN stack · Build in public
          </span>
        </div>
      </div>
    </header>
  );
}
