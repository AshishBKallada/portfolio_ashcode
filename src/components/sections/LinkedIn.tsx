import { linkedinSays } from "@/data/linkedin";
import { LinkedInGrid } from "@/components/sections/linkedin/LinkedInGrid";

export function LinkedIn() {
  return (
    <section
      id="linkedin"
      aria-label={linkedinSays.title}
      className="relative scroll-mt-20 overflow-hidden theme-light bg-background px-4 py-24 text-foreground sm:px-8 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_25%_100%,rgba(179,32,27,0.14)_0%,rgba(179,32,27,0.05)_40%,transparent_75%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <LinkedInGrid />
      </div>
    </section>
  );
}
