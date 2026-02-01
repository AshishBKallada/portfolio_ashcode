"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutMeSection from "./components/AboutMeSection";
import SkillsSection2 from "./components/SkillsSection2";
import MinimalSection from "./components/MinimalSection";
import ExperienceSection from "./components/ExperienceSection";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import CameraSection from "./components/CameraSection";
import BlogSection from "./components/BlogSection";
import Projects2 from "./components/Projects2";
import SkillsSection from "./components/SkillsSection";
import StickyBottomBar from "./components/StickyBottomBar";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="absolute w-full min-h-screen bg-white">
      <Navbar />

      <section
        id="home"
        className="sticky top-0 h-screen w-full flex items-center justify-center z-0"
      >
        <HeroSection />
      </section>

      <section
        id="about"
        className="relative min-h-screen w-full flex items-center justify-center bg-white text-black z-10"
      >
        <AboutMeSection />
      </section>

      <section className="relative w-full bg-white z-20">
        <SkillsSection />
        {/* <SkillsSection2 /> */}
        {/* <CameraSection /> */}
        <Projects2 /> 
        {/* <MinimalSection /> */}
        <BlogSection />
        <ExperienceSection />
        <Footer />
      </section>
      <StickyBottomBar />
      <CustomCursor />
    </main>
  );
}
