import { site } from "@/data/site";
import { ContactActions } from "@/components/sections/contact/ContactActions";
import { ContactFigure } from "@/components/sections/contact/ContactFigure";
import { Section } from "@/components/layout/Section";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function Contact() {
  return (
    <Section
      id="contact"
      bleedRight
      className="flex h-full min-h-svh flex-col justify-center py-20 sm:py-28"
    >
      <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="max-w-xl shrink-0 lg:w-[46%]">
          <SectionReveal>
            <SectionEyebrow number="04" label={site.contact.eyebrow} />
          </SectionReveal>
          <SectionReveal delay={0.08} className="mt-4">
            <h2 className="font-sans text-3xl leading-[1.15] font-medium tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              {site.contact.headlineBefore}{" "}
              <em className="font-serif font-extralight italic">
                {site.contact.headlineItalic}
              </em>
              .
            </h2>
          </SectionReveal>
          <p className="mt-5 max-w-md font-sans text-[15px] leading-7 tracking-[-0.02em] text-muted">
            {site.contact.body}
          </p>
          <ContactActions />
        </div>

        <ContactFigure src={site.contact.image} />
      </div>
    </Section>
  );
}
