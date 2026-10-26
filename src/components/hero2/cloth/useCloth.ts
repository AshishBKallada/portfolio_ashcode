"use client";

import { type RefObject, useEffect } from "react";
import { startCloth, type ClothClasses } from "./startCloth";

/** Starts the cloth on mount and tears it down on unmount. */
export function useCloth(hero: RefObject<HTMLElement | null>, canvas: RefObject<HTMLCanvasElement | null>, classes: ClothClasses) {
  const { noCloth, over, held } = classes;
  useEffect(() => {
    if (!hero.current || !canvas.current) return;
    return startCloth(hero.current, canvas.current, { noCloth, over, held });
  }, [hero, canvas, noCloth, over, held]);
}
