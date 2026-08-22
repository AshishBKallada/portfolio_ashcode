import { site } from "@/data/site";
import { ContactActions } from "@/components/sections/contact/ContactActions";
import { ContactFigure } from "@/components/sections/contact/ContactFigure";
import { LiveClock } from "@/components/sections/contact/LiveClock";
import { Section } from "@/components/layout/Section";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

type Meta = { label: string; value: React.ReactNode };

export function Contact() {
  const meta: Meta[] = [
    { label: "Location", value: site.contact.location },
    {
      label: `Local time · ${site.contact.timezoneLabel}`,
      value: (
        <LiveClock
          timezone={site.contact.timezone}
          label={site.contact.timezoneLabel}
        />
      ),
    },
    { label: "Response", value: site.contact.response },
    { label: "Coordinates", value: site.contact.coordinates },
  ];

  return (
    <Section
      id="contact"
      className="relative flex h-full min-h-svh flex-col justify-between overflow-hidden py-16 sm:py-20"
    >
      <ContactFigure src={site.contact.image} />

      <div className="relative z-10 flex items-start justify-between gap-6">
        <SectionReveal>
          <SectionEyebrow number="04" label={site.contact.eyebrow} />
        </SectionReveal>
        <SectionReveal delay={0.05}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-sans text-[10px] font-medium tracking-[0.18em] text-muted uppercase backdrop-blur-sm">
            <span className="dot-pulse inline-block size-1.5 rounded-full bg-[#dc2626]" />
            {site.contact.availability}
          </span>
        </SectionReveal>
      </div>

      <div className="relative z-10 mt-16 max-w-5xl sm:mt-20">
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

      <div className="relative z-10 mt-12 max-w-3xl sm:mt-16">
        <ContactActions />
      </div>

      <div className="relative z-10 mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 sm:mt-16 sm:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <span className="font-sans text-[10px] font-medium tracking-[0.22em] text-subtle uppercase">
              {item.label}
            </span>
            <span className="font-sans text-[13px] tracking-[-0.02em] text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
