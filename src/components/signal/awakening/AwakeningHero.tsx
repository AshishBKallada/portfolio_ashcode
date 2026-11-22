"use client";

import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { Energy, type Project } from "./energy";
import { ThornField } from "./ThornField";
import {
  AWAKENING_TRAVEL_SVH,
  CLAP,
  FRAMES,
  FRAME_H,
  FRAME_W,
  POINTS,
  camera,
  charge,
  clamp01,
  darkness,
  frameOpacities,
  lerp,
  phoneZoom,
  ramp,
} from "./timeline";

/** Ink on the pale room before the clap, warm bone on crimson after. */
const INK = [20, 18, 18];
const BONE = [244, 230, 224];
/** Where the camera pivots, in frame space: just under his chin. */
const ORIGIN = { x: 0.5, y: 0.32 };
const RED = "#d3141f";

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;

const MENU = [
  { label: "Home", href: "/", active: true },
  { label: "Work", href: "/#index" },
  { label: "About", href: "/#about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "/#contact" },
] as const;

const SKILLS = [
  { key: "R", label: "React" },
  { key: "N", label: "Next.js" },
  { key: "T", label: "TypeScript" },
  { key: "A", label: "AWS" },
] as const;

const LINKEDIN = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "/";

/** Placeholder photos (picsum.photos, fixed by seed) until the real work shots are ready. */
const dummy = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** The roster along the bottom: work either side of him, the selected card his. */
const CARDS = [
  { src: dummy("neon-alley", 480, 320), label: "Project one", href: "/#index", pos: "50% 50%" },
  { src: FRAMES[0].src, label: "The Cursed King", href: "/#about", pos: "50% 0%", selected: true },
  { src: dummy("night-tokyo", 480, 320), label: "Project two", href: "/#index", pos: "50% 50%" },
  { src: dummy("red-studio", 480, 320), label: "Project three", href: "/#index", pos: "50% 50%" },
] as const;

const POSTS = [dummy("post-alpha", 96, 96), dummy("post-beta", 96, 96), dummy("post-gamma", 96, 96)];
const REEL = dummy("shrine-gate", 560, 360);

/** Small line icons under the skill keys. */
function SkillIcon({ i }: { i: number }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6 };
  if (i === 0)
    return (
      <svg {...common}>
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
    );
  if (i === 1)
    return (
      <svg {...common}>
        <path d="M4 20V4l16 16V4" />
      </svg>
    );
  if (i === 2)
    return (
      <svg {...common}>
        <path d="M8 4C5 4 6 10 3 12c3 2 2 8 5 8M16 4c3 0 2 6 5 8-3 2-2 8-5 8" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z" />
    </svg>
  );
}

/**
 * THE AWAKENING, set as a character-select screen. The Cursed King stands among red thorns in
 * a pale hall: a menu down the left, his name in red brush on the right, the roster of work
 * along the bottom. Scrolling clears the screen and drives him through eight drawn poses: the
 * hands part, the arms spread, energy gathers, and the clap turns the room crimson and black.
 * HomeLayout pins the section for the whole runway. One rAF loop reads the scroll and writes
 * styles straight to the DOM, so React never re-renders while it plays.
 */
export function AwakeningHero() {
  const reduce = useReducedMotion() ?? false;
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const thorns = useRef<SVGSVGElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const glows = useRef<(HTMLDivElement | null)[]>([]);
  const ghost = useRef<HTMLDivElement>(null);
  const blush = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const hud = useRef<(HTMLElement | null)[]>([]);
  const title = useRef<HTMLDivElement>(null);

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
    let raf = 0;
    let running = false;

    const layout = () => {
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const phone = vw < 640;
      // Desktop: he stands tall, a little left of centre, cut off by the roster below. Phone: wide
      // enough that his spread hands stay on screen, standing on the bottom edge.
      const H = phone ? (vw * 1.04 * FRAME_H) / FRAME_W : Math.min(vh * 1.04, (vw * 1.02 * FRAME_H) / FRAME_W);
      const W = (H * FRAME_W) / FRAME_H;
      box = phone
        ? { L: (vw - W) / 2, T: vh - H, W, H, phone }
        : { L: vw * 0.44 - W / 2, T: vh * 0.07, W, H, phone };
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
      if (thorns.current) {
        const grow = 1 + 0.08 * ramp(p, 0.15, CLAP);
        thorns.current.style.transform = `translate3d(${shake.x * 0.6}px, ${shake.y * 0.6}px, 0) scale(${grow})`;
      }

      const g = ghost.current;
      if (g) {
        const s = clamp01(since / 650);
        g.style.opacity = since < 650 ? String(0.75 * (1 - s)) : "0";
        g.style.transform = `scale(${1 + 0.3 * (1 - (1 - s) ** 3)})`;
      }

      // The room: pale hall, a crimson blush gathering behind him, then the dark taking over.
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

      // The select screen clears as he wakes; his name comes back once the room is his.
      el.style.setProperty("--fg", mix(INK, BONE, d));
      const shown = 1 - ramp(p, 0.05, 0.16);
      const lift = (1 - shown) * 24;
      for (const h of hud.current) {
        if (!h) continue;
        h.style.opacity = String(shown);
        h.style.transform = `translate3d(0, ${lift}px, 0)`;
        h.style.visibility = shown < 0.01 ? "hidden" : "visible";
      }
      if (title.current) {
        const back = ramp(p, 0.8, 0.9);
        title.current.style.opacity = String(Math.max(shown, back));
        title.current.style.transform = `translate3d(0, ${back ? 0 : lift}px, 0)`;
      }
      // The site's top bar stands aside while this screen's own menu is up.
      const hudOn = !box.phone && shown > 0.5 ? "on" : "off";
      if (document.documentElement.dataset.heroHud !== hudOn) document.documentElement.dataset.heroHud = hudOn;

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
      document.documentElement.dataset.heroHud = "off";
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
      delete document.documentElement.dataset.heroHud;
    };
  }, [reduce]);

  return (
    <section
      ref={root}
      aria-label="Introduction"
      data-nav-theme="light"
      className="relative h-full w-full select-none overflow-hidden [--fg:rgb(20,18,18)]"
      style={{ background: "radial-gradient(90% 100% at 58% 38%, #fafafa 0%, #ececec 55%, #d6d6d6 100%)" }}
    >
      <h1 className="sr-only">Ashish Kallada, full stack developer, building digital experiences</h1>
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="brush-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </svg>

      {/* The room */}
      <div
        ref={blush}
        aria-hidden
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(50% 60% at 44% 55%, rgba(181,18,36,0.30), rgba(181,18,36,0.10) 45%, rgba(181,18,36,0) 72%)",
        }}
      />
      <div
        ref={dark}
        aria-hidden
        className="absolute inset-0 [clip-path:circle(0px_at_50%_50%)]"
        style={{
          background:
            "radial-gradient(40% 52% at 44% 48%, #d0162b 0%, #b51224 18%, #780b17 40%, #30050b 66%, #090909 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <ThornField ref={thorns} className="pointer-events-none absolute inset-0 h-full w-full origin-[40%_100%] will-change-transform" />
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
        style={{ background: "radial-gradient(60% 60% at 44% 45%, #fff 0%, #ff8a92 30%, #ff2a3d 60%, rgba(181,18,36,0) 100%)" }}
      />

      {/* Mark, top left */}
      <div ref={(n) => {
          hud.current[0] = n;
        }} className="absolute top-[4.5%] left-[2.2%] hidden items-start gap-3 md:flex">
        <span className="grid size-11 place-items-center border-2 border-[color:var(--fg)] font-headline text-[15px] tracking-[-0.04em] text-[color:var(--fg)]">
          AK
        </span>
        <span className="mt-1 flex flex-col gap-1.5">
          <span className="block h-1.5 w-16 bg-black/25" />
          <span className="block h-1.5 w-10 bg-black/20" />
        </span>
      </div>

      {/* Menu, down the left */}
      <nav ref={(n) => {
          hud.current[1] = n;
        }} aria-label="Hero" className="absolute top-[44%] left-[2.2%] hidden md:block">
        <ul className="flex flex-col gap-[3.4svh] font-headline text-[13px] uppercase tracking-[0.02em] text-[color:var(--fg)]">
          {MENU.map((m) => (
            <li key={m.label}>
              <Link
                href={m.href}
                aria-current={"active" in m ? "page" : undefined}
                className={`relative transition-colors hover:text-[#d3141f] ${"active" in m ? "text-[#d3141f]" : ""}`}
              >
                {"active" in m && <span aria-hidden className="absolute top-1/2 -left-[2.2vw] h-[2px] w-[1.6vw] -translate-y-1/2 bg-[#d3141f]" />}
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Name block, right of him */}
      <div
        ref={title}
        className="absolute top-[11%] right-5 left-5 text-left md:top-[12%] md:right-[21%] md:left-auto md:w-[23vw] md:text-right"
      >
        <p className="font-sans text-[16px] font-light uppercase tracking-[0.02em] text-[color:var(--fg)] opacity-60 md:text-[1.6vw]">
          Full Stack
        </p>
        <p className="font-headline text-[17px] uppercase tracking-[0.01em] text-[color:var(--fg)] md:text-[1.55vw]">
          – Developer
        </p>
        <p
          className="-mt-1 font-[family-name:var(--font-brush)] text-[19vw] leading-[0.85] tracking-[-0.02em] md:-mr-[0.5vw] md:text-[8.6vw]"
          style={{ color: RED, filter: "url(#brush-rough)", transform: "skewX(-10deg)" }}
        >
          Ashish
        </p>
        <div ref={(n) => {
          hud.current[2] = n;
        }}>
          <ul className="mt-[1.6svh] flex gap-1.5 md:justify-end" aria-label="Core stack">
            {SKILLS.map((s, i) => (
              <li
                key={s.key}
                title={s.label}
                className={`grid h-[26px] w-[clamp(36px,3.4vw,52px)] place-items-center font-sans text-[13px] -skew-x-12 ${
                  i === 0 ? "bg-[#141212] text-white outline outline-2 outline-offset-2 outline-[#d3141f]" : "bg-black/25 text-white"
                }`}
              >
                <span className="skew-x-12">{s.key}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-[1.8svh] flex gap-[clamp(10px,1.4vw,22px)] text-[color:var(--fg)] md:justify-end" aria-hidden>
            {SKILLS.map((s, i) => (
              <li key={s.key} style={{ color: i === 0 ? RED : undefined, opacity: i === 0 ? 1 : 0.75 }} className="w-[clamp(36px,3.4vw,52px)]">
                <span className="mx-auto block w-fit">
                  <SkillIcon i={i} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-[2svh] font-headline text-[15px] uppercase text-[color:var(--fg)] md:text-[1.25vw]">Kallada</p>
          <p className="mt-1 max-w-[30ch] font-sans text-[13px] italic leading-snug text-[color:var(--fg)] opacity-60 md:ml-auto md:text-[1.05vw]">
            Building digital experiences: typed APIs, tested deploys, and interfaces that still read well a
            year after launch.
          </p>
        </div>
      </div>

      {/* Recent posts, top right */}
      <div ref={(n) => {
          hud.current[3] = n;
        }} className="absolute top-[4%] right-[2%] hidden flex-col items-center gap-2.5 md:flex">
        <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" className="fill-[color:var(--fg)] opacity-60">
          <circle cx="12" cy="7" r="3.2" />
          <circle cx="5" cy="9" r="2.4" />
          <circle cx="19" cy="9" r="2.4" />
          <path d="M6 20c0-4 2.7-6.5 6-6.5s6 2.5 6 6.5zM0 19c0-3 1.8-5 4.5-5 1 0 1.6.2 2 .5C5 15.8 4.5 17.3 4.4 19zM24 19c0-3-1.8-5-4.5-5-1 0-1.6.2-2 .5 1.5 1.3 2 2.8 2.1 4.5z" />
        </svg>
        {POSTS.map((src) => (
          <a key={src} href={LINKEDIN} target="_blank" rel="noreferrer" className="block size-8 border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- 32px thumbnails */}
            <img src={src} alt="A post on LinkedIn" className="h-full w-full object-cover" />
          </a>
        ))}
      </div>

      {/* The roster */}
      <ul
        ref={(n) => {
          hud.current[4] = n;
        }}
        aria-label="Selected work"
        className="absolute top-[66%] left-[15.8%] hidden items-center gap-[1vw] md:flex"
      >
        {CARDS.map((c) => (
          <li key={c.label} className="flex flex-col items-start gap-[2.6svh]">
            <Link
              href={c.href}
              aria-label={c.label}
              className={`group relative block -rotate-[3deg] -skew-x-[3deg] transition-transform duration-300 hover:-translate-y-1 ${
                "selected" in c
                  ? "h-[21svh] w-[14.2vw] overflow-hidden border-[5px] border-[#d3141f] bg-[#d3141f] shadow-[10px_10px_0_#d3141f]"
                  : "h-[15.5svh] w-[10.2vw] border-[4px] border-white bg-white shadow-[0_6px_18px_rgba(0,0,0,0.22)]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- roster thumbnails */}
              <img
                src={c.src}
                alt=""
                className={`h-full w-full object-cover ${"selected" in c ? "origin-[50%_6%] scale-[2.1] bg-[#1a1515]" : ""}`}
                style={{ objectPosition: c.pos }}
              />
            </Link>
            {"selected" in c && (
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent("A project for Ashish")}`}
                className="-mt-[0.6svh] bg-[#141212] px-[1.9vw] py-[1.1svh] font-headline text-[1.05vw] uppercase text-white transition-colors hover:bg-[#d3141f]"
              >
                Hire me
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* Reel, bottom right */}
      <div ref={(n) => {
          hud.current[5] = n;
        }} className="absolute top-[66%] right-[8.3%] hidden items-start gap-[0.5vw] md:flex">
        <div className="mt-[8svh] flex flex-col gap-1">
          <Link href="/#index" aria-label="Previous work" className="grid size-[2.5vw] place-items-center bg-white text-[#141212] shadow">
            ‹
          </Link>
          <Link href="/#index" aria-label="Next work" className="grid size-[2.5vw] place-items-center bg-[#d3141f] text-white shadow">
            ›
          </Link>
        </div>
        <Link href="/#index" aria-label="See the work" className="group relative block h-[17svh] w-[13.4vw] border-[3px] border-white shadow-[0_6px_18px_rgba(0,0,0,0.22)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- reel thumbnail */}
          <img src={REEL} alt="" className="h-full w-full object-cover contrast-125 grayscale" />
          <span aria-hidden className="absolute inset-0 bg-[#d3141f]/45 mix-blend-multiply" />
          <span aria-hidden className="absolute top-1/2 left-1/2 grid size-[2.8vw] -translate-1/2 place-items-center rounded-full border-2 border-white text-white transition-transform group-hover:scale-110">
            ▶
          </span>
        </Link>
      </div>

      {/* Status, bottom left */}
      <div ref={(n) => {
          hud.current[6] = n;
        }} className="absolute bottom-[3.5%] left-[2.5%] hidden w-[13.8vw] items-center justify-between bg-black/10 px-3 py-1.5 font-sans text-[11px] text-[color:var(--fg)] md:flex">
        <span>Status: Available for work</span>
        <span aria-hidden className="size-1.5 rounded-full bg-[#d3141f]" />
      </div>

      {/* Hint, bottom centre */}
      <p
        ref={(n) => {
          hud.current[7] = n;
        }}
        className="absolute bottom-[3.6%] left-1/2 w-max -translate-x-1/2 font-sans text-[11px] text-white mix-blend-difference md:left-[44.6%] md:text-[0.72vw]"
      >
        Scroll to awaken him, or click HIRE ME to start a project
      </p>

      {/* Résumé, bottom right */}
      <Link
        ref={(n) => {
          hud.current[8] = n;
        }}
        href="/resume"
        className="absolute right-5 bottom-[11%] border-2 border-[color:var(--fg)] bg-white/40 px-5 py-2.5 font-sans text-[12px] uppercase tracking-[0.04em] text-[color:var(--fg)] transition-colors hover:bg-[#141212] hover:text-white md:right-[2.2%] md:bottom-[5.2%] md:px-[1.3vw] md:py-[1.2svh] md:text-[0.8vw]"
      >
        View résumé
      </Link>
      <a
        ref={(n) => {
          hud.current[9] = n;
        }}
        href={`mailto:${site.email}?subject=${encodeURIComponent("A project for Ashish")}`}
        className="absolute bottom-[11%] left-5 bg-[#141212] px-5 py-2.5 font-headline text-[12px] uppercase text-white md:hidden"
      >
        Hire me
      </a>
    </section>
  );
}
