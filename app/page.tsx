import Contact from "@/components/Contact";
import CustomCursor from "@/components/CustomCursor";
import FloatingPlayer from "@/components/FloatingPlayer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoadingScreen from "@/components/LoadingScreen";
import Projects from "@/components/Projects";
import Statement from "@/components/Statement";

export default function Page() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Header />
      <main className="relative z-0 m-0 p-0">
        <Hero />
        {/* Scroll buffer — gives the sticky hero one viewport of scroll to
            scrub its video from first to last frame before Statement starts
            entering the viewport from below. */}
        <div aria-hidden className="h-screen w-full pointer-events-none" />
        <Statement />
        <Projects />
        <Contact />
      </main>

      <FloatingPlayer />
    </>
  );
}
