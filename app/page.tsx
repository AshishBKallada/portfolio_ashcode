"use client";

import { useCallback, useLayoutEffect, useState } from "react";

import HeroSection from "./components/HeroSection";
import AboutMeSection from "./components/AboutMeSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import ProjectsSection from "./components/ProjectsSection";
import AppSidebar, {
  NAV_ITEMS,
  type SectionId,
} from "./components/AppSidebar";
import MainColumnMarquee from "./components/MainColumnMarquee";

const SECTION_IDS = new Set<SectionId>(NAV_ITEMS.map((item) => item.id));

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useLayoutEffect(() => {
    const raw = window.location.hash.slice(1);
    if (raw && SECTION_IDS.has(raw as SectionId)) {
      setActiveSection(raw as SectionId);
    }
  }, []);

  const onNavigate = useCallback((id: SectionId) => {
    setActiveSection(id);
    const path = window.location.pathname || "/";
    window.history.replaceState(null, "", id === "home" ? path : `#${id}`);
  }, []);

  useLayoutEffect(() => {
    document.getElementById("portfolio-main")?.scrollTo({ top: 0, left: 0 });
  }, [activeSection]);

  return (
    <div className="flex h-[100dvh] w-full min-h-0 flex-col bg-white md:flex-row">
      <AppSidebar activeSection={activeSection} onNavigate={onNavigate} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white pt-14 md:pt-0">
        <div
          id="portfolio-main"
          className={`flex min-h-0 flex-1 flex-col overflow-x-hidden md:pb-0 ${activeSection === "footer" || activeSection === "contact" ? "pb-0" : "pb-10"} ${activeSection === "contact" ? "overflow-y-hidden" : "overflow-y-auto"}`}
        >
          {activeSection === "home" && (
            <section
              id="home"
              className="flex h-full min-h-0 w-full flex-1 flex-col bg-[#e6362d]"
            >
              <HeroSection />
            </section>
          )}

          {activeSection === "about" && (
            <section id="about" className="relative min-h-0 w-full flex-1">
              <AboutMeSection />
            </section>
          )}

          {activeSection === "skills" && (
            <section className="relative min-h-0 w-full flex-1 bg-white">
              <SkillsSection />
            </section>
          )}

          {activeSection === "works" && (
            <section className="relative flex h-full min-h-0 w-full flex-1 flex-col bg-white">
              <ProjectsSection />
            </section>
          )}

          {activeSection === "contact" && (
            <section className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
              <ContactSection />
            </section>
          )}

          {activeSection === "blog" && (
            <section className="relative flex min-h-full w-full flex-1 flex-col">
              <BlogSection />
            </section>
          )}

          {activeSection === "experience" && (
            <section className="relative min-h-0 w-full flex-1">
              <ExperienceSection />
            </section>
          )}

          {activeSection === "footer" && (
            <section
              id="footer"
              className="relative flex min-h-0 w-full flex-1 flex-col bg-[#e6362d]"
            >
              <Footer />
            </section>
          )}

          <CustomCursor />
        </div>

        <MainColumnMarquee />
      </main>
    </div>
  );
}
