import type { Metadata } from "next";
import { EditionWork } from "@/components/signal/EditionSections";
import { HeroAboutMobile } from "@/components/signal/HeroAboutMobile";
import { ClosingEdition } from "@/components/signal/ClosingEdition";
import { BackToTop } from "@/components/signal/BackToTop";
import { CornerPlayer } from "@/components/signal/CornerPlayer";
import { ListTransition } from "@/components/signal/ListTransition";
import { HeroStage } from "@/components/signal/SignalAbout";
import { SignalNav } from "@/components/signal/SignalNav";
import { SkyHero } from "@/components/signal/SkyHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SignalNav />
      <CornerPlayer />
      <BackToTop />
      {/* A second hero, HeroSection2 (components/hero2: the holographic cloth), is kept but not shown. */}
      {/* Work follows the Editions chapter layout; About copy lives in the hero nav card (flip). */}
      <HeroStage hero={<SkyHero />}>
        <HeroAboutMobile />
        <EditionWork />
        <ListTransition />
        {/* Contact lives in the Index's about view (ListTransition); then the footer. */}
        <ClosingEdition />
      </HeroStage>
    </>
  );
}
