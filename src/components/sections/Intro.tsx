import { site } from "@/data/site";
import { SectionReveal } from "@/components/motion/SectionReveal";

export function Intro() {
  return (
    <section
      id="intro"
      className="flex h-full min-h-svh flex-col items-center justify-center bg-white px-6 text-black"
    >
      <SectionReveal>
        <p className="font-sans text-[10px] font-medium tracking-[0.28em] text-black uppercase">
          {site.intro.number} — {site.intro.eyebrow}
        </p>
      </SectionReveal>

      <SectionReveal delay={0.1} className="mt-8">
        <h2 className="text-center font-sans text-2xl leading-[1.5] tracking-[-0.03em] text-black sm:text-3xl sm:leading-[1.45] lg:text-4xl lg:leading-[1.4]">
          {site.intro.lineOneBefore}{" "}
          <em className="font-serif italic text-black">{site.intro.lineOneItalic}</em>
          <br />
          {site.intro.lineTwo}
          <br />
          {site.intro.lineThree}
        </h2>
      </SectionReveal>
    </section>
  );
}
