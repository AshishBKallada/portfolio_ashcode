import { site } from "@/data/site";
import { AboutMedia } from "@/components/sections/about/AboutMedia";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { AnchorLink } from "@/components/motion/AnchorLink";

// `embedded`: plays on the hero laptop's screen, which the hero's scroll
// drives; the page's #about anchor then lives in the hero's pin instead.
export function About({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      id={embedded ? undefined : "about"}
      className={`bg-brand theme-light relative z-10 overflow-visible ${embedded ? "" : "scroll-mt-20 pb-16 sm:pb-20"}`}
    >
      <AboutMedia embedded={embedded}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <SectionReveal delay={0.08}>
            <h2 className="font-serif text-[clamp(1.35rem,3.6vw,3.25rem)] leading-[1.1] whitespace-nowrap text-foreground">
              {site.about.headlineBefore}{" "}
              <em className="italic">{site.about.headlineItalic}</em>
              {site.about.headlineAfter}
            </h2>
          </SectionReveal>

          <RevealItem className="max-w-md md:text-right">
            <p className="text-sm leading-6 text-muted">{site.bio}</p>
            <p className="mt-3 flex items-center gap-4 font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase md:justify-end">
              <span className="text-muted">{site.location}</span>
              <AnchorLink href="/#projects" className="nav-link text-foreground">
                Selected work ↓
              </AnchorLink>
            </p>
          </RevealItem>
        </div>
      </AboutMedia>
    </section>
  );
}
