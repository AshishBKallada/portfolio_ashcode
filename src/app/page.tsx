import type { Metadata } from "next";
import { BackToTop } from "@/components/signal/BackToTop";
import { AwakeningHero } from "@/components/signal/awakening/AwakeningHero";
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
      {/* A plain first screen: no pin, no scroll effects. */}
      <div className="h-[100svh]">
        <AwakeningHero />
      </div>
      <div className="relative bg-background text-ink">
        <AboutSection />
        <WorkSection />
        <LinkedInSection />
        <ContactSection />
        <QuietFooter />
      </div>
    </>
  );
}
