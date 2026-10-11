import { site } from "@/data/site";
import { AboutMedia } from "@/components/sections/about/AboutMedia";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function About() {
  return (
    <section
      id="about"
      className="theme-light relative z-10 scroll-mt-20 overflow-visible bg-background pb-16 sm:pb-20"
    >
      <AboutMedia>
        <SectionReveal>
          <SectionEyebrow number="01" label={site.about.eyebrow} />
        </SectionReveal>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
          <SectionReveal delay={0.08}>
            <h2 className="font-serif text-[clamp(1.35rem,3.6vw,3.25rem)] leading-[1.1] whitespace-nowrap text-foreground">
              {site.about.headlineBefore}{" "}
              <em className="italic">{site.about.headlineItalic}</em>
              {site.about.headlineAfter}
            </h2>
          </SectionReveal>

          <RevealItem className="max-w-md md:text-right">
            <p className="text-sm leading-6 text-muted">{site.bio}</p>
            <p className="mt-1 text-xs text-muted">{site.location}</p>
          </RevealItem>
        </div>
      </AboutMedia>
    </section>
  );
}
