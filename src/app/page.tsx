import type { Metadata } from "next";
import { EditionAbout, EditionWork } from "@/components/signal/EditionSections";
import { ClosingEdition } from "@/components/signal/ClosingEdition";
import { CornerPlayer } from "@/components/signal/CornerPlayer";
import { ListTransition } from "@/components/signal/ListTransition";
import { HeroStage } from "@/components/signal/SignalAbout";
import { SignalNav } from "@/components/signal/SignalNav";
import { StudioEdition } from "@/components/signal/StudioEdition";
import { SkyHero } from "@/components/signal/SkyHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SignalNav />
      <CornerPlayer />
      {/* A second hero, HeroSection2 (components/hero2: the holographic cloth), is kept but not shown. */}
      {/* About and Work follow the Editions chapter layout; the earlier SignalAbout and ProjectIndex are kept but not shown. */}
      <HeroStage hero={<SkyHero />}>
        <EditionAbout />
        <EditionWork />
        <ListTransition />
        {/* Studio, tucked a screen up over the end of the Index (z-[2] over its z-[1]) so its painting erodes in over the held Index, and is then held behind the close and the contact + footer card.
            The painted ContactEdition and the cream ContactStatement are kept but not shown. */}
        <div className="signal-rail-bleed relative z-[2] -mt-[100svh]">
          <StudioEdition>
            <ClosingEdition />
          </StudioEdition>
        </div>
      </HeroStage>
    </>
  );
}
