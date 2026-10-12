import { BackToTop } from "@/components/layout/BackToTop";
import { NavbarBar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StoryProgress } from "@/components/layout/StoryProgress";
import { About } from "@/components/sections/About";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { Projects } from "@/components/sections/Projects";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <NavbarBar />
      <BackToTop />
      <StoryProgress />
      <div className="relative">
        <HeroIntroPin />
        <div
          style={{ backgroundColor: site.navbar.bg }}
          className="theme-light relative"
        >
          <About />
          <Projects />
          <ContactStatement />
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
