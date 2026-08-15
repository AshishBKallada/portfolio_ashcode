import { About } from "@/components/sections/About";
import { ContactFooterPin } from "@/components/sections/ContactFooterPin";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { LinkedIn } from "@/components/sections/LinkedIn";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <div className="relative">
        <HeroIntroPin />
        <div className="relative z-20 bg-background">
          <About />
          <Work />
          <LinkedIn />
        </div>
      </div>
      <ContactFooterPin />
    </>
  );
}
