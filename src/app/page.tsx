import type { Metadata } from "next";
import { BackToTop } from "@/components/signal/BackToTop";
import { HomeLayout } from "@/components/signal/HomeLayout";
import { AwakeningHero } from "@/components/signal/awakening/AwakeningHero";
import { AWAKENING_RUNWAY_SVH, AWAKENING_TRAVEL_SVH } from "@/components/signal/awakening/timeline";
import { SignalNav } from "@/components/signal/SignalNav";
import { AboutSection } from "@/components/signal/home/AboutSection";
import { ContactSection } from "@/components/signal/home/ContactSection";
import { LinkedInSection } from "@/components/signal/home/LinkedInSection";
import { QuietFooter } from "@/components/signal/home/QuietFooter";
import { WorkSection } from "@/components/signal/home/WorkSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SignalNav />
      <BackToTop />
      {/* The earlier heroes (SkyHero, TunnelHero) and sections (EditionWork, ListTransition, ClosingEdition) are kept but not shown. */}
      <HomeLayout
        hero={<AwakeningHero />}
        runwaySvh={AWAKENING_RUNWAY_SVH}
        travelSvh={AWAKENING_TRAVEL_SVH}
        seam={
          // The crimson hero bleeds into the page as the sheet rises over it.
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[28svh] h-[28svh] bg-gradient-to-b from-transparent via-[#30050b]/40 to-background"
          />
        }
      >
        <AboutSection />
        <WorkSection />
        <LinkedInSection />
        <ContactSection />
        <QuietFooter />
      </HomeLayout>
    </>
  );
}
