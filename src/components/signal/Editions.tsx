import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { ScrollWords } from "@/components/motion/ScrollWords";
import Link from "next/link";
import type { ReactNode } from "react";
import { RevealItem } from "@/components/motion/Reveal";

/*
 * Editions building blocks, after the reference's section anatomy:
 *   DropCap — narrative serif with a swash script capital;
 *   Card    — 16:9 media, a small bold title, serif body, bordered button.
 */

/** Narrative serif opening on a swash script capital. */
export function DropCap({
  children,
  className = "",
  scrub = false,
}: {
  children: string;
  className?: string;
  /** Fill the words in one by one as the line scrolls up the screen (ScrollWords). */
  scrub?: boolean;
}) {
  const [first, rest] = [children.slice(0, 1), children.slice(1)];
  return (
    <span className={`font-narrative tracking-[-0.04em] ${className}`}>
      <span aria-hidden className="mr-[-0.04em] font-flourish text-[1.45em] leading-[0.5] tracking-normal">
        {first}
      </span>
      <span aria-hidden>{scrub ? <ScrollWords text={rest} /> : rest}</span>
      <span className="sr-only">{children}</span>
    </span>
  );
}

/** Two-up grid; optional third column on large viewports. */
export function CardGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
  const colClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return <div className={`grid gap-x-6 gap-y-14 ${colClass}`}>{children}</div>;
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
          <ParallaxImage reveal className="mb-5 aspect-video rounded-[3px] bg-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.src}
              alt={media.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
            />
          </ParallaxImage>
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
function EditionButton({ label, href, external }: CardAction) {
  const className =
    "keep-ink inline-flex min-h-8 items-center gap-1.5 rounded-[3px] border border-ink/20 bg-white/60 px-3 font-headline text-[13px] tracking-[-0.01em] text-ink transition-colors hover:border-ink/40 hover:bg-white focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink";
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
