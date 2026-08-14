import { linkedinSays } from "@/data/linkedin";
import { LinkedInGrid } from "@/components/sections/linkedin/LinkedInGrid";
import { RevealText } from "@/components/motion/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function LinkedIn() {
  return (
    <Section id="linkedin" className="py-20 sm:py-24">
      <RevealText className="flex justify-center">
        <SectionEyebrow number="03" label="LinkedIn" />
      </RevealText>
      <RevealText>
        <h2 className="mt-5 text-center font-sans text-3xl leading-[1.2] font-medium tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          {linkedinSays.headlineBefore}{" "}
          <em className="font-serif font-extralight italic">
            {linkedinSays.headlineItalic}
          </em>{" "}
          {linkedinSays.headlineAfter}
        </h2>
      </RevealText>

      <LinkedInGrid />
    </Section>
  );
}
