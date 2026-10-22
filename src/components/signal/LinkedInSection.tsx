"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { LiquidGlassCarousel, type LiquidGlassCarouselItem } from "@/components/ui/liquid-glass-carousel";
import { site } from "@/data/site";
import { theme } from "@/theme";
import { usePageMode } from "@/theme/mode";
import { SectionLabel, frame, metaLabel } from "./primitives";

const copy = site.signal.linkedin;
const linkedinUrl = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "";
const items: LiquidGlassCarouselItem[] = copy.posts.map((post) => ({ ...post }));

/**
 * LinkedIn, inside About — recent posts as an endless row of panels seen through a
 * liquid-glass lens, full screen on the page red: the active post's title
 * above, its count below. The stage pins while the page scrolls past and the
 * scroll carries the row sideways; dragging, swiping and the arrow keys move
 * it too, and clicking a panel brings it forward. The carousel mounts as the
 * section nears so its rise-in intro plays where it can be seen.
 */
export function LinkedInSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const near = useInView(sectionRef, { once: true, margin: "0px 0px 25% 0px" });
  // The WebGL clear colour can't read CSS, so it follows the page mode here.
  const background = usePageMode() === "red" ? theme.page.bgRed : theme.page.bg;

  return (
    <section ref={sectionRef} id="linkedin" aria-label="LinkedIn" className="relative mt-10 h-[340svh]">
      <div ref={stageRef} className="sticky top-0 h-svh min-h-[560px] overflow-hidden">
        {/* Below the floating nav, level with the carousel's title. */}
        <div className={`${frame} absolute inset-x-0 top-24 z-10`}>
          <SectionLabel>LinkedIn</SectionLabel>
        </div>
        <div className="absolute inset-0">
          {near ? (
            <LiquidGlassCarousel
              items={items}
              panelHeight={520}
              background={background}
              color={theme.ink}
              scrollDriver={stageRef}
              scrollSpeed={0.9}
              lensScale={1.45}
              lensGlow={0}
              lensShade={0}
              className="min-h-0 text-[17px] focus-visible:ring-ink/30"
            />
          ) : null}
        </div>
        <div className="absolute right-4 bottom-8 z-10 sm:right-8">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${metaLabel} nav-link`}
          >
            {copy.cta} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
