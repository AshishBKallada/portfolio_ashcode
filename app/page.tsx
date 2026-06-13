import Contact from "@/components/Contact";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";
import Projects from "@/components/Projects";
import SectionCounter from "@/components/SectionCounter";
import Statement from "@/components/Statement";

export default function Page() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Header />
      <SectionCounter />

      <main className="relative bg-white">
        <div className="relative">
          <Hero />
          <Statement />
        </div>
        <Projects />
        <Contact />
      </main>
    </>
  );
}
