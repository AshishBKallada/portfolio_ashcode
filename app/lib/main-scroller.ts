/** Home layout scrolls `#portfolio-main`; omit `scroller` to use the viewport. */
export function mainScrollScroller(): HTMLElement | undefined {
  if (typeof document === "undefined") return undefined;
  const el = document.getElementById("portfolio-main");
  return el instanceof HTMLElement ? el : undefined;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const SCROLL_LOCK_EVENT = "portfolio:scroll-lock";
export const SCROLL_UNLOCK_EVENT = "portfolio:scroll-unlock";

/** Locks Lenis / `#portfolio-main` scroll while overlays (modals) are open. */
export function lockPageScroll(): () => void {
  if (typeof window === "undefined") return () => {};

  window.dispatchEvent(new CustomEvent(SCROLL_LOCK_EVENT));

  const scroller = mainScrollScroller();
  const prevOverflow = scroller?.style.overflow ?? "";
  const prevTouchAction = scroller?.style.touchAction ?? "";

  if (scroller) {
    scroller.style.overflow = "hidden";
    scroller.style.touchAction = "none";
  }

  const prevBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const prevent = (e: Event) => e.preventDefault();
  scroller?.addEventListener("wheel", prevent, { passive: false });
  scroller?.addEventListener("touchmove", prevent, { passive: false });
  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });

  return () => {
    window.dispatchEvent(new CustomEvent(SCROLL_UNLOCK_EVENT));

    if (scroller) {
      scroller.style.overflow = prevOverflow;
      scroller.style.touchAction = prevTouchAction;
      scroller.removeEventListener("wheel", prevent);
      scroller.removeEventListener("touchmove", prevent);
    }

    document.body.style.overflow = prevBodyOverflow;
    window.removeEventListener("wheel", prevent);
    window.removeEventListener("touchmove", prevent);
  };
}
