import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { HeroIntroPin } from "@/components/sections/HeroIntroPin";
import { LinkedIn } from "@/components/sections/LinkedIn";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <HeroIntroPin />
      <div className="relative z-30 bg-background">
        <About />
        <Work />
        <LinkedIn />
        <Contact />
      </div>
    </>
  );
}
