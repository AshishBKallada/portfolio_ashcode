"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import ProjectShowcase from "./components/ProjectShowcase";
import SkillSection from "./components/SkillSection";
import StatementSection from "./components/StatementSection";
import CustomCursor from "./components/CustomCursor";
import AppSidebar from "./components/AppSidebar";
import { NAV_ITEMS, type SectionId } from "./lib/nav-items";
import MainColumnMarquee from "./components/MainColumnMarquee";

const SECTION_IDS = new Set<SectionId>(NAV_ITEMS.map((item) => item.id));

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

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
    const wrapper = document.getElementById("portfolio-main");
    const content = document.getElementById("portfolio-content");
    if (!wrapper || !content) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
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

  const shellBg = "bg-transparent";

  return (
    <div className={`relative flex h-[100dvh] w-full min-h-0 flex-col transition-colors duration-300 ${shellBg}`}>
      <main className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-colors duration-300 ${shellBg}`}>
        <div
          id="portfolio-main"
          className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[2.65rem] md:pb-[2.85rem]"
        >
          <div id="portfolio-content" className="flex w-full flex-col">
            <section
              id="home"
              className="relative flex w-full shrink-0 flex-col bg-transparent transition-colors duration-300"
            >
              {/* Sticky hero: later sections scroll over it (higher z-index + opaque bg). */}
              <div className="sticky top-0 z-0 min-h-[100dvh] w-full shrink-0">
                <HeroSection colorScheme="light" />
              </div>
              <div className="relative z-10 flex w-full flex-col isolate bg-transparent">
                <StatementSection colorScheme="light" className="-mt-[10vh] md:-mt-[18vh] lg:-mt-[28vh]" />
              </div>
              <div className="relative z-10 flex w-full flex-col bg-white text-neutral-950">
                <SkillSection colorScheme="light" />
                <div className="relative min-h-[100dvh] bg-white pb-[max(3rem,8vh)] lg:min-h-[200dvh] lg:pb-[max(4rem,14vh)]">
                  <ProjectShowcase
                    colorScheme="light"
                    className="relative min-h-[100dvh] bg-white lg:sticky lg:top-0 lg:z-0"
                  />
                </div>
              </div>
            </section>

            <section
              id="footer"
              className="relative z-30 -mt-[5vh] w-full shrink-0 md:-mt-[8vh] lg:-mt-[14vh]"
            >
              <Footer colorScheme="light" />
            </section>

            <CustomCursor />
          </div>
        </div>
      </main>

      <AppSidebar onNavigate={onNavigate} />

      <MainColumnMarquee />
    </div>
  );
}
