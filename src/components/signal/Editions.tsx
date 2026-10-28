import Link from "next/link";
import type { ReactNode } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import { HERO_BG } from "@/lib/hero";
import { DissolvePainting } from "./DissolvePainting";
import { frame } from "./primitives";
import { ScrollZoom } from "./ScrollZoom";
import { TrackFade } from "./TrackFade";

/*
 * Editions building blocks, after the reference's section anatomy:
 *   Chapter — a dark intro over the painting: a huge bold title and a
 *             drop-cap lede, then a cream panel;
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
  intro = true,
  besideRail = intro,
  backdrop,
  pinned,
  painting = HERO_BG,
}: {
  /** The painting pinned behind the intro; the hero's by default. */
  painting?: { src: string; width: number; height: number };
  /**
   * The panel starts at the rail's edge with a straight top, leaving the rail's
   * column on what's behind it (the painting, or the pinned hero for About).
   * Otherwise it runs full width. Defaults to `intro`.
   */
  besideRail?: boolean;
  /** Set into the pinned painting layer, so the panel scrolls over it too. */
  backdrop?: ReactNode;
  /**
   * A scene pinned behind the whole section, full width under the rail, in
   * place of the panel's cream: the title and lede (when there's no intro) and
   * the panel's content, in cream, scroll over it. Give anything that needs a
   * ground its own box (About's cards sit in a cream one).
   */
  pinned?: ReactNode;
  /** False when the intro is staged elsewhere (About's runs inside the hero). */
  intro?: boolean;
  id: string;
  label: string;
  title: string;
  lede: string;
  /** The drop-cap heading that opens the cream panel, if any. */
  heading?: string;
  children: ReactNode;
}) {
  // A pinned scene spans the whole section, under the rail too, so the panel runs full width over it.
  const beside = besideRail && !pinned;
  return (
    // With an intro, the section tucks a screen up over the end of the one before (z-[2] over its
    // z-[1]), its painting pinned there and eroding in from the bottom, so the chapter before
    // dissolves away under it. Clipped, so its own pinned painting doesn't hold past its end.
    <section
      id={id}
      aria-label={label}
      className={`signal-rail-bleed relative isolate ${intro ? "z-[2] -mt-[100svh] overflow-clip" : "z-[1]"}`}
    >
      {/* A sticky layer with a negative margin holds a screen past the section's end: the
          next chapter's painting erodes in over it there. */}
      {pinned ? (
        <div aria-hidden className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
          {pinned}
        </div>
      ) : null}
      {intro ? (
        <>
          {/* The painting, pinned for the whole chapter; the cream panel below rises over it.
              Once the shader is drawing, the plain painting and night under it step aside: the
              canvas is clear where it hasn't eroded in yet, and the chapter before shows through. */}
          <div
            aria-hidden
            className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden bg-night has-[canvas[data-ready=true]]:bg-transparent [&:has(canvas[data-ready=true])_.paint-fallback]:invisible"
          >
            {/* Pushes in and drifts up across the chapter, under the content scrolling over it. */}
            <ScrollZoom>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={painting.src}
                alt=""
                width={painting.width}
                height={painting.height}
                loading="lazy"
                className="paint-fallback absolute inset-0 h-full w-full object-cover select-none"
              />
              <div className="paint-fallback absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]" />
              {/* Erodes in from the bottom over the chapter before, as this chapter's intro rises. */}
              <DissolvePainting src={painting.src} track={`${id}-intro`} className="absolute inset-0 h-full w-full" />
            </ScrollZoom>
            {backdrop ? <TrackFade track={`${id}-intro`}>{backdrop}</TrackFade> : null}
          </div>
          {/* The screen spent over the end of the chapter before, as the painting erodes in.
              Unmarked and click-through, so that chapter keeps the nav's tone and its links. */}
          <div aria-hidden className="pointer-events-none h-[100svh]" />
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
          its tone over that (dark) rather than the panel. Otherwise it runs full width. */}
      <div
        data-nav-theme={beside || pinned ? "dark" : "light"}
        // Beside the rail, at least a screen tall: the next chapter tucks a screen up over its end.
        // Over a pinned scene the panel is clear, its text cream; boxes within it carry their own ground.
        className={`relative ${pinned ? "text-cream" : "bg-background text-ink"} ${beside ? "min-h-[100svh] md:ml-[var(--nav-sidebar-w)]" : ""}`}
      >
        {/* Over a pinned scene: first a clear screen, while the scene (clear where it hasn't
            arrived) erodes in from the bottom over what's behind; then the chapter's title and
            lede, a screen tall, rising with it. Its top drives the erosion (`${id}-reveal`). */}
        {pinned && !intro ? <div aria-hidden className="h-[100svh]" /> : null}
        {pinned && !intro ? (
          <div id={`${id}-reveal`} className={`${frame} ${railInset} relative flex min-h-[100svh] flex-col justify-end pb-[clamp(2.5rem,6vh,4rem)]`}>
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
        ) : null}
        <div className={`${frame} ${beside ? "md:px-10" : railInset} relative ${pinned ? "[text-shadow:0_2px_18px_rgba(0,0,0,0.55)]" : ""} ${heading ? "pt-[clamp(3.5rem,8vh,5.5rem)]" : "pt-[clamp(1.5rem,4vh,2.5rem)]"} pb-[clamp(4rem,10vh,7.5rem)]`}>
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
