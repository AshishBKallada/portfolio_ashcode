import { site } from "@/data/site";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { IntroParallax } from "@/components/sections/intro/IntroParallax";

const poster = site.intro.poster;

const heavy =
  "font-sans font-bold uppercase leading-[0.84] tracking-[-0.045em] text-[clamp(3rem,11.5vw,12rem)]";

// Poster layout: heavy uppercase lines with one italic serif word, the last
// line pushed right, and a credits row plus a script-like note at the foot.
export function Intro() {
  return (
    <section
      id="intro"
      style={{ backgroundColor: site.intro.bg }}
      className="flex h-full min-h-svh flex-col px-4 pt-24 pb-6 text-black sm:px-6 sm:pt-28"
    >
      <IntroParallax>
        <h2 className="sr-only">
          {poster.lineOne} {poster.lineTwo} {poster.lineTwoItalic}{" "}
          {poster.lineThree} {poster.note}
        </h2>
        <div aria-hidden className="w-full">
          <SectionReveal>
            <p className={heavy}>{poster.lineOne}</p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <p className={heavy}>
              {poster.lineTwo}{" "}
              <em className="font-serif font-extralight tracking-[-0.02em] italic">
                {poster.lineTwoItalic}
              </em>
            </p>
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <p className={`text-right ${heavy}`}>{poster.lineThree}</p>
          </SectionReveal>
        </div>
      </IntroParallax>

      <div className="mt-auto flex items-end justify-between gap-6">
        <dl className="grid grid-cols-[auto_auto_auto] gap-x-6 text-[clamp(0.8rem,1.3vw,1.15rem)] leading-tight sm:gap-x-10">
          {poster.credits.map((credit) => (
            <div key={credit.name} className="contents">
              <dt className="font-sans font-bold tracking-[-0.03em] uppercase">
                {credit.name}
              </dt>
              <dd className="font-serif italic">{credit.index}</dd>
              <dd className="font-serif italic">{credit.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="max-w-[16rem] text-center font-serif text-[clamp(0.85rem,1.3vw,1.15rem)] leading-tight whitespace-pre-line italic">
          {poster.note}
        </p>
      </div>
    </section>
  );
}
