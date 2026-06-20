"use client";

import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function SocialsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-ink/15 sm:divide-x divide-y sm:divide-y-0 divide-ink/15">
      {SOCIAL_LINKS.map(({ label, handle, href }, i) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between gap-4 px-4 md:px-6 py-5 md:py-7 overflow-hidden"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
          <span className="relative flex flex-col gap-1">
            <span className="flex items-baseline gap-2 md:gap-3">
              <span className="font-body text-[9px] uppercase tracking-[0.28em] text-ink/50 group-hover:text-paper/60 transition-colors duration-500">
                0{i + 1}
              </span>
              <span className="font-headline italic text-lg md:text-2xl text-ink group-hover:text-paper transition-colors duration-500">
                {label}
              </span>
            </span>
            <span className="font-body text-[9px] uppercase tracking-[0.28em] text-ink/40 group-hover:text-paper/50 transition-colors duration-500 truncate">
              {handle}
            </span>
          </span>
          <ArrowUpRight
            className="relative shrink-0 w-4 h-4 md:w-5 md:h-5 text-ink/60 group-hover:text-paper transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            strokeWidth={1.2}
          />
        </a>
      ))}
    </div>
  );
}
