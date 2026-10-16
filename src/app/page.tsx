import type { Metadata } from "next";
import { BackToTop } from "@/components/layout/BackToTop";
import { NavbarBar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StoryProgress } from "@/components/layout/StoryProgress";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { Projects } from "@/components/sections/Projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <NavbarBar />
      <BackToTop />
      <StoryProgress />
      <div className="relative">
        <HeroIntroPin />
        <div
          className="bg-brand theme-light relative"
        >
          <Projects />
          <ContactStatement />
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
