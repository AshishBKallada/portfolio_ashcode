import type { Metadata } from "next";
import { BackToTop } from "@/components/signal/BackToTop";
import { HomeLayout } from "@/components/signal/HomeLayout";
import { SignalNav } from "@/components/signal/SignalNav";
import { TunnelHero } from "@/components/signal/TunnelHero";
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
      {/* The earlier heroes (SkyHero) and sections (EditionWork, ListTransition, ClosingEdition) are kept but not shown. */}
      <HomeLayout hero={<TunnelHero />}>
        <AboutSection />
        <WorkSection />
        <LinkedInSection />
        <ContactSection />
        <QuietFooter />
      </HomeLayout>
    </>
  );
}
