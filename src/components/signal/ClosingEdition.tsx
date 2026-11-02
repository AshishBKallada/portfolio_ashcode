import { SiteFooter } from "@/components/layout/SiteFooter";

/**
 * The close of the home page, over the Studio painting held behind it
 * (StudioEdition): the contact + footer card, just below Studio's text,
 * beside the rail's open column.
 */
export function ClosingEdition() {
  return (
    <div data-nav-theme="dark" className="relative">
      <SiteFooter besideRail />
    </div>
  );
}
