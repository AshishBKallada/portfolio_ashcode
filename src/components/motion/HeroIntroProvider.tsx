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
  zoomMs: 800,
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
    setPhase("cycle");
    const { cycleMs, zoomMs, textMs } = heroIntroTiming;
    timersRef.current = [
      window.setTimeout(() => setPhase("zoom"), cycleMs),
      window.setTimeout(() => setPhase("text"), cycleMs + zoomMs),
      window.setTimeout(() => setPhase("done"), cycleMs + zoomMs + textMs),
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
