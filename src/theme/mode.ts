"use client";

import { useSyncExternalStore } from "react";

/** Page background: the default red, or white from the navbar switch. */
export type PageMode = "white" | "red";

const KEY = "page-mode";

/**
 * Runs inline in <head> before first paint, so a saved white page never
 * flashes red. Keep it in sync with `setPageMode`.
 */
export const pageModeScript = `try{if(localStorage.getItem("${KEY}")==="white")document.documentElement.dataset.theme="white"}catch(e){}`;

const read = (): PageMode =>
  document.documentElement.dataset.theme === "white" ? "white" : "red";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

export function setPageMode(mode: PageMode) {
  const root = document.documentElement;
  if (mode === "white") root.dataset.theme = "white";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* private mode: the choice just won't persist */
  }
}

/** The current page mode, kept live as the switch flips it. Red on the server. */
export function usePageMode(): PageMode {
  return useSyncExternalStore(subscribe, read, () => "red");
}
