"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Energy, type Project } from "./energy";
import {
  AWAKENING_TRAVEL_SVH,
  CLAP,
  FRAMES,
  FRAME_H,
  FRAME_W,
  POINTS,
  STAGES,
  camera,
  charge,
  clamp01,
  darkness,
  frameOpacities,
  lerp,
  phoneZoom,
  ramp,
} from "./timeline";

const NAME = ["Ashish", "Kallada"] as const;
/** Ink on paper before the clap, warm bone on crimson after. */
const INK = [20, 18, 18];
const BONE = [244, 230, 224];

/** Where the camera pivots, in frame space: just under his chin. */
const ORIGIN = { x: 0.5, y: 0.32 };

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;

/**
 * THE AWAKENING. A white editorial hero where the Cursed King stands with his palms joined;
 * scrolling drives him through eight drawn poses: the hands part, the arms spread, energy
 * gathers, and the clap turns the page crimson and black. HomeLayout pins the section for the
 * whole runway. One rAF loop reads the scroll and writes styles straight to the DOM, so React
 * never re-renders while it plays.
 */
export function AwakeningHero() {
  const reduce = useReducedMotion() ?? false;
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const glows = useRef<(HTMLDivElement | null)[]>([]);
  const ghost = useRef<HTMLDivElement>(null);
  const blush = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const names = useRef<(HTMLSpanElement | null)[]>([]);
  const cue = useRef<HTMLDivElement>(null);
  const stageLabel = useRef<HTMLSpanElement>(null);
  const stageNum = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    const st = stage.current;
    if (!el || !cv || !st) return;

    const lite = reduce || window.matchMedia("(max-width: 767px)").matches;
    const energy = new Energy(cv, { lite });
    const ops = new Array<number>(FRAMES.length).fill(0);
    const lastOps = new Array<number>(FRAMES.length).fill(-1);
    let box = { L: 0, T: 0, W: 0, H: 0, phone: false };
    let prevP = -1;
    let lastStage = -1;
    let raf = 0;
    let running = false;

    const layout = () => {
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const phone = vw < 640;
      // Wide enough that his spread hands stay on screen; on desktop he fills the height.
      const H = phone
        ? (vw * 1.04 * FRAME_H) / FRAME_W
        : Math.min(vh * 0.9, (vw * 1.02 * FRAME_H) / FRAME_W);
      const W = (H * FRAME_W) / FRAME_H;
      box = { L: (vw - W) / 2, T: vh - H, W, H, phone };
      Object.assign(st.style, { left: `${box.L}px`, top: `${box.T}px`, width: `${W}px`, height: `${H}px` });
      energy.resize(vw, vh, Math.min(window.devicePixelRatio || 1, 2));
      prevP = -1;
    };

    const shakeAt = (since: number) => {
      if (reduce || since > 520) return { x: 0, y: 0 };
      const amp = (box.phone ? 6 : 14) * (1 - since / 520) ** 2;
      return { x: Math.sin(since * 0.21) * amp, y: Math.cos(since * 0.17) * amp * 0.7 };
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const travel = (window.innerHeight * AWAKENING_TRAVEL_SVH) / 100;
      const p = clamp01(window.scrollY / travel);

      if (prevP >= 0 && prevP < CLAP && p >= CLAP && !reduce) {
        const c = POINTS.clap;
        energy.clap(now, { x: box.L + box.W * c.x, y: box.T + box.H * c.y });
      }
      prevP = p;
      const since = energy.sinceImpact(now);

      // The figure: which pose shows, the camera on him, and the jolt of the clap.
      frameOpacities(p, ops);
      const pulse = 0.75 + 0.25 * Math.sin(now / 260);
      for (let i = 0; i < FRAMES.length; i++) {
        if (Math.abs(ops[i] - lastOps[i]) > 0.001) {
          const f = frames.current[i];
          if (f) f.style.opacity = String(ops[i]);
          lastOps[i] = ops[i];
        }
        const gl = glows.current[i];
        if (gl) gl.style.opacity = String(ops[i] * FRAMES[i].glow * pulse * (0.4 + 0.6 * charge(p)));
      }
      const cam = camera(p);
      const scale = box.phone ? phoneZoom(p) * (1 + (cam.scale - 1) * 0.3) : cam.scale;
      const shake = shakeAt(since);
      const breathe = reduce ? 0 : Math.sin(now / 1400) * 2.5;
      const project: Project = (u, v) => ({
        x: box.L + shake.x + box.W * (ORIGIN.x + (u - ORIGIN.x) * scale),
        y: box.T + shake.y - cam.lift * box.H + box.H * (ORIGIN.y + (v - ORIGIN.y) * scale),
      });
      st.style.transform = `translate3d(${shake.x}px, ${shake.y + breathe - cam.lift * box.H}px, 0) scale(${scale})`;

      const g = ghost.current;
      if (g) {
        const s = clamp01(since / 650);
        g.style.opacity = since < 650 ? String(0.75 * (1 - s)) : "0";
        g.style.transform = `scale(${1 + 0.3 * (1 - (1 - s) ** 3)})`;
      }

      // The room: paper, a crimson blush gathering behind him, then the dark taking over.
      const d = darkness(p);
      if (blush.current) blush.current.style.opacity = String(ramp(p, 0.18, CLAP));
      if (dark.current) {
        // The dark doesn't fade in over the paper (that reads as grey); it bursts out of his hands.
        const c = project(POINTS.clap.x, POINTS.clap.y);
        const reach = d >= 1 ? 9999 : Math.hypot(el.clientWidth, el.clientHeight) * d;
        dark.current.style.clipPath = d <= 0 ? "circle(0px at 50% 50%)" : `circle(${reach}px at ${c.x}px ${c.y}px)`;
      }
      const theme = d > 0.5 ? "dark" : "light";
      if (el.dataset.navTheme !== theme) el.dataset.navTheme = theme;
      if (flash.current) {
        const burst = since < 480 ? (1 - since / 480) ** 2 : 0;
        const held = 1 - clamp01(Math.abs(p - CLAP) / 0.012);
        flash.current.style.opacity = String(reduce ? held * 0.5 : Math.max(burst, held * 0.6));
      }

      // Type follows the light; the two halves of the name drift apart as the tension builds.
      el.style.setProperty("--fg", mix(INK, BONE, d));
      const spread = ramp(p, 0.1, CLAP) * (box.phone ? 2 : 4);
      const [first, second] = names.current;
      if (first) first.style.transform = `translate3d(${-spread}vw, 0, 0)`;
      if (second) second.style.transform = `translate3d(${spread}vw, 0, 0)`;
      if (cue.current) cue.current.style.opacity = String(1 - ramp(p, 0.01, 0.06));

      let s = 0;
      while (s < STAGES.length - 1 && p >= STAGES[s + 1].from) s++;
      if (s !== lastStage && stageLabel.current && stageNum.current) {
        stageLabel.current.textContent = STAGES[s].label;
        stageNum.current.textContent = String(s + 1).padStart(2, "0");
        lastStage = s;
      }

      energy.render(p, now, project, box.H * scale);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    // Only animate while the hero is on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(el);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce]);

  return (
    <section
      ref={root}
      aria-label="Introduction"
      data-nav-theme="light"
      className="relative h-full w-full select-none overflow-hidden bg-[#f4f1eb] [--fg:rgb(20,18,18)]"
    >
      <h1 className="sr-only">Ashish Kallada, full stack developer, building digital experiences</h1>

      {/* The room */}
      <div
        ref={blush}
        aria-hidden
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 58%, rgba(181,18,36,0.30), rgba(181,18,36,0.10) 45%, rgba(181,18,36,0) 72%), radial-gradient(30% 35% at 50% 40%, rgba(255,59,72,0.16), rgba(255,59,72,0) 70%)",
        }}
      />
      <div
        ref={dark}
        aria-hidden
        className="absolute inset-0 [clip-path:circle(0px_at_50%_50%)]"
        style={{
          background:
            "radial-gradient(42% 52% at 50% 48%, #d0162b 0%, #b51224 18%, #780b17 40%, #30050b 66%, #090909 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* The name, set large behind him */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[24svh] font-serif font-extralight uppercase leading-[0.8] tracking-[-0.045em] text-[color:var(--fg)] sm:top-[16svh]"
      >
        <span
          ref={(n) => {
            names.current[0] = n;
          }}
          className="block pl-[5vw] text-[21vw] will-change-transform sm:text-[14vw]"
        >
          {NAME[0]}
        </span>
        <span
          ref={(n) => {
            names.current[1] = n;
          }}
          className="block pr-[5vw] text-right text-[21vw] italic will-change-transform sm:mt-[1vw] sm:text-[14vw]"
        >
          {NAME[1]}
        </span>
      </div>

      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* The Cursed King: eight registered poses, each with its own red glow behind it */}
      <div
        ref={stage}
        aria-hidden
        className="pointer-events-none absolute will-change-transform"
        style={{ transformOrigin: `${ORIGIN.x * 100}% ${ORIGIN.y * 100}%` }}
      >
        {FRAMES.map((f, i) => (
          <div
            key={`glow-${f.src}`}
            ref={(n) => {
              glows.current[i] = n;
            }}
            className="absolute inset-0 scale-[1.04] opacity-0 blur-[22px]"
          >
            <div
              className="absolute inset-0 bg-[#ff2a3d]"
              style={{ mask: `url(${f.src}) center / contain no-repeat`, WebkitMask: `url(${f.src}) center / contain no-repeat` }}
            />
          </div>
        ))}
        <div ref={ghost} className="absolute inset-0 opacity-0 blur-[6px]">
          <div
            className="absolute inset-0 bg-[#ff3b48]"
            style={{
              mask: `url(${FRAMES[5].src}) center / contain no-repeat`,
              WebkitMask: `url(${FRAMES[5].src}) center / contain no-repeat`,
            }}
          />
        </div>
        {FRAMES.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- registered frames, swapped by opacity every scroll frame
          <img
            key={f.src}
            ref={(n) => {
              frames.current[i] = n;
            }}
            src={f.src}
            alt=""
            draggable={false}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className="absolute inset-0 h-full w-full"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </div>

      <div
        ref={flash}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
        style={{ background: "radial-gradient(60% 60% at 50% 45%, #fff 0%, #ff8a92 30%, #ff2a3d 60%, rgba(181,18,36,0) 100%)" }}
      />

      {/* Labels */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg)] sm:p-8 sm:text-[11px]">
        <span className="max-w-[16ch] sm:max-w-none">Full Stack Developer</span>
        <span className="max-w-[20ch] text-right sm:max-w-none">Building Digital Experiences</span>
      </div>
      <div className="pointer-events-none absolute top-[76px] right-5 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--fg)] sm:top-[88px] sm:right-8 sm:text-[11px]">
        <span ref={stageNum}>01</span>
        <span className="h-px w-8 bg-current opacity-50" />
        <span ref={stageLabel}>Calm</span>
      </div>
      <div
        ref={cue}
        className="pointer-events-none absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference sm:bottom-8"
      >
        <span className="relative block h-8 w-5 rounded-full border border-current">
          <span className="absolute top-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-current motion-safe:animate-[awaken-cue_1.8s_ease-in-out_infinite]" />
        </span>
        <span>Scroll to awaken</span>
      </div>
    </section>
  );
}
