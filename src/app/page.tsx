import { BackToTop } from "@/components/layout/BackToTop";
import { NavbarBar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StoryProgress } from "@/components/layout/StoryProgress";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { Collection } from "@/components/sections/Collection";
import { Pantheon } from "@/components/sections/Pantheon";

export default function Home() {
  return (
    <>
      <NavbarBar />
      <BackToTop />
      <StoryProgress />
      <div className="relative">
        <HeroIntroPin />
        <div className="relative bg-wall">
          <Pantheon />
          <Collection />
          <ContactStatement />
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
