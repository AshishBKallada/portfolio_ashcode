"use client";

import { type RefObject, useEffect } from "react";
import { startRobot } from "./scene";

/**
 * Starts the robot once its section is within a screen of view (its models
 * are ~14 MB) and tears it down on unmount.
 */
export function useRobot(
  host: RefObject<HTMLElement | null>,
  canvas: RefObject<HTMLCanvasElement | null>,
  copy: RefObject<HTMLElement | null>,
  loader: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const els = { host: host.current, canvas: canvas.current, copy: copy.current, loader: loader.current };
    if (!els.host || !els.canvas || !els.copy || !els.loader) return;
    let stop: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || stop) return;
        io.disconnect();
        stop = startRobot(els as Parameters<typeof startRobot>[0]);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(els.host);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [host, canvas, copy, loader]);
}
