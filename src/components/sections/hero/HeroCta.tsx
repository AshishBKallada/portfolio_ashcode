import { AnchorLink } from "@/components/motion/AnchorLink";
import { site } from "@/data/site";

/** CTA row under the hero statement: outlined button, dashed rule, tag list. */
export function HeroCta() {
  return (
    <div className="mt-5 flex flex-wrap items-stretch gap-4 sm:gap-6">
      <AnchorLink
        href={site.hero.cta.href}
        className="inline-flex shrink-0 items-center gap-3 border border-[#f4f1ea] px-5 py-2.5 font-serif text-sm tracking-tight text-[#f4f1ea] transition-opacity hover:opacity-70 sm:px-6 sm:py-3 sm:text-base"
      >
        {site.hero.cta.label}
        <span aria-hidden className="text-[0.85em] leading-none">
          ↗
        </span>
      </AnchorLink>

      <span
        aria-hidden
        className="hidden w-px self-stretch border-l border-dashed border-[#f4f1ea]/45 sm:block"
      />

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-[13px] text-[#f4f1ea]/85 sm:text-sm">
        {site.hero.tags.map((tag) => (
          <li key={tag} className="flex items-center gap-2">
            <span aria-hidden className="text-[0.7em]">•</span>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
