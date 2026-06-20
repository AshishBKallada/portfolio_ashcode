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

      <main className="relative">
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
