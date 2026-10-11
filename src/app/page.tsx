import { BackToTop } from "@/components/layout/BackToTop";
import { NavbarBar } from "@/components/layout/Navbar";
import { SideCutouts } from "@/components/layout/SideCutouts";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { About } from "@/components/sections/About";
// import { ContactFooterPin } from "@/components/sections/ContactFooterPin";
import { ContactStatement } from "@/components/sections/ContactStatement";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { Projects } from "@/components/sections/Projects";
import { site } from "@/data/site";
// import { LinkedIn } from "@/components/sections/LinkedIn";
// import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <NavbarBar />
      <BackToTop />
      <SideCutouts />
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
          {/* <Work /> — hidden while the redesign is explored */}
          {/* <LinkedIn /> — hidden for now */}
        </div>
      </div>
      {/* <ContactFooterPin /> — hidden while the redesign is explored */}
    </>
  );
}
