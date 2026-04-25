"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import ProjectShowcase from "./components/ProjectShowcase";
import SkillSection from "./components/SkillSection";
import StatementSection from "./components/StatementSection";
import CustomCursor from "./components/CustomCursor";
import AppSidebar, {
  NAV_ITEMS,
  type SectionId,
} from "./components/AppSidebar";
import MainColumnMarquee from "./components/MainColumnMarquee";

const SECTION_IDS = new Set<SectionId>(NAV_ITEMS.map((item) => item.id));

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const colorScheme = "light" as const;

  const onNavigate = useCallback((id: SectionId) => {
    setActiveSection(id);
    const path = window.location.pathname || "/";
    window.history.replaceState(null, "", id === "home" ? path : `#${id}`);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useLayoutEffect(() => {
    const raw = window.location.hash.slice(1) as SectionId;
    if (raw && SECTION_IDS.has(raw)) {
      requestAnimationFrame(() => {
        const el = document.getElementById(raw);
        if (el) {
          el.scrollIntoView({ block: "start" });
          setActiveSection(raw);
        }
      });
    }
  }, []);

  useEffect(() => {
    const root = document.getElementById("portfolio-main");
    if (!root) return;

    const pickActive = () => {
      const rootRect = root.getBoundingClientRect();
      const y = rootRect.top + rootRect.height * 0.3;
      let best: SectionId = "home";
      let bestScore = -Infinity;

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const visibleTop = Math.max(r.top, rootRect.top);
        const visibleBottom = Math.min(r.bottom, rootRect.bottom);
        const visible = Math.max(0, visibleBottom - visibleTop);
        if (visible < 8) continue;
        const center = (r.top + r.bottom) / 2;
        const score = visible - Math.abs(center - y) * 0.12;
        if (score > bestScore) {
          bestScore = score;
          best = id;
        }
      }

      setActiveSection((prev) => (prev === best ? prev : best));
    };

    root.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    pickActive();
    return () => {
      root.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, []);

  const shellBg = "bg-white";

  return (
    <div className={`relative flex h-[100dvh] w-full min-h-0 flex-col transition-colors duration-300 ${shellBg}`}>
      <main className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-colors duration-300 ${shellBg}`}>
        <div
          id="portfolio-main"
          className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[2.65rem] md:pb-[2.85rem]"
        >
          <section
            id="home"
            className="relative flex w-full shrink-0 flex-col bg-white transition-colors duration-300"
          >
            {/* Sticky hero: later sections scroll over it (higher z-index + opaque bg). */}
            <div className="sticky top-0 z-0 min-h-[100dvh] w-full shrink-0">
              <HeroSection colorScheme="dark" />
            </div>
            <div className="relative z-10 flex w-full flex-col isolate">
              <StatementSection colorScheme="dark" className="-mt-[20vh] md:-mt-[24vh] lg:-mt-[28vh]" />
         
              <SkillSection colorScheme="dark" />
              <div className="relative min-h-[200dvh]">
                <ProjectShowcase
                  colorScheme="dark"
                  className="sticky top-0 z-0 min-h-[100dvh]"
                />
              </div>
            </div>
          </section>

          <section
            id="footer"
            className="relative z-30 -mt-[24vh] w-full shrink-0 md:-mt-[26vh] lg:-mt-[30vh]"
          >
            <Footer colorScheme="dark" />
          </section>

          <CustomCursor />
        </div>
      </main>

      <AppSidebar onNavigate={onNavigate} />

      <MainColumnMarquee colorScheme="dark" />
    </div>
  );
}
