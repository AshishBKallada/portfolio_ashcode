import { AnchorLink } from "@/components/motion/AnchorLink";
import { site } from "@/data/site";

export function HeroCta() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-end gap-5 sm:gap-7">
      <AnchorLink
        href={site.hero.cta.href}
        className="inline-flex shrink-0 items-center gap-2 border border-white px-5 py-2.5 font-serif text-sm tracking-tight text-white transition-opacity hover:opacity-70"
      >
        {site.hero.cta.label}
        <span aria-hidden className="text-[0.85em] leading-none">
          ↗
        </span>
      </AnchorLink>

      <span
        aria-hidden
        className="hidden h-8 w-px border-l border-dashed border-white/45 sm:block"
      />

      <p className="font-sans text-[13px] text-white">{site.hero.role}</p>
    </div>
  );
}
