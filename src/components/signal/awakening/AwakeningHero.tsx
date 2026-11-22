"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";

const RED = "#d3141f";
/** The Cursed King, walking in on a cracked-marble body (scripts/art/cutout_marble_king.py). */
const FIGURE = "/images/awakening/marble-king.webp";

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
  { src: FIGURE, label: "The Cursed King", href: "/#about", pos: "50% 4%", selected: true },
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
 * The home hero, set as a character-select screen. The Cursed King stands in a plain pale room: a menu down the left, his name in red brush on the right, the roster of work
 * along the bottom. HomeLayout holds it while the page below slides up over it.
 */
export function AwakeningHero() {
  const root = useRef<HTMLElement>(null);

  // The site's top bar stands aside while this screen's own menu is up (desktop).
  useEffect(() => {
    const html = document.documentElement;
    const desktop = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const on = desktop.matches && window.scrollY < window.innerHeight * 0.85 ? "on" : "off";
      if (html.dataset.heroHud !== on) html.dataset.heroHud = on;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete html.dataset.heroHud;
    };
  }, []);

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

      {/* eslint-disable-next-line @next/next/no-img-element -- one cutout, sized to the screen's height */}
      <img
        src={FIGURE}
        alt=""
        aria-hidden
        draggable={false}
        fetchPriority="high"
        className="pointer-events-none absolute top-[47%] left-1/2 aspect-[472/975] w-[88vw] max-w-none -translate-x-1/2 md:top-[5%] md:left-[44%] md:h-[138svh] md:w-auto"
      />

      {/* Mark, top left */}
      <div className="absolute top-[4.5%] left-[2.2%] hidden items-start gap-3 md:flex">
        <span className="grid size-11 place-items-center border-2 border-[color:var(--fg)] font-headline text-[15px] tracking-[-0.04em] text-[color:var(--fg)]">
          AK
        </span>
        <span className="mt-1 flex flex-col gap-1.5">
          <span className="block h-1.5 w-16 bg-black/25" />
          <span className="block h-1.5 w-10 bg-black/20" />
        </span>
      </div>

      {/* Menu, down the left */}
      <nav aria-label="Hero" className="absolute top-[44%] left-[2.2%] hidden md:block">
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
        <div>
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
      <div className="absolute top-[4%] right-[2%] hidden flex-col items-center gap-2.5 md:flex">
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
                className={`h-full w-full object-cover ${"selected" in c ? "origin-[50%_0%] scale-[1.6] bg-[#e4e4e4]" : ""}`}
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
      <div className="absolute top-[66%] right-[8.3%] hidden items-start gap-[0.5vw] md:flex">
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
      <div className="absolute bottom-[3.5%] left-[2.5%] hidden w-[13.8vw] items-center justify-between bg-black/10 px-3 py-1.5 font-sans text-[11px] text-[color:var(--fg)] md:flex">
        <span>Status: Available for work</span>
        <span aria-hidden className="size-1.5 rounded-full bg-[#d3141f]" />
      </div>

      {/* Hint, bottom centre */}
      <p
        className="absolute bottom-[3.6%] left-1/2 w-max -translate-x-1/2 font-sans text-[11px] text-white mix-blend-difference md:left-[44.6%] md:text-[0.72vw]"
      >
        Click HIRE ME to start a project
      </p>

      {/* Résumé, bottom right */}
      <Link
        href="/resume"
        className="absolute right-5 bottom-[11%] border-2 border-[color:var(--fg)] bg-white/40 px-5 py-2.5 font-sans text-[12px] uppercase tracking-[0.04em] text-[color:var(--fg)] transition-colors hover:bg-[#141212] hover:text-white md:right-[2.2%] md:bottom-[5.2%] md:px-[1.3vw] md:py-[1.2svh] md:text-[0.8vw]"
      >
        View résumé
      </Link>
      <a
        href={`mailto:${site.email}?subject=${encodeURIComponent("A project for Ashish")}`}
        className="absolute bottom-[11%] left-5 bg-[#141212] px-5 py-2.5 font-headline text-[12px] uppercase text-white md:hidden"
      >
        Hire me
      </a>
    </section>
  );
}
