"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import { LinkedInSection } from "./LinkedInSection";
import { SectionLabel, cols, frame, metaLabel, metaText, monoLabel } from "./primitives";

/** Hero, then the rest of the page — one continuous scroll. */
export function HeroStage({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <div className="relative bg-background text-foreground">
      <div className="relative h-[100svh] min-h-[640px] overflow-hidden">{hero}</div>
      {children}
    </div>
  );
}

const creed = site.signal.notes;
const stack = site.signal.toolkit.map((name, i) => ({ name, tools: site.skills.rows[i] ?? [] }));
/** A ticket's notches: a half circle bitten out of each side, just below the middle. */
const TICKET_MASK =
  "radial-gradient(circle 17px at 0 55%, #0000 97%, #000) left / 51% 100% no-repeat, radial-gradient(circle 17px at 100% 55%, #0000 97%, #000) right / 51% 100% no-repeat";


/**
 * [01] About — who, and what he holds to: the creed beside the intro, the
 * LinkedIn carousel, then the stack as four ticket cards.
 */
export function SignalAbout() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative isolate overflow-x-clip bg-background"
    >
      <div className="relative z-[1] pt-20 md:pt-[clamp(4.5rem,9vh,6rem)]">
        <div className={frame}>
          <SectionLabel index="01">About</SectionLabel>
        </div>

        <div className={`${frame} ${cols} mt-8 gap-y-10 md:mt-[clamp(1.5rem,4vh,3rem)]`}>
          {/* The creed, with whose it is. */}
          <RevealItem delay={0.06} className="px-3 md:col-span-2">
            <blockquote className="max-w-[18ch] font-serif text-[clamp(2rem,3.6vw,3.6rem)] leading-[1] tracking-[-0.03em] text-balance">
              &ldquo;{creed.quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-ink/10">
                <Image
                  src={site.aboutPoster.avatar}
                  alt=""
                  width={478}
                  height={1086}
                  sizes="96px"
                  className="absolute top-0 left-1/2 w-[140%] max-w-none -translate-x-1/2"
                />
              </span>
              <span>
                <span className="block text-[16px] font-medium">{site.signal.fullName}</span>
                <span className={`${monoLabel} text-subtle`}>Full-stack developer</span>
              </span>
            </div>
          </RevealItem>

          {/* The intro. */}
          <RevealItem delay={0.12} className="px-3 md:col-span-2 md:col-start-3">
            <p className={`${metaLabel} text-subtle`}>[About]</p>
            <p className="mt-5 max-w-md font-sans text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] tracking-[-0.01em] text-ink">
              For full-stack products, based in {site.location.toLowerCase()} and working worldwide.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-[1.55] text-muted">{site.aboutPoster.bio}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/resume"
                className={`${metaLabel} nav-link text-ink hover:text-oxblood`}
              >
                Read the résumé ↗
              </Link>
              <Link
                href={`mailto:${site.email}`}
                className={`${metaLabel} nav-link text-subtle hover:text-ink`}
              >
                Email
              </Link>
            </div>
          </RevealItem>
        </div>

        <LinkedInSection />

        {/* The stack (the old Arsenal): four ticket cards in a row, two on phones. */}
        <div id="toolkit" className="scroll-mt-20 py-10 md:py-14">
          <ul aria-label="Stack" className={`${frame} grid grid-cols-2 gap-3 md:grid-cols-4`}>
            {stack.map((group, i) => (
              <RevealItem key={group.name} delay={0.2 + i * 0.08} className="flex">
                <li
                  style={{ mask: TICKET_MASK, WebkitMask: TICKET_MASK }}
                  className="flex min-h-[10.5rem] w-full flex-col justify-between gap-6 rounded-[22px] bg-cream px-[22px] py-[18px] text-ink md:min-h-[clamp(10.5rem,20vh,12.5rem)]"
                >
                  <p className={`${metaLabel} flex items-center justify-between`}>
                    <span>{group.name}</span>
                    <span className="tabular-nums text-ink/50">[{String(i + 1).padStart(2, "0")}]</span>
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {group.tools.map((tool) => (
                      <li key={tool} className={metaText}>
                        {tool.replace("#", "")}
                      </li>
                    ))}
                  </ul>
                </li>
              </RevealItem>
            ))}
          </ul>
          {/* The cards' shadow on the page. */}
          <div
            aria-hidden
            className={`${frame} mt-[-6px] h-[10px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.1),transparent)]`}
          />
        </div>
      </div>
    </section>
  );
}
