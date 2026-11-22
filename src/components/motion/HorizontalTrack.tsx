"use client";

import { useLenis } from "lenis/react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * The home page laid out sideways on wide screens: the sections sit in one row,
 * pinned to the screen, and the ordinary vertical scroll (wheel, trackpad, keys,
 * Lenis) slides the row left, one px across for every px down. So the page keeps
 * a real scroll height (BackToTop, the nav's scroll checks and Lenis all still
 * work), and each section's scroll animations read their progress across the
 * row instead of down the page (useSectionProgress, usePinX). Phones keep the
 * vertical page.
 */

type Track = {
  /** How far the row has slid left, in px. */
  x: MotionValue<number>;
  /** The row, for measuring where a section sits along it. */
  row: RefObject<HTMLDivElement | null>;
  /** The whole run, in px: the row's width less one screen. */
  length: number;
};

const TrackContext = createContext<Track | null>(null);

const WIDE_MQ = "(min-width: 768px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** True on wide screens, where the home page runs sideways. True on the server: desktop is the default. */
export function useWideLayout() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_MQ).matches,
    () => true,
  );
}

/** How far the row has slid and its whole run, or null off the row. */
export function useTrack() {
  const track = useContext(TrackContext);
  return track ? { x: track.x, length: track.length } : null;
}

/** True inside the sideways row. */
export function useInTrack() {
  return useContext(TrackContext) !== null;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** An edge in a scroll offset ("start", "center", "end" or a 0–1 number) as a fraction. */
function edge(word: string) {
  if (word === "start") return 0;
  if (word === "center") return 0.5;
  if (word === "end") return 1;
  return Number.parseFloat(word);
}

type Offset = [string, string];

/** Where a section sits along the row (left, width) and the screen's width, kept fresh on resize. */
function useGeometry(ref: RefObject<HTMLElement | null>, track: Track | null) {
  const geo = useRef({ left: 0, width: 1, vw: 1 });
  useEffect(() => {
    const el = ref.current;
    const row = track?.row.current;
    if (!el || !row) return;
    const measure = () => {
      // Both boxes carry the row's slide, so their difference is the section's place along it.
      const r = el.getBoundingClientRect();
      const rr = row.getBoundingClientRect();
      geo.current = {
        left: r.left - rr.left,
        width: r.width,
        vw: window.innerWidth,
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(row);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, track]);
  return geo;
}

/**
 * A section's scroll progress, 0 to 1, with useScroll's offsets ("start end" = the
 * section's start meets the screen's end). Down the page on phones; across the row
 * on wide screens, where start/end are its left/right edges and the screen's.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  offset: Offset,
): MotionValue<number> {
  const track = useContext(TrackContext);
  // The vertical reading, used when there's no row.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });
  const geo = useGeometry(ref, track);
  const still = useMotionValue(0);
  const [[e0, v0], [e1, v1]] = offset.map((o) => o.split(" ").map(edge));
  return useTransform(
    [track?.x ?? still, scrollYProgress],
    ([x, vertical]: number[]) => {
      if (!track) return vertical;
      const { left, width, vw } = geo.current;
      const from = left + e0 * width - v0 * vw;
      const to = left + e1 * width - v1 * vw;
      return to === from
        ? x >= to
          ? 1
          : 0
        : clamp01((x - from) / (to - from));
    },
  );
}

/**
 * The sideways stand-in for position: sticky. A section wider than the screen holds its
 * content still while the row passes over it: this is how far to shift the content right,
 * from 0 as the section's left reaches the screen's to (width − screen) at its right.
 * Always 0 off the row.
 */
export function usePinX(
  ref: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const track = useContext(TrackContext);
  const geo = useGeometry(ref, track);
  const still = useMotionValue(0);
  return useTransform(track?.x ?? still, (x) => {
    if (!track) return 0;
    const { left, width, vw } = geo.current;
    return Math.min(Math.max(0, width - vw), Math.max(0, x - left));
  });
}

/** A panel of the row: full height, its width from className. Off the row, just its children. */
export function TrackPanel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  if (!useInTrack()) return <>{children}</>;
  return (
    <div className={`relative h-full shrink-0 ${className}`}>{children}</div>
  );
}

/** How far either side of a cut, as a share of the screen, the sweep is on screen. */
const CUT_REACH = 0.32;
/** Each cut's name in Japanese, set small over the big one. */
const CUT_JP: Record<string, string> = {
  Work: "作品",
  Notes: "記録",
  Contact: "連絡",
};

/**
 * The transition between screens: as each cut (an element marked data-cut="Name") nears,
 * a white sweep with curved sides crosses the screen right to left, faster than the row,
 * carrying the next screen's name in black (and in Japanese over it). It runs off the
 * scroll, so it plays both ways and only ever covers part of the screen.
 */
function Sweep({
  x,
  row,
}: {
  x: MotionValue<number>;
  row: RefObject<HTMLDivElement | null>;
}) {
  const cuts = useRef<{ at: number; label: string }[]>([]);
  const [label, setLabel] = useState("");
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const rr = el.getBoundingClientRect();
      const vw = window.innerWidth;
      // Centred on the moment the new screen's left edge is halfway across.
      cuts.current = Array.from(
        el.querySelectorAll<HTMLElement>("[data-cut]"),
      ).map((c) => ({
        at: c.getBoundingClientRect().left - rr.left - vw * 0.5,
        label: c.dataset.cut ?? "",
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [row]);

  // -1 as the nearest cut's window opens, 0 at the cut, 1 as it closes; beyond ±1 off screen.
  const near = (v: number) => {
    let best = cuts.current[0];
    for (const c of cuts.current)
      if (best && Math.abs(v - c.at) < Math.abs(v - best.at)) best = c;
    return best;
  };
  const phase = useTransform(x, (v) => {
    if (typeof window === "undefined") return 2;
    const c = near(v);
    return c ? (v - c.at) / (window.innerWidth * CUT_REACH) : 2;
  });
  useMotionValueEvent(x, "change", (v) => {
    const c = near(v);
    if (c && c.label !== label) setLabel(c.label);
  });
  // From just off the right to just off the left across the window.
  const sweepX = useTransform(
    phase,
    (p) => `${110 - ((Math.min(1.2, Math.max(-1.2, p)) + 1) / 2) * 200}vw`,
  );
  // The name lags inside the sweep, so it seems to slide over the white.
  const nameX = useTransform(
    phase,
    (p) => `${Math.min(1.2, Math.max(-1.2, p)) * -8}vw`,
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[55] overflow-hidden"
    >
      <motion.div
        style={{ x: sweepX }}
        className="absolute top-[-35vh] left-0 flex h-[170vh] w-[78vw] items-center justify-center rounded-[50%] bg-white text-black will-change-transform"
      >
        <motion.div style={{ x: nameX }} className="flex flex-col items-center">
          <span className="text-[min(3vw,6vh)] leading-none tracking-[0.5em] [font-family:'Hiragino_Mincho_ProN','Yu_Mincho','Noto_Serif_JP',serif]">
            {CUT_JP[label] ?? ""}
          </span>
          <span className="font-display text-[min(16vw,30vh)] leading-[0.9] uppercase">
            {label}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** The sideways row itself, with a thin progress line along the bottom. */
export function HorizontalTrack({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [length, setLength] = useState(0);
  const lenis = useLenis();
  const reduce = useReducedMotion() ?? false;

  // The run: the row's width less one screen. The page is that much taller than a screen.
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () =>
      setLength(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollY } = useScroll();
  const place = (y: number) => {
    const top = outer.current
      ? outer.current.getBoundingClientRect().top + window.scrollY
      : 0;
    x.set(Math.min(length, Math.max(0, y - top)));
  };
  useMotionValueEvent(scrollY, "change", place);
  useEffect(() => place(window.scrollY));

  // In-page links (#index, #contact…) scroll to where their section comes into view.
  // The page scroll that brings a row element to the screen's left edge, or null off the row.
  const yFor = useCallback(
    (hash: string) => {
      if (!row.current || !outer.current || !hash) return null;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target || !row.current.contains(target)) return null;
      const left =
        target.getBoundingClientRect().left -
        row.current.getBoundingClientRect().left;
      const top = outer.current.getBoundingClientRect().top + window.scrollY;
      return top + Math.min(length, left);
    },
    [length],
  );
  // Arriving with a hash: go to that section along the row (the browser can't).
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current || length === 0) return;
    arrived.current = true;
    const y = yFor(window.location.hash);
    if (y !== null) window.scrollTo({ top: y });
  }, [length, yFor]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(
        "a[href*='#']",
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const y = yFor(url.hash);
      if (y === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(y, { duration: 1.6 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [yFor, lenis]);

  const slide = useTransform(x, (v) => -v);
  const progress = useTransform(x, (v) => (length > 0 ? v / length : 0));

  return (
    <TrackContext.Provider value={{ x, row, length }}>
      <div
        ref={outer}
        className="relative"
        style={{ height: `calc(100svh + ${length}px)` }}
      >
        {/* Clipped, and held at scrollLeft 0: a #hash or focus would otherwise scroll it
            sideways on its own, out of step with the row. */}
        <div
          onScroll={(e) => {
            if (e.currentTarget.scrollLeft !== 0)
              e.currentTarget.scrollLeft = 0;
          }}
          className="sticky top-0 h-[100svh] overflow-hidden"
        >
          <motion.div
            ref={row}
            style={{ x: slide }}
            className="flex h-full w-max will-change-transform"
          >
            {children}
          </motion.div>
          {reduce ? null : <Sweep x={x} row={row} />}
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-[3px] origin-left bg-ink/70"
          />
        </div>
      </div>
    </TrackContext.Provider>
  );
}
