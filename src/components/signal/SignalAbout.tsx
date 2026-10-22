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
/** Shared borders for a cell in the four-column grid (two columns on phones). */
const cell = (i: number) =>
  `border-border px-3 ${i > 0 ? "md:border-l" : ""} ${i % 2 === 1 ? "max-md:border-l" : ""} ${i > 1 ? "max-md:border-t" : ""}`;


/**
 * [01] About — who, and what he holds to: the creed beside the intro, the
 * LinkedIn carousel, then the stack in one bordered row.
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

        {/* The stack (the old Arsenal): one bordered row of four cells. */}
        <div id="toolkit" className="scroll-mt-20 border-y border-border">
          <ul aria-label="Stack" className={`${frame} grid grid-cols-2 md:grid-cols-4`}>
            {stack.map((group, i) => (
              <RevealItem key={group.name} delay={0.2 + i * 0.05} className={`${cell(i)} flex`}>
                <li className="flex min-h-[10rem] w-full flex-col justify-between gap-6 py-6 md:min-h-[clamp(10rem,19vh,12rem)] md:py-[clamp(1.25rem,3vh,2.25rem)]">
                  <p className={`${metaLabel} flex items-center justify-between text-subtle`}>
                    <span>{group.name}</span>
                    <span className="tabular-nums">[{String(i + 1).padStart(2, "0")}]</span>
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
        </div>
      </div>
    </section>
  );
}
