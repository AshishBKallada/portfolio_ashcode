import { site } from "@/data/site";
import { AboutMedia } from "@/components/sections/about/AboutMedia";
import { RevealItem } from "@/components/motion/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function About() {
  return (
    <Section id="about" className="pt-8 pb-16 sm:pt-10 sm:pb-20">
      <div className="text-left">
        <RevealItem>
          <SectionEyebrow number="01" label={site.about.eyebrow} />
        </RevealItem>

        <RevealItem>
          <h2 className="mt-6 font-serif text-[clamp(1.35rem,4.6vw,4.25rem)] leading-[1.15] whitespace-nowrap text-foreground">
            {site.about.headlineBefore}{" "}
            <em className="italic">{site.about.headlineItalic}</em>
            {site.about.headlineAfter}
          </h2>
        </RevealItem>

        <RevealItem>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{site.bio}</p>
        </RevealItem>

        <RevealItem>
          <p className="mt-4 text-sm text-muted">{site.location}</p>
        </RevealItem>
      </div>

      <AboutMedia />
    </Section>
  );
}
