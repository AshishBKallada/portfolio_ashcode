import type { ReactNode } from "react";
import { Parallax } from "@/components/motion/Parallax";
import { MaskRise } from "./MaskRise";
export { buttonCream, buttonOutline, buttonSolid } from "@/components/ui/buttonStyles";

/** Page gutter and max width shared by every section and the grid lines. */
export const frame = "mx-auto w-full max-w-[1480px] px-4 sm:px-8";

/** The four-column grid every section snaps to. */
export const cols = "grid grid-cols-1 md:grid-cols-4";

// Bracketed mono labels and square-dot markers.
export const monoLabel = "font-mono text-[12px] leading-none tracking-[0.02em]";
/** The one uppercase mono label: links, captions, meta. */
export const metaLabel = "font-mono text-[12px] leading-none tracking-[0.06em] uppercase";
/** The same voice for text that wraps: tool lists, short descriptions. */
export const metaText = "font-mono text-[12px] leading-[1.7] tracking-[0.06em] uppercase";
/** The sub-line under every section heading. */
export const lede = "mt-6 max-w-[34rem] text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.3] tracking-[-0.015em] text-pretty";

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

/** A section heading: huge hairline serif that rises in through a mask; an
 *  <em> inside turns to script. */
export function Display({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Parallax speed={-18}>
    <h2
      className={`font-serif text-[clamp(3.75rem,9.5vw,9rem)] leading-[0.9] tracking-[-0.035em] [&_em]:font-script [&_em]:text-[1.05em] [&_em]:leading-none [&_em]:text-script [&_em]:not-italic text-balance ${className}`}
    >
      <MaskRise>{children}</MaskRise>
    </h2>
    </Parallax>
  );
}
