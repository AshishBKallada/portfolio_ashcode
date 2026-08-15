import { linkedinSays } from "@/data/linkedin";
import { LinkedInGrid } from "@/components/sections/linkedin/LinkedInGrid";

export function LinkedIn() {
  return (
    <section
      id="linkedin"
      className="flex min-h-[70svh] scroll-mt-20 flex-col items-center justify-center bg-background px-4 py-24 sm:px-8 sm:py-32"
    >
      <h2 className="mb-4 w-full max-w-5xl text-center font-serif text-[clamp(1.05rem,2.4vw,1.5rem)] font-extralight italic tracking-tight text-foreground">
        {linkedinSays.title}
      </h2>

      <div className="w-full max-w-5xl">
        <LinkedInGrid />
      </div>

      <p className="mt-5 text-center font-serif text-[13px] font-extralight italic tracking-tight text-foreground sm:text-sm">
        {linkedinSays.subtitle}
      </p>
    </section>
  );
}
