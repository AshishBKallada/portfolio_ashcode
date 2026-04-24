"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ColorScheme } from "../lib/color-scheme";

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
  activeSection,
  onNavigate,
  colorScheme,
  onToggleColorScheme,
}: {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  colorScheme: ColorScheme;
  onToggleColorScheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleNavigate = useCallback(
    (id: SectionId) => {
      onNavigate(id);
      closeMenu();
    },
    [onNavigate, closeMenu],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen, closeMenu]);

  const onDark = colorScheme === "dark";

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
          <div className="flex items-center gap-3 md:gap-5">
            <span
              className={`font-safiro text-xs font-medium tracking-wide md:text-sm ${onDark ? "text-white" : "text-black"}`}
            >
              EN
            </span>
            <button
              type="button"
              onClick={onToggleColorScheme}
              className={`rounded-none border px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-80 md:px-3 md:text-[10px] ${
                onDark
                  ? "border-white/35 bg-transparent text-white"
                  : "border-black/25 bg-transparent text-black"
              }`}
              aria-label={onDark ? "Switch to light theme" : "Switch to dark theme"}
              title={onDark ? "Light theme" : "Dark theme"}
            >
              {onDark ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              className={`inline-flex min-w-[10.5rem] items-center justify-start rounded-none border py-2.5 pl-3 pr-12 font-safiro text-[10px] font-semibold uppercase tracking-[0.18em] transition-opacity md:min-w-[12rem] md:pl-4 md:pr-16 md:text-[11px] ${
                onDark
                  ? "border-white bg-transparent text-white hover:bg-white/10"
                  : "border-black bg-transparent text-black hover:bg-black/5"
              }`}
              aria-expanded={menuOpen}
              aria-controls="site-menu-panel"
              onClick={() => setMenuOpen((o) => !o)}
            >
              Menu
            </button>
          </div>

          {menuOpen ? (
            <div
              id="site-menu-panel"
              className="absolute right-0 top-[calc(100%+0.65rem)] z-[80] min-w-[10.5rem] rounded-2xl border border-black/10 bg-white p-4 text-black shadow-lg"
            >
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
                Navigate
              </p>
              <nav className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={item.id === "home" ? "#home" : `#${item.id}`}
                    className={
                      activeSection === item.id
                        ? "font-semibold text-black"
                        : "text-black/60 hover:text-black"
                    }
                    aria-current={activeSection === item.id ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
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
