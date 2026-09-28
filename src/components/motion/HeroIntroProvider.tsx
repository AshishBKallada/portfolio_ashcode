"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type IntroPhase = "loading" | "cycle" | "zoom" | "text" | "done";

type IntroContextValue = {
  phase: IntroPhase;
  markLoaded: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  phase: "done",
  markLoaded: () => {},
});

export const heroIntroTiming = {
  cycleMs: 3000,
  // Covers the figure flight + backdrop reveal in HeroOverlay's timeline.
  zoomMs: 1900,
  textMs: 1100,
} as const;

export function HeroIntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isHomeRef = useRef(isHome);
  useEffect(() => {
    isHomeRef.current = isHome;
  }, [isHome]);

  const [phase, setPhase] = useState<IntroPhase>("loading");
  const timersRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  const markLoaded = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!isHomeRef.current) {
      setPhase("done");
      return;
    }
    // Image cycle runs in SiteLoader; hero picks up at zoom.
    setPhase("zoom");
    const { zoomMs, textMs } = heroIntroTiming;
    timersRef.current = [
      window.setTimeout(() => setPhase("text"), zoomMs),
      window.setTimeout(() => setPhase("done"), zoomMs + textMs),
    ];
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  return (
    <IntroContext.Provider value={{ phase, markLoaded }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useHeroIntro() {
  return useContext(IntroContext);
}
