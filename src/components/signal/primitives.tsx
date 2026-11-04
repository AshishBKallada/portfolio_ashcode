import type { ReactNode } from "react";
import { Parallax } from "@/components/motion/Parallax";

/** Page gutter and max width shared by every section and the grid lines. */
export const frame = "mx-auto w-full max-w-[1480px] px-5 sm:px-10";

// Small labels, in the home page's headline face so every page shares one voice.
export const monoLabel = "font-headline text-[13px] leading-none tracking-[-0.01em]";
/** The one uppercase label: captions and meta, as the footer and Contact use. */
export const metaLabel = "font-headline text-[12px] leading-none tracking-[0.12em] uppercase";

/** "[ 01 ] Approach" — the section marker in the first column. */
export function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <Parallax speed={36}>
    <p className={`${monoLabel} px-3 py-1`}>
      {index ? (
        <>
          [ <span className="tabular-nums">{index}</span> ]{" "}
        </>
      ) : null}
      {children}
    </p>
    </Parallax>
  );
}

/** The small square bullet used before labels and inside buttons. */
export function Dot({ className = "bg-flame" }: { className?: string }) {
  return <span aria-hidden className={`inline-block size-[6px] shrink-0 ${className}`} />;
}
