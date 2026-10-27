"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import { AboutMeStage } from "./AboutMeStage";
import { HERO_PIN_VH } from "./SkyHero";
import { LinkedInSection } from "./LinkedInSection";
import { frame, metaLabel, metaText } from "./primitives";

/** Hero pins through its reveal, then the sections below scroll up and stack over it. */
export function HeroStage({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mark the hero covered once it's fully hidden, so it stops painting
  // (globals.css). The first section sits beside the rail with the hero still
  // showing in the rail's column, until the next chapter's pinned painting is
  // behind it: when its foot reaches the viewport's. A data attribute, not state.
  useEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const first = content.firstElementChild ?? content;
      stage.dataset.covered = first.getBoundingClientRect().bottom <= window.innerHeight ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage relative bg-background text-foreground">
      <div className="hero-pin sticky top-0 z-0 h-[100svh] min-h-[640px] overflow-hidden">{hero}</div>
      {/* Holds the hero pinned through its reveal, the camera push and About (SkyHero). */}
      <div aria-hidden style={{ height: `${HERO_PIN_VH * 100}svh` }} />
      <div ref={contentRef} className="signal-main-gutter relative z-10">
        {children}
      </div>
    </div>
  );
}

const stack = site.signal.toolkit.map((name, i) => ({ name, tools: site.skills.rows[i] ?? [] }));
/** A ticket's notches: a half circle bitten out of each side, just below the middle. */
const TICKET_MASK =
  "radial-gradient(circle 17px at 0 55%, #0000 97%, #000) left / 51% 100% no-repeat, radial-gradient(circle 17px at 100% 55%, #0000 97%, #000) right / 51% 100% no-repeat";


/**
 * [01] About — full-viewport intro, then the LinkedIn carousel and stack tickets.
 */
export function SignalAbout() {
  return (
    <section
      id="about"
      aria-label="About"
      className="signal-rail-bleed relative isolate overflow-x-clip bg-background shadow-[0_-12px_48px_rgba(0,0,0,0.08)]"
    >
      <AboutMeStage />

      <div className="relative z-[1]">
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
