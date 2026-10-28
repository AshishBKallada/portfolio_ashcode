"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NavChromePhase = "hero" | "morphing" | "rail";

type NavChromeContextValue = {
  phase: NavChromePhase;
  morphRail: boolean;
  completeMorph: () => void;
};

const NavChromeContext = createContext<NavChromeContextValue | null>(null);

const DESKTOP_MQ = "(min-width: 768px)";
export const NAV_MORPH_MS = 620;

/** Mobile: rail when About has scrolled over the hero (unchanged). Not tracked on desktop. */
function useAboutOverHero(enabled: boolean) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || pathname !== "/") {
      setActive(false);
      return;
    }

    const about = document.getElementById("about");
    if (!about) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      setActive(about.getBoundingClientRect().top <= 72);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, pathname]);

  return active;
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function NavChromeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const desktop = useDesktop();
  const mobileRail = useAboutOverHero(!desktop);
  const home = pathname === "/";

  const [phase, setPhase] = useState<NavChromePhase>("hero");

  // The page keeps scrolling while the nav morphs; nothing is locked.
  const beginMorph = useCallback(() => setPhase("morphing"), []);
  const completeMorph = useCallback(() => setPhase("rail"), []);

  useEffect(() => {
    if (!home) {
      setPhase("hero");
      return;
    }
    if (desktop && window.scrollY > 96) setPhase("rail");
    else if (desktop) setPhase("hero");
  }, [home, desktop]);

  // Desktop home: the first scroll down morphs the nav into the rail.
  useEffect(() => {
    if (!home || !desktop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Only a downward scroll starts the morph, so easing back to the top doesn't re-trigger it.
    let last = window.scrollY;
    const tryBegin = () => {
      const y = window.scrollY;
      const down = y > last;
      last = y;
      if (phase !== "hero" || !down || y <= 8) return;
      if (reduced) setPhase("rail");
      else beginMorph();
    };

    window.addEventListener("scroll", tryBegin, { passive: true });
    return () => window.removeEventListener("scroll", tryBegin);
  }, [home, desktop, phase, beginMorph]);

  // Fallback if layout animation completion does not fire.
  useEffect(() => {
    if (phase !== "morphing") return;
    const t = window.setTimeout(completeMorph, NAV_MORPH_MS + 100);
    return () => window.clearTimeout(t);
  }, [phase, completeMorph]);

  // Back to the centred card when scrolling up into the top of the hero.
  useEffect(() => {
    if (!home || !desktop || phase !== "rail") return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const up = y < last;
      last = y;
      if (y < 4 || (up && y < window.innerHeight * 0.25)) setPhase("hero");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home, desktop, phase]);

  // Reserve content gutter only once the rail is active (desktop home).
  useEffect(() => {
    const rail = home && desktop && phase === "rail";
    document.documentElement.dataset.navRail = rail ? "true" : "false";
    return () => {
      document.documentElement.dataset.navRail = "false";
    };
  }, [home, desktop, phase]);

  useEffect(() => {
    if (!home) document.documentElement.dataset.navRail = "false";
  }, [home]);

  const morphRail = home && (desktop ? phase !== "hero" : mobileRail);

  const value = useMemo(
    () => ({ phase, morphRail, completeMorph }),
    [phase, morphRail, completeMorph],
  );

  return <NavChromeContext.Provider value={value}>{children}</NavChromeContext.Provider>;
}

export function useNavChrome() {
  const ctx = useContext(NavChromeContext);
  if (!ctx) {
    throw new Error("useNavChrome must be used within NavChromeProvider");
  }
  return ctx;
}
