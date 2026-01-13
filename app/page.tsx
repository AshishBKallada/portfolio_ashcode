"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutMeSection from "./components/AboutMeSection";
import SkillsSection from "./components/SkillsSection";
import MinimalSection from "./components/MinimalSection";
import ProjectsSection from "./components/ProjectsSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import MarqueeSection from "./components/MarqueeSection";
import CameraSection from "./components/CameraSection";
import BlogSection from "./components/BlogSection";

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
    <main className="relative w-full min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />

      {/* 1st Screen: Sticky Hero background */}
      <section
        id="home"
        className="sticky top-0 h-screen w-full flex items-center justify-center z-0"
      >
        <HeroSection />
      </section>

      {/* 2nd Screen: About Me scrolling over Hero */}
      <section
        id="about"
        className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-zinc-950 text-black dark:text-white z-10"
      >
        <AboutMeSection />
      </section>

      {/* Remaining sections */}
      <section className="relative w-full bg-zinc-50 dark:bg-black z-20">
        <SkillsSection />
        <MinimalSection />
        <ProjectsSection />
        <CameraSection />

        <BlogSection />

        <ExperienceSection />
        <ContactSection />
        <MarqueeSection />
        <Footer />
      </section>
      <CustomCursor />
    </main>
  );
}
