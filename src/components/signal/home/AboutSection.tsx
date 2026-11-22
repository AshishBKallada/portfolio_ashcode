import { aboutExhibits, aboutTitle } from "@/data/home";
import { AboutBio } from "./AboutBio";
import { ExhibitItem } from "./ExhibitItem";

/**
 * About: the title held mid-screen while the exhibits scroll up past it along the left and
 * right edges, like the corridor's walls, then released into the bio. On wide screens the
 * pictures run beside the title and never cross it.
 */
export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" data-nav-theme="light" className="relative">
      <div className="relative">
        <div className="pointer-events-none sticky top-0 z-10 flex h-[100svh] items-start justify-center md:items-center md:px-8">
          {/* Phones: the title pins to the top on the ground colour, so pictures pass under it, never over. */}
          <h2
            id="about-title"
            className="w-full bg-background px-4 pt-[72px] pb-3 text-center font-display text-[17vw] leading-[0.85] tracking-[-0.01em] text-ink uppercase md:w-auto md:bg-transparent md:p-0 md:text-[clamp(80px,10.5vw,170px)]"
          >
            {aboutTitle[0]}
            <br />
            {aboutTitle[1]}
          </h2>
        </div>
        <ol className="relative z-0 -mt-[100svh] flex flex-col gap-12 px-4 pt-[44svh] pb-[16svh] md:gap-[12svh] md:px-8 md:pt-[34svh]">
          {aboutExhibits.map((item, i) => (
            <ExhibitItem key={item.title} item={item} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </ol>
      </div>
      <AboutBio />
    </section>
  );
}
