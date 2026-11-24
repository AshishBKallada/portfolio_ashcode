import type { ReactNode } from "react";

/**
 * An endless vertical run (horizontal on phones): the items are set twice and the track slides
 * by exactly one set, so the loop has no seam. Hover or focus inside pauses it; reduced motion
 * stops it and lets the column scroll by hand instead.
 */
export function Marquee({
  children,
  direction = "up",
  seconds = 40,
  label,
}: {
  children: ReactNode;
  direction?: "up" | "down";
  seconds?: number;
  label: string;
}) {
  return (
    <div className="sg-marquee" data-direction={direction} style={{ "--sg-speed": `${seconds}s` } as React.CSSProperties}>
      <div className="sg-marquee__track">
        <ul className="sg-marquee__set" aria-label={label}>
          {children}
        </ul>
        <ul className="sg-marquee__set" aria-hidden="true" inert>
          {children}
        </ul>
      </div>
    </div>
  );
}
