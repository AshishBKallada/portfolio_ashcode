import { RevealItem } from "@/components/motion/Reveal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { site } from "@/data/site";
import { DropCap } from "./Editions";
import { frame } from "./primitives";

const copy = site.contactStatement;

/**
 * The close of the home page, over the Studio painting held behind it
 * (StudioEdition): the closing line in the drop-cap serif, then the contact +
 * footer card stacking over the painting, beside the rail's open column.
 */
export function ClosingEdition() {
  return (
    <div data-nav-theme="dark" className="relative">
      <div className={`${frame} relative flex min-h-[45svh] flex-col justify-end pb-[clamp(4rem,10vh,7rem)] text-cream md:pl-[calc(var(--nav-sidebar-w)+1.5rem)]`}>
        <h2 className="sr-only">
          {copy.lines.join(" ")} {copy.script}
        </h2>
        <RevealItem>
          <p
            aria-hidden
            className="max-w-[62rem] text-[clamp(2.6rem,5.6vw,5.5rem)] leading-[0.98] text-balance [text-shadow:0_4px_40px_rgba(0,0,0,0.45)]"
          >
            <DropCap>{`${copy.lines.join(" ")} ${copy.script}.`}</DropCap>
          </p>
        </RevealItem>
      </div>

      <SiteFooter besideRail />
    </div>
  );
}
