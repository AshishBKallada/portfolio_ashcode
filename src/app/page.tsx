import { About } from "@/components/sections/About";
import { Aphorism } from "@/components/sections/Aphorism";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { LinkedIn } from "@/components/sections/LinkedIn";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10 -mt-svh bg-background">
        <About />
        <Work />
        <LinkedIn />
        <Contact />
        <Aphorism />
      </div>
    </>
  );
}
