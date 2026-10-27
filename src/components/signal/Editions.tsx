import Link from "next/link";
import type { ReactNode } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import { HERO_BG } from "@/lib/hero";
import { frame } from "./primitives";
import { DissolvePainting } from "./DissolvePainting";
import { TornEdge } from "./TornEdge";

/*
 * Editions building blocks, after the reference's section anatomy:
 *   Chapter — a dark intro over the painting: a huge bold title and a
 *             drop-cap lede, then a cream panel torn across its top edge;
 *   DropCap — narrative serif with a swash script capital;
 *   Card    — 16:9 media, a small bold title, serif body, bordered button.
 */

/** Narrative serif opening on a swash script capital. */
/** Text clears the nav rail on desktop; backgrounds still run full width under it. */
const railInset = "md:pl-[calc(var(--nav-sidebar-w)+1.5rem)]";

export function DropCap({ children, className = "" }: { children: string; className?: string }) {
  const [first, rest] = [children.slice(0, 1), children.slice(1)];
  return (
    <span className={`font-narrative tracking-[-0.04em] ${className}`}>
      <span aria-hidden className="mr-[-0.04em] font-flourish text-[1.45em] leading-[0.5] tracking-normal">
        {first}
      </span>
      <span aria-hidden>{rest}</span>
      <span className="sr-only">{children}</span>
    </span>
  );
}

export function Chapter({
  id,
  label,
  title,
  lede,
  heading,
  children,
  seed,
  intro = true,
  besideRail = intro,
  backdrop,
}: {
  /**
   * The panel starts at the rail's edge with a straight top, leaving the rail's
   * column on what's behind it (the painting, or the pinned hero for About).
   * Otherwise it runs full width, torn across the top. Defaults to `intro`.
   */
  besideRail?: boolean;
  /** Set into the pinned painting layer, so the panel scrolls over it too. */
  backdrop?: ReactNode;
  /** False when the intro is staged elsewhere (About's runs inside the hero). */
  intro?: boolean;
  id: string;
  label: string;
  title: string;
  lede: string;
  /** The drop-cap heading that opens the cream panel, if any. */
  heading?: string;
  children: ReactNode;
  seed: number;
}) {
  return (
    // With an intro, the section tucks a screen up under the one before (z-0 under its z-[1]), so its
    // painting is already pinned behind that panel and is uncovered as the panel scrolls away.
    <section
      id={id}
      aria-label={label}
      className={`signal-rail-bleed relative isolate ${intro ? "z-0 -mt-[100svh]" : "z-[1]"}`}
    >
      {intro ? (
        <>
          {/* The painting, pinned for the whole chapter; the cream panel below rises over it.
              Once the shader is drawing, the plain painting and night under it step aside: the
              canvas is clear where it hasn't eroded in yet, and what's behind shows through. */}
          <div
            aria-hidden
            className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden bg-night has-[canvas[data-ready=true]]:bg-transparent [&:has(canvas[data-ready=true])>.paint-fallback]:invisible"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_BG.src}
              alt=""
              width={HERO_BG.width}
              height={HERO_BG.height}
              loading="lazy"
              className="paint-fallback absolute inset-0 h-full w-full object-cover opacity-70 select-none"
            />
            <div className="paint-fallback absolute inset-0 bg-[linear-gradient(180deg,rgba(21,19,15,0.55)_0%,rgba(21,19,15,0.35)_45%,rgba(21,19,15,0.7)_100%)]" />
            {/* Erodes in from the bottom, behind the panel above as it lifts. */}
            <DissolvePainting src={HERO_BG.src} track={`${id}-intro`} className="absolute inset-0 h-full w-full" />
            {backdrop}
          </div>
          {/* The screen spent under the panel before. Unmarked, so that panel keeps the nav's tone. */}
          <div aria-hidden className="h-[100svh]" />
          {/* Intro over the painting, entering from the bottom once the panel above has lifted. */}
          <div id={`${id}-intro`} data-nav-theme="dark" className="relative text-cream">
            <div className={`${frame} ${railInset} relative flex min-h-[100svh] flex-col justify-end pb-[clamp(2.5rem,6vh,4rem)]`}>
              <RevealItem>
                <h2 className="py-10 font-headline text-[clamp(4.5rem,13vw,13rem)] leading-[0.88] tracking-[-0.045em] [text-shadow:0_6px_60px_rgba(0,0,0,0.35)] md:py-8">
                  {title}
                </h2>
              </RevealItem>
              <RevealItem delay={0.1}>
                <p className="max-w-[44rem] text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.02] text-pretty [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
                  <DropCap>{lede}</DropCap>
                </p>
              </RevealItem>
            </div>
          </div>
        </>
      ) : null}

      {/* Cream panel. Beside the rail it starts at the rail's edge with a straight top and scrolls
          over what's pinned behind, which stays showing in the rail's column, so the rail keeps
          its tone over that (dark) rather than the panel. Otherwise it's torn across the top. */}
      <div
        data-nav-theme={besideRail ? "dark" : "light"}
        // Beside the rail, at least a screen tall: the next chapter tucks a screen up under it.
        className={`relative bg-background text-ink ${besideRail ? "min-h-[100svh] md:ml-[var(--nav-sidebar-w)]" : ""}`}
      >
        {besideRail ? null : <TornEdge seed={seed} />}
        <div className={`${frame} ${besideRail ? "md:px-10" : railInset} relative ${heading ? "pt-[clamp(3.5rem,8vh,5.5rem)]" : "pt-[clamp(1.5rem,4vh,2.5rem)]"} pb-[clamp(4rem,10vh,7.5rem)]`}>
          {heading ? (
            <h3 className="max-w-[60rem] py-6 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] text-balance md:py-10">
              <DropCap>{heading}</DropCap>
            </h3>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Two- then three-up grid of cards. */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

type CardAction = { label: string; href: string; external?: boolean };

export function Card({
  title,
  body,
  media,
  actions = [],
  meta,
  delay = 0,
  children,
}: {
  title: string;
  body?: string;
  media?: { src: string; alt: string };
  actions?: CardAction[];
  meta?: string;
  delay?: number;
  children?: ReactNode;
}) {
  return (
    <RevealItem delay={delay}>
      <article className="flex h-full flex-col">
        {media ? (
          <div className="relative mb-5 aspect-video overflow-hidden rounded-[3px] bg-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.src}
              alt={media.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <h4 className="mb-3 flex items-baseline justify-between gap-3 font-headline text-[18px] leading-[0.95] tracking-[-0.02em]">
          {title}
          {meta ? <span className="font-narrative text-[15px] tracking-normal text-ink/50 tabular-nums">{meta}</span> : null}
        </h4>
        {body ? (
          <p className="mb-4 max-w-[34rem] font-narrative text-[clamp(1.15rem,1.4vw,1.35rem)] leading-[1.08] tracking-[-0.03em] text-pretty text-ink/85">
            {body}
          </p>
        ) : null}
        {children}
        {actions.length ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {actions.map((action) => (
              <EditionButton key={action.href} {...action} />
            ))}
          </div>
        ) : null}
      </article>
    </RevealItem>
  );
}

/** The reference's small bordered button. */
export function EditionButton({ label, href, external }: CardAction) {
  const className =
    "inline-flex min-h-8 items-center gap-1.5 rounded-[3px] border border-ink/20 bg-white/60 px-3 font-headline text-[13px] tracking-[-0.01em] text-ink transition-colors hover:border-ink/40 hover:bg-white focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      <span aria-hidden>↗</span>
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}
