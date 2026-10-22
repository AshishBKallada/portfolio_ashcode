"use client";

import { useSyncExternalStore } from "react";

/** Page background: the default white, or red from the navbar switch. */
export type PageMode = "white" | "red";

const KEY = "page-mode";

/**
 * Runs inline in <head> before first paint, so a saved red page never
 * flashes white. Keep it in sync with `setPageMode`.
 */
export const pageModeScript = `try{if(localStorage.getItem("${KEY}")==="red")document.documentElement.dataset.theme="red"}catch(e){}`;

const read = (): PageMode =>
  document.documentElement.dataset.theme === "red" ? "red" : "white";

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

/** The current page mode, kept live as the switch flips it. White on the server. */
export function usePageMode(): PageMode {
  return useSyncExternalStore(subscribe, read, () => "white");
}
