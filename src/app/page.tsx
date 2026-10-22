import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { StoryProgress } from "@/components/layout/StoryProgress";
import { ProjectIndex } from "@/components/signal/Sections";
import { HeroStage, SignalAbout } from "@/components/signal/SignalAbout";
import { SignalNav } from "@/components/signal/SignalNav";
import { SkyHero } from "@/components/signal/SkyHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <StoryProgress />
      <SignalNav />
      <HeroStage hero={<SkyHero />}>
        <SignalAbout />
        <div className="relative bg-background text-foreground">
          <div className="relative">
            <ProjectIndex />
            <ContactStatement />
            <SiteFooter />
          </div>
        </div>
      </HeroStage>
    </>
  );
}
