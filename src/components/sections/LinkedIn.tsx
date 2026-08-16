import { linkedinSays } from "@/data/linkedin";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { LinkedInGrid } from "@/components/sections/linkedin/LinkedInGrid";

export function LinkedIn() {
  return (
    <section
      id="linkedin"
      className="flex min-h-[70svh] scroll-mt-20 flex-col items-center justify-center bg-background px-4 py-24 sm:px-8 sm:py-32"
    >
      <SectionReveal className="mb-4 w-full max-w-5xl text-center">
        <h2 className="font-serif text-[clamp(1.05rem,2.4vw,1.5rem)] font-extralight italic tracking-tight text-foreground">
          {linkedinSays.title}
        </h2>
      </SectionReveal>

      <div className="w-full max-w-5xl">
        <LinkedInGrid />
      </div>

      <SectionReveal delay={0.08} className="mt-5 text-center">
        <p className="font-serif text-[13px] font-extralight italic tracking-tight text-foreground sm:text-sm">
          {linkedinSays.subtitle}
        </p>
      </SectionReveal>
    </section>
  );
}
