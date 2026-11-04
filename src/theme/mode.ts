"use client";

import { useSyncExternalStore } from "react";
import { PAGE_MODE_KEY as KEY } from "./mode-script";

/** Page background: the default cream, or red from the navbar switch. */
export type PageMode = "cream" | "red";

const read = (): PageMode => (document.documentElement.dataset.theme === "red" ? "red" : "cream");

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

export function setPageMode(mode: PageMode) {
  const root = document.documentElement;
  if (mode === "red") root.dataset.theme = "red";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* private mode: the choice just won't persist */
  }
}

/** The current page mode, kept live as the switch flips it. Cream on the server. */
export function usePageMode(): PageMode {
  return useSyncExternalStore(subscribe, read, () => "cream");
}
