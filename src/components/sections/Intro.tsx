import { site } from "@/data/site";

export function Intro() {
  return (
    <section
      id="intro"
      className="flex h-full min-h-svh flex-col items-center justify-center bg-[#dc2626] px-6 text-white"
    >
      <p className="font-sans text-[10px] font-medium tracking-[0.28em] text-white uppercase">
        {site.intro.number} — {site.intro.eyebrow}
      </p>

      <h2 className="mt-8 text-center font-sans text-2xl leading-[1.5] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.45] lg:text-4xl lg:leading-[1.4]">
        {site.intro.lineOneBefore}{" "}
        <em className="font-serif italic text-white">{site.intro.lineOneItalic}</em>
        <br />
        {site.intro.lineTwo}
        <br />
        {site.intro.lineThree}
      </h2>
    </section>
  );
}
