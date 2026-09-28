import { site } from "@/data/site";
import { AboutMedia } from "@/components/sections/about/AboutMedia";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function About() {
  return (
    <section
      id="about"
      className="theme-light relative z-10 scroll-mt-20 overflow-visible bg-background pt-8 pb-40 sm:pt-10 sm:pb-48 lg:pb-56"
    >
      <div className="px-3 text-left sm:px-4">
        <SectionReveal>
          <SectionEyebrow number="01" label={site.about.eyebrow} />
        </SectionReveal>

        <SectionReveal delay={0.08} className="mt-6">
          <h2 className="font-serif text-[clamp(1.35rem,4.6vw,4.25rem)] leading-[1.15] whitespace-nowrap text-foreground">
            {site.about.headlineBefore}{" "}
            <em className="italic">{site.about.headlineItalic}</em>
            {site.about.headlineAfter}
          </h2>
        </SectionReveal>

        <RevealItem>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{site.bio}</p>
        </RevealItem>

        <RevealItem>
          <p className="mt-4 text-sm text-muted">{site.location}</p>
        </RevealItem>
      </div>

      <AboutMedia />
    </section>
  );
}
