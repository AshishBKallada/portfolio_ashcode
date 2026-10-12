import { AnchorLink } from "@/components/motion/AnchorLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { buttonOutline } from "@/components/ui/buttonStyles";
import { site } from "@/data/site";

/** CTA row under the hero statement: outline button, dashed rule, tag list. */
export function HeroCta() {
  return (
    <div className="mt-5 flex flex-wrap items-stretch gap-4 sm:gap-6">
      <Magnetic className="shrink-0">
      <AnchorLink
        href={site.hero.cta.href}
        className={buttonOutline}
      >
        {site.hero.cta.label}
        <span aria-hidden>↗</span>
      </AnchorLink>
      </Magnetic>

      <span
        aria-hidden
        className="hidden w-px self-stretch border-l border-dashed border-cream/40 sm:block"
      />

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-[13px] text-cream/85 sm:text-sm">
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
