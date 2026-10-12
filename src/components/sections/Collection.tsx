import { Parallax } from "@/components/motion/Parallax";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CollectionRoom } from "@/components/sections/collection/CollectionRoom";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/data/site";

const copy = site.projects;

// Chapter three: the work hung as a collection. A meta row and the
// "Not here to follow the hype" headline open the room, then the pinned
// gallery walks past each framed piece and its wall label.
export function Collection() {
  return (
    <section id="projects" className="relative z-10 bg-wall text-ink">
      <div className="px-4 pt-6 sm:px-5">
        {/* Meta row: the chapter label, then four small labels across the top. */}
        <div className="grid grid-cols-2 gap-y-2 border-b border-ink/20 pb-4 font-sans text-[11px] leading-tight font-medium tracking-[0.14em] uppercase sm:grid-cols-5">
          <SectionLabel index={3} className="leading-tight">
            {site.gallery.collection.label}
          </SectionLabel>
          {copy.meta.slice(1).map((item, i, rest) => (
            <p
              key={item}
              className={`whitespace-pre-line ${
                i === rest.length - 1 ? "text-right" : "hidden sm:block"
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Headline: lead · WORD · WORD · trail */}
        <Parallax speed={50}>
          <SectionReveal className="mt-16 sm:mt-24">
            <h2 className="flex items-center justify-center gap-[1.5vw]">
              <span className="hidden -translate-y-[0.6em] self-center font-script text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none whitespace-nowrap text-flame md:block">
                {copy.lead}
              </span>
              <span className="font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] uppercase">
                {copy.wordOne}
              </span>
              <span className="font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] uppercase">
                {copy.wordTwo}
              </span>
              <span className="hidden max-w-[5ch] translate-y-[0.5em] self-center font-script text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[0.9] text-flame md:block">
                {copy.trail}
              </span>
            </h2>
          </SectionReveal>
        </Parallax>
      </div>

      <CollectionRoom />
    </section>
  );
}
