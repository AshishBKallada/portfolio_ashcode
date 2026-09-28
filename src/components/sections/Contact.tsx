import { site } from "@/data/site";
import { ContactActions } from "@/components/sections/contact/ContactActions";
import { Section } from "@/components/layout/Section";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export function Contact() {
  return (
    <Section
      id="contact"
      className="theme-light relative flex h-full min-h-svh flex-col justify-between overflow-hidden bg-background pt-14 pb-20 sm:pt-16 sm:pb-24"
    >
      <div className="relative z-10">
        <SectionReveal>
          <SectionEyebrow number="04" label={site.contact.eyebrow} />
        </SectionReveal>
      </div>

      <div className="relative z-10 mt-10 max-w-5xl sm:mt-14">
        <SectionReveal delay={0.08}>
          <h2 className="font-sans text-[clamp(2.25rem,6.4vw,5.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-foreground">
            {site.contact.headlineBefore}
            <br />
            <em className="font-serif font-extralight italic tracking-tight">
              {site.contact.headlineItalic}.
            </em>
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.16} className="mt-6">
          <p className="max-w-md font-sans text-[15px] leading-7 tracking-[-0.02em] text-muted">
            {site.contact.body}
          </p>
        </SectionReveal>
      </div>

      <div className="relative z-10 mt-8 max-w-3xl sm:mt-12">
        <ContactActions />
      </div>
    </Section>
  );
}
