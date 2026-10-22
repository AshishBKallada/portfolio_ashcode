import { AnchorLink } from "@/components/motion/AnchorLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { Dot } from "@/components/signal/primitives";
import { buttonSolid } from "@/components/ui/buttonStyles";
import { site } from "@/data/site";

/** CTA row under the hero statement: solid button, dashed rule, tag list. */
export function HeroCta() {
  return (
    <div className="mt-5 flex flex-wrap items-stretch gap-4 sm:gap-6">
      <Magnetic className="shrink-0">
        <AnchorLink href={site.hero.cta.href} className={buttonSolid}>
          <Dot />
          {site.hero.cta.label}
        </AnchorLink>
      </Magnetic>

      <span aria-hidden className="hidden w-px self-stretch border-l border-dashed border-ink/40 sm:block" />

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 font-sans text-[13px] text-ink sm:text-sm">
        {site.hero.tags.map((tag) => (
          <li key={tag} className="flex items-center gap-2">
            <Dot className="bg-ink" />
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
