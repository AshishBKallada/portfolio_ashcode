"use client";

import { useEffect, useState } from "react";
import { OVER_HERO_THRESHOLD_PX } from "@/lib/theme";

export function useOverHero() {
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const measure = () => {
      const statement = document.getElementById("statement");
      if (!statement) return;
      setOverHero(statement.getBoundingClientRect().top > OVER_HERO_THRESHOLD_PX);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("loader:done", measure, { once: true });

    return () => window.removeEventListener("scroll", measure);
  }, []);

  return overHero;
}
