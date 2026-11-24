"use client";

import { useEffect } from "react";

const IGNORE = "a, button, input, .sg-contact, .edition-nav, [data-no-collapse]";

/**
 * A tap on the open desert folds the LinkedIn and Projects rails down to their titles, and
 * another brings them back; tapping a folded rail opens it again. The rails' lists are taken
 * out of the tab order while folded. Escape does the same from the keyboard.
 */
export function TapToCollapse() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".single-screen");
    if (!root) return;

    const set = (collapsed: boolean) => {
      root.dataset.collapsed = String(collapsed);
      root.querySelectorAll<HTMLElement>(".sg-rail .sg-marquee").forEach((m) => {
        m.inert = collapsed;
      });
    };
    const isCollapsed = () => root.dataset.collapsed === "true";

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(".sg-rail")) {
        if (isCollapsed() && !target.closest("a")) set(false);
        return;
      }
      if (target.closest(IGNORE)) return;
      set(!isCollapsed());
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") set(!isCollapsed());
    };

    root.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
