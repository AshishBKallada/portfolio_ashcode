"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * True while the pinned hero is fully covered (HeroStage's data-covered). The
 * hero stays sticky under the whole page, so an IntersectionObserver alone
 * keeps reporting it on screen; this lets its loops stop once it's hidden.
 */
export function useHeroCovered(ref: RefObject<Element | null>) {
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const stage = ref.current?.closest<HTMLElement>(".hero-stage");
    if (!stage) return;
    const read = () => setCovered(stage.dataset.covered === "true");
    read();
    const mo = new MutationObserver(read);
    mo.observe(stage, { attributes: true, attributeFilter: ["data-covered"] });
    return () => mo.disconnect();
  }, [ref]);

  return covered;
}
