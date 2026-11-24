"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site } from "@/data/site";

/** Ashish as an anime character: long hair, a friendly wave (scripts/art/cutout_figure.py). */
const FIGURE = "/images/awakening/friendly-dev.webp";
const MAIL = `mailto:${site.email}?subject=${encodeURIComponent("A project for Ashish")}`;

const MENU = [
  { label: "Home", href: "/", active: true },
  { label: "Work", href: "/#index" },
  { label: "About", href: "/#about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "/#contact" },
] as const;

const STACK = ["React", "Next.js", "TypeScript", "AWS"] as const;

/** Placeholder photos (picsum.photos, fixed by seed) until the real work shots are ready. */
const dummy = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** The roster along the bottom: work either side of him, the selected card his. */
const CARDS = [
  { src: dummy("neon-alley", 480, 320), label: "Project one", href: "/#index", pos: "50% 50%" },
  { src: FIGURE, label: "Ashish Kallada", href: "/#about", pos: "50% 2%", selected: true },
  { src: dummy("night-tokyo", 480, 320), label: "Project two", href: "/#index", pos: "50% 50%" },
  { src: dummy("red-studio", 480, 320), label: "Project three", href: "/#index", pos: "50% 50%" },
] as const;
const REEL = dummy("shrine-gate", 560, 360);

/**
 * The home hero, set as a character-select screen on flat pale grey: the menu down the left,
 * Ashish drawn as an anime character, waving, in the middle, the name in heavy grotesk on the right with the stack
 * beneath it, and the roster of work along the bottom. One face (Schibsted Grotesk) throughout;
 * red only on the action and the current page.
 */
export function AwakeningHero() {
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
      aria-label="Introduction"
      data-nav-theme="light"
      className="relative h-full w-full overflow-hidden bg-[#e9e8e6] font-[family-name:var(--font-schibsted)] text-[#121111]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- one cutout, sized to the screen's height */}
      <img
        src={FIGURE}
        alt="An anime illustration of Ashish, long black hair streaked crimson, smiling and waving"
        draggable={false}
        fetchPriority="high"
        className="pointer-events-none absolute top-[47%] left-1/2 aspect-[373/946] w-[80vw] max-w-none -translate-x-1/2 select-none md:top-[5%] md:left-[40%] md:h-[138svh] md:w-auto"
      />

      {/* Wordmark, top left */}
      <Link
        href="/"
        aria-label="Ashish Kallada, home"
        className="absolute top-8 left-8 hidden size-12 place-items-center bg-[#121111] text-[15px] font-extrabold tracking-[-0.04em] text-[#e9e8e6] md:grid"
      >
        AK
      </Link>

      {/* Menu, down the left */}
      <nav aria-label="Hero" className="absolute top-1/2 left-8 hidden -translate-y-1/2 md:block">
        <ul className="flex flex-col gap-5 text-[17px] font-semibold tracking-[-0.01em]">
          {MENU.map((m) => (
            <li key={m.label}>
              <Link
                href={m.href}
                aria-current={"active" in m ? "page" : undefined}
                className={`transition-colors hover:text-[#d3141f] focus-visible:text-[#d3141f] ${"active" in m ? "text-[#d3141f]" : ""}`}
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* The name, right of him */}
      <div className="absolute top-[11%] right-5 left-5 md:top-[13%] md:right-[6%] md:left-auto md:w-[31vw]">
        <h1 className="font-[family-name:var(--font-schibsted)] text-[17vw] leading-[0.86] font-extrabold tracking-[-0.055em] md:text-[7.4vw]">
          Ashish
          <br />
          Kallada
        </h1>
        <p className="mt-5 max-w-[30ch] text-[18px] leading-[1.45] md:mt-7 md:text-[clamp(1.125rem,1rem+0.3vw,1.25rem)]">
          Full stack developer. I build fast, typed web apps that still read well a year after launch.
        </p>
        <ul aria-label="Core stack" className="mt-5 flex flex-wrap gap-1.5 text-[14px] font-semibold">
          {STACK.map((s, i) => (
            <li key={s} className={`px-3 py-1.5 ${i === 0 ? "bg-[#121111] text-[#e9e8e6]" : "bg-[#d9d7d4]"}`}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* The roster */}
      <ul aria-label="Selected work" className="absolute bottom-[9%] left-[15%] hidden items-end gap-3 md:flex">
        {CARDS.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              aria-label={c.label}
              className={`group block overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 focus-visible:-translate-y-1.5 ${
                "selected" in c ? "h-[22svh] w-[14vw] bg-[#d3141f] p-1.5" : "h-[16svh] w-[10.5vw] bg-[#d9d7d4]"
              }`}
            >
              <span className="block h-full w-full overflow-hidden bg-[#e9e8e6]">
                {/* eslint-disable-next-line @next/next/no-img-element -- roster thumbnails */}
                <img
                  src={c.src}
                  alt=""
                  className={`h-full w-full object-cover transition-transform duration-500 ${
                    "selected" in c ? "origin-[50%_0%] scale-[1.6] group-hover:scale-[1.66]" : "group-hover:scale-[1.04]"
                  }`}
                  style={{ objectPosition: c.pos }}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Reel, bottom right */}
      <Link
        href="/#index"
        className="group absolute right-8 bottom-[9%] hidden h-[16svh] w-[14vw] overflow-hidden bg-[#121111] md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- reel thumbnail */}
        <img
          src={REEL}
          alt=""
          className="h-full w-full object-cover opacity-80 grayscale transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <span className="absolute bottom-3 left-3 text-[14px] font-semibold text-white">See the work</span>
      </Link>

      {/* Actions */}
      <div className="absolute right-5 bottom-[6%] left-5 flex gap-2 md:right-auto md:bottom-8 md:left-8">
        <a
          href={MAIL}
          className="bg-[#d3141f] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#121111] focus-visible:bg-[#121111]"
        >
          Hire me
        </a>
        <Link
          href="/resume"
          className="bg-[#121111] px-6 py-3.5 text-[16px] font-semibold text-[#e9e8e6] transition-colors hover:bg-[#d3141f] focus-visible:bg-[#d3141f] md:bg-[#d9d7d4] md:text-[#121111] md:hover:text-white"
        >
          View résumé
        </Link>
      </div>
      <p className="absolute right-8 bottom-8 hidden text-[14px] font-semibold md:block">
        <span aria-hidden className="mr-2 inline-block size-2 bg-[#d3141f]" />
        Available for work
      </p>
    </section>
  );
}
