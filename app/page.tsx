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
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";
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
      {/* <Navbar /> */}

      <section
        id="home"
        className="sticky top-0 z-0 h-screen w-full min-h-0"
      >
        <HeroSection />
      </section>

      <section id="about" className="relative z-10 w-full">
        <AboutMeSection />
      </section>

      <section className="relative w-full bg-white z-20">
        <SkillsSection />
        <ContactSection />
        {/* <SkillsSection2 /> */}
        {/* <CameraSection /> */}
        {/* <MinimalSection /> */}
        <BlogSection />
        <ExperienceSection />
        <Footer />
      </section>
      {/* <StickyBottomBar /> */}
      <CustomCursor />
    </main>
  );
}
