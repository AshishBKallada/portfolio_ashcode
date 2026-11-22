"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/** Scrolls the page to `y` px: smoothly through Lenis when it runs, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (y: number) => {
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    [lenis],
  );
}
