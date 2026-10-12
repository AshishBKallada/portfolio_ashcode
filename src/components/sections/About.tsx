import { site } from "@/data/site";
import { AboutMedia } from "@/components/sections/about/AboutMedia";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section
      id="about"
      style={{ backgroundColor: site.navbar.bg }}
      className="theme-light relative z-10 scroll-mt-20 overflow-visible pb-16 sm:pb-20"
    >
      <AboutMedia>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <SectionReveal delay={0.08}>
            <SectionLabel index={2} className="mb-4">
              Journey
            </SectionLabel>
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
