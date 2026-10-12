import Image from "next/image";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { Parallax } from "@/components/motion/Parallax";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Placard } from "@/components/ui/Placard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/data/site";

const copy = site.gallery.pantheon;

// Chapter two, hung like a sculpture hall: the marble archangel on a plinth
// of gold light, and beside it the headline, a museum wall label for the
// artist and three tenets numbered in Roman.
export function Pantheon() {
  return (
    <section
      id="about"
      className="relative z-10 scroll-mt-20 overflow-hidden bg-wall px-4 pt-28 pb-24 text-ink sm:px-5 sm:pb-32"
    >
      <SectionLabel index={2}>{copy.label}</SectionLabel>

      <div className="mt-10 grid items-center gap-12 lg:mt-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        {/* The statue: drifts slower than the page so it reads as further back. */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-x-[8%] top-[6%] bottom-[18%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--gold)_38%,transparent),transparent)] blur-2xl"
          />
          <Parallax speed={60}>
            <Image
              src={copy.statue}
              alt={copy.statueAlt}
              width={1800}
              height={2400}
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="relative h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)] select-none"
            />
          </Parallax>
          {/* Plinth line the figure stands on. */}
          <div aria-hidden className="relative mx-auto -mt-6 h-px w-2/3 bg-gold/60" />
        </div>

        <div className="relative">
          <SectionReveal>
            <h2 className="font-serif text-[clamp(2.25rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.02em]">
              {site.about.headlineBefore}{" "}
              <span className="font-script text-[1.12em] text-flame">{site.about.headlineItalic}</span>
              {site.about.headlineAfter}
            </h2>
          </SectionReveal>

          <RevealItem className="mt-6 max-w-md">
            <p className="text-[15px] leading-7 text-ink/80">{site.bio}</p>
          </RevealItem>

          <RevealItem className="mt-10 max-w-sm">
            <Placard
              no={copy.placard.no}
              title={copy.placard.title}
              lines={copy.placard.lines}
              medium={copy.placard.medium}
              className="-rotate-1"
            />
          </RevealItem>

          <ol className="mt-12 max-w-md space-y-4 border-t border-ink/15 pt-6">
            {copy.tenets.map((tenet) => (
              <li key={tenet.numeral}>
                <RevealItem className="flex items-baseline gap-5">
                  <span className="w-8 shrink-0 font-display text-[22px] leading-none text-gold">
                    {tenet.numeral}
                  </span>
                  <span className="font-serif text-[clamp(1.25rem,1.8vw,1.6rem)] leading-tight">
                    {tenet.text}
                  </span>
                </RevealItem>
              </li>
            ))}
          </ol>

          <p className="mt-10 font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase">
            <AnchorLink href="/#projects" className="nav-link">
              Enter the collection ↓
            </AnchorLink>
          </p>
        </div>
      </div>
    </section>
  );
}
