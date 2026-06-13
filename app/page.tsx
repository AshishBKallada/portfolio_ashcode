import AudioToggle from "@/components/AudioToggle";
import Contact from "@/components/Contact";
import CustomCursor from "@/components/CustomCursor";
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
      <AudioToggle />

      <audio id="bg-audio" loop preload="none" src="/audio/canta-de-luna.mp3" />

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
