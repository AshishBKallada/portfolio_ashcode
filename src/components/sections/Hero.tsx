import { site } from "@/data/site";
import { HeroCta } from "@/components/sections/hero/HeroCta";
import { HeroOverlay } from "@/components/sections/hero/HeroOverlay";

export function Hero() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-[#dc2626]">
      <HeroOverlay />
      <div className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-24 pb-12 md:px-12 md:pt-28 md:pb-14 lg:px-20">
        <div className="mt-auto grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-4 lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
              — Chapter 01 / Portfolio 2026
            </p>
            <div className="mt-3 h-px w-full bg-white/40" />
            <p className="my-4 max-w-xs text-xs leading-relaxed text-white/85">
              {site.hero.sublineBefore}{" "}
              <span className="font-semibold text-white">
                {site.hero.sublineHighlightOne}
              </span>{" "}
              {site.hero.sublineMiddle}{" "}
              <span className="font-semibold text-white">
                {site.hero.sublineHighlightTwo}
              </span>
              . {site.bio}
            </p>
            <div className="h-px w-full bg-white/40" />
            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
              <span>{site.location}</span>
              <span className="mx-3 h-px flex-1 bg-white/25" />
              <span>{site.role}</span>
            </div>
            <p className="mt-4 max-w-xs text-[11px] italic leading-relaxed text-white/70">
              &ldquo;{site.hero.note}&rdquo;
            </p>
          </div>

          <div className="md:col-span-8 md:text-right lg:col-span-9">
            <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/70">
              <span className="mr-3 inline-block h-px w-8 bg-white/50 align-middle" />
              {site.hero.greeting} — I&apos;m {site.hero.name}
              <span className="ml-3 inline-block h-px w-8 bg-white/50 align-middle" />
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.95] tracking-tight text-white">
              {site.hero.headlineLineOne}
              <br />
              {site.hero.headlineLineTwoBefore}{" "}
              <em className="font-serif font-extralight italic">
                {site.hero.headlineItalic}
              </em>
              {site.hero.headlineLineTwoAfter}
              <br />
              {site.hero.headlineLineThree}
            </h1>
            <HeroCta />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/70">
          <span className="h-px flex-1 bg-white/25" />
          <span>Scroll to explore</span>
          <span className="h-px w-8 bg-white/50" />
          <span>Selected work · About · Contact</span>
          <span className="h-px flex-1 bg-white/25" />
        </div>
      </div>
    </section>
  );
}
