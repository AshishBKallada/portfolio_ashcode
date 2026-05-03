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
