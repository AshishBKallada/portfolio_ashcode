import * as THREE from "three";

/** The robot's colours, read from the site theme (the navbar's red/white switch). */
export type RobotPalette = {
  /** The page behind the robot. */
  page: THREE.Color;
  /** Eyes, antenna lights and edge light: the theme's script colour (cream on red, flame on white). */
  accent: THREE.Color;
};

const read = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export function readPalette(): RobotPalette {
  return {
    page: new THREE.Color(read("--background", "#ec4726")),
    accent: new THREE.Color(read("--color-script", "#f4f1ea")),
  };
}

/** Calls back whenever the theme switches. */
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
