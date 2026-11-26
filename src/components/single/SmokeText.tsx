"use client";

import { Fragment, useEffect, useRef } from "react";
import { smokeField } from "@/lib/smokeField";

/**
 * Text set as single letters, so the plane's smoke can stain them one by one. Words stay
 * unbroken for wrapping; screen readers get the plain string. Coloured by useSmokeScatter.
 */
export function SmokeText({ children }: { children: string }) {
  const words = children.split(/(\s+)/);
  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((w, i) =>
          /^\s+$/.test(w) ? (
            <Fragment key={i}>{w}</Fragment>
          ) : (
            <span key={i} className="inline-block whitespace-nowrap">
              {[...w].map((ch, j) => (
                <span key={j} data-smoke-letter>
                  {ch}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </>
  );
}

type Letter = { el: HTMLElement; x: number; y: number; base: [number, number, number]; soot: number };

/** The colour smoke leaves on a letter it passes over: a warm sooty grey. */
const SOOT: [number, number, number] = [58, 52, 46];

function rgb(c: string): [number, number, number] {
  const m = c.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [255, 255, 255];
}

/**
 * Stains the letters inside `scope` where the plane's smoke drifts over them: each letter darkens
 * toward soot by how deeply a puff covers it, only where it covers, and clears slowly once the
 * smoke has gone. Colour only; nothing moves.
 */
export function useSmokeScatter(scope: React.RefObject<HTMLElement | null>) {
  const letters = useRef<Letter[]>([]);

  useEffect(() => {
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const measure = () => {
      const els = [...root.querySelectorAll<HTMLElement>("[data-smoke-letter]")];
      letters.current = els.map((el, i) => {
        const prev = letters.current[i];
        el.style.color = "";
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2, y: r.top + r.height / 2, base: rgb(getComputedStyle(el).color), soot: prev?.soot ?? 0 };
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    // The card settles into place after the boot screen; read it again once it has.
    const late = window.setTimeout(measure, 4000);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { puffs, count } = smokeField;
      for (const L of letters.current) {
        let cover = 0;
        for (let k = 0; k < count; k++) {
          const dx = L.x - puffs[k * 3];
          const dy = L.y - puffs[k * 3 + 1];
          const r = puffs[k * 3 + 2];
          const d2 = dx * dx + dy * dy;
          if (d2 > r * r) continue;
          cover = Math.max(cover, 1 - Math.sqrt(d2) / r);
        }
        // Stains quickly, clears slowly.
        const target = Math.min(1, cover * 1.6);
        L.soot = target > L.soot ? L.soot + (target - L.soot) * Math.min(1, dt * 10) : L.soot * Math.pow(0.35, dt);
        if (L.soot < 0.01) {
          if (L.el.style.color) L.el.style.color = "";
          L.soot = 0;
          continue;
        }
        const t = L.soot * 0.9;
        const c = L.base.map((b, i) => Math.round(b + (SOOT[i] - b) * t));
        L.el.style.color = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(late);
      letters.current.forEach((L) => (L.el.style.color = ""));
    };
  }, [scope]);
}
