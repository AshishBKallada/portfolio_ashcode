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
      <main className="relative z-0 m-0 p-0">
        <Hero />
        <div aria-hidden className="h-screen min-h-screen shrink-0" />
        <div className="relative z-10">
          <Statement />
          <Projects />
          <Contact />
        </div>
      </main>
    </>
  );
}
