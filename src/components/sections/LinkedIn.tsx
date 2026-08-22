import Image from "next/image";
import { linkedinSays } from "@/data/linkedin";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { LinkedInGrid } from "@/components/sections/linkedin/LinkedInGrid";

export function LinkedIn() {
  return (
    <section
      id="linkedin"
      className="relative flex min-h-[70svh] scroll-mt-20 flex-col items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-8 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-0 z-0 hidden w-[280px] -translate-y-1/2 md:block lg:w-[360px] xl:w-[440px]"
      >
        <Image
          src="/images/linkedin-accent.png"
          alt=""
          width={1088}
          height={1445}
          sizes="(min-width: 1280px) 440px, (min-width: 1024px) 360px, 280px"
          className="block h-auto w-full object-contain"
        />
      </div>

      <SectionReveal className="relative z-10 mb-4 w-full max-w-5xl text-center">
        <h2 className="font-serif text-[clamp(1.05rem,2.4vw,1.5rem)] font-extralight italic tracking-tight text-foreground">
          {linkedinSays.title}
        </h2>
      </SectionReveal>

      <div className="relative z-10 w-full max-w-5xl">
        <LinkedInGrid />
      </div>

      <SectionReveal delay={0.08} className="relative z-10 mt-5 text-center">
        <p className="font-serif text-[13px] font-extralight italic tracking-tight text-foreground sm:text-sm">
          {linkedinSays.subtitle}
        </p>
      </SectionReveal>
    </section>
  );
}
