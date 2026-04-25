"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Footer", id: "footer" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];

function LogoMark({ dotClassName }: { dotClassName: string }) {
  return (
    <span className="inline-grid shrink-0 grid-cols-2 gap-[2px]" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`size-[3px] rounded-[1px] sm:size-[3.5px] ${dotClassName}`}
        />
      ))}
    </span>
  );
}

/** Top bar: transparent; type color follows color scheme. */
export default function AppSidebar({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback(
    (id: SectionId) => {
      onNavigate(id);
      setMenuOpen(false);
    },
    [onNavigate],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.killTweensOf(panel);
    if (menuOpen) {
      gsap.set(panel, { display: "block" });
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -8, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" },
      );
    } else {
      gsap.to(panel, {
        autoAlpha: 0,
        y: -8,
        scale: 0.96,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  const onDark = true;

  return (
    <header
      className={`pointer-events-auto fixed left-0 right-0 top-0 z-[70] bg-transparent transition-colors duration-300 ${onDark ? "text-white" : "text-black"}`}
      aria-label="Site"
    >
      <div className="mx-auto grid w-full max-w-[min(100%,88rem)] grid-cols-[1fr_auto] grid-rows-[auto_auto_auto] gap-x-4 gap-y-4 px-0 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:grid-rows-1 md:gap-x-8 md:gap-y-0 lg:gap-x-12">
        <a
          href="#home"
          className="col-start-1 row-start-1 flex shrink-0 items-center gap-2.5 md:col-start-1 md:row-start-1"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("home");
          }}
        >
          <LogoMark dotClassName={onDark ? "bg-white" : "bg-black"} />
          <span
            className={`font-safiro text-sm font-medium lowercase tracking-[0.02em] md:text-base ${onDark ? "text-white" : "text-black"}`}
          >
            ashcode
          </span>
        </a>

        <div
          ref={menuRef}
          className="relative col-start-2 row-start-1 justify-self-end md:col-start-4 md:row-start-1 md:justify-self-end"
        >
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-white/45 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white/10 md:h-10 md:w-10"
          >
            <span className="relative block h-3.5 w-4">
              <span className="absolute left-0 top-0 block h-px w-4 bg-white" />
              <span className="absolute left-0 top-[6px] block h-px w-4 bg-white" />
              <span className="absolute left-0 top-[12px] block h-px w-4 bg-white" />
            </span>
          </button>

          <div
            ref={panelRef}
            className={`absolute right-0 top-[calc(100%+0.7rem)] z-[90] w-[11.5rem] origin-top-right rounded-xl border border-black/12 bg-white p-3 text-black shadow-2xl ${
              menuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            style={{ display: "none" }}
          >
            <nav className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleNavigate("home")}
                className="text-left font-safiro text-[1.25rem] leading-none text-black/95 hover:text-black"
              >
                Work
              </button>
              <a className="font-safiro text-[1.25rem] leading-none text-black/95 hover:text-black" href="#services">
                Services
              </a>
              <a className="font-safiro text-[1.25rem] leading-none text-black/95 hover:text-black" href="#pricing">
                Pricing
              </a>
              <a className="font-safiro text-[1.25rem] leading-none text-black/95 hover:text-black" href="#approach">
                Approach
              </a>
              <a
                className="font-safiro text-[1.25rem] leading-none text-black/95 hover:text-black"
                href="mailto:ashercode4u@gmail.com"
              >
                Book a Call
              </a>
            </nav>

            <div className="my-2.5 h-px w-full bg-black/12" />

            <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-black/45">
              Resources
            </p>
            <div className="flex flex-col gap-0.5">
              <a className="font-safiro text-[11px] text-black/75 hover:text-black" href="/projects">
                Work
              </a>
              <a className="font-safiro text-[11px] text-black/75 hover:text-black" href="https://x.com" target="_blank" rel="noreferrer">
                Twitter / X
              </a>
              <a className="font-safiro text-[11px] text-black/75 hover:text-black" href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="font-safiro text-[11px] text-black/75 hover:text-black" href="/terms-and-conditions">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <p
          className={`col-span-2 row-start-2 max-w-[17rem] text-[10px] font-normal leading-[1.55] md:col-span-1 md:col-start-2 md:row-start-1 md:max-w-[15rem] md:justify-self-start lg:max-w-[17rem] lg:text-[11px] ${onDark ? "text-white/75" : "text-black/75"}`}
        >
          Pushing on a clearly marked &quot;Pull&quot; door with full confidence while others
          watch.
        </p>

        <div
          className={`col-span-2 row-start-3 flex flex-col gap-1.5 text-left text-[10px] leading-snug md:col-span-1 md:col-start-3 md:row-start-1 md:text-[11px] ${onDark ? "text-white/70" : "text-black/70"}`}
        >
          <a
            href="mailto:ashercode4u@gmail.com"
            className={`font-safiro font-normal tracking-tight hover:opacity-70 ${onDark ? "text-white" : "text-black"}`}
          >
            ashercode4u@gmail.com
          </a>
          <span className={`font-safiro ${onDark ? "text-white/50" : "text-black/50"}`}>
            MERN stack · Build in public
          </span>
        </div>
      </div>
    </header>
  );
}
