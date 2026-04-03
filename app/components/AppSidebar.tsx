"use client";

export const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Stack", id: "skills" },
  { label: "Works", id: "works" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
  { label: "Blog", id: "blog" },
  { label: "Experience", id: "experience" },
  { label: "Outro", id: "footer" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];

const SIDEBAR_VERTICAL_ROWS = [
  "Design & development purveyors",
  "MERN stack · Hand-crafted digital",
] as const;

function NavLinks({
  className,
  activeSection,
  onNavigate,
}: {
  className?: string;
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <a
          key={item.id}
          href={item.id === "home" ? "#home" : `#${item.id}`}
          className={`${className ?? ""} ${
            activeSection === item.id
              ? "font-semibold opacity-100"
              : "opacity-55"
          }`.trim()}
          aria-current={activeSection === item.id ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.id);
          }}
        >
          {item.label}
        </a>
      ))}
    </>
  );
}

export default function AppSidebar({
  activeSection,
  onNavigate,
}: {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="contents">
      {/* Desktop: in-flow column — partitions viewport with main (no overlay) */}
      <aside
        className="hidden h-full min-h-0 w-1/4 shrink-0 flex-row border-r border-black/15 bg-white text-black md:flex"
        aria-label="Site navigation"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-6 py-7 md:py-8 lg:px-8">
          <a
            href="#home"
            className="mb-8 shrink-0 font-safiro text-lg font-bold lowercase tracking-normal"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home");
            }}
          >
            ashcode
          </a>

          <nav
            className="flex min-w-0 shrink-0 flex-col gap-3.5 font-mono text-[11px] uppercase leading-snug tracking-[0.14em]"
            aria-label="Primary"
          >
            <NavLinks
              className="transition-opacity hover:opacity-80"
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          </nav>

          <div className="min-w-0 flex-1" aria-hidden />

          {/* Connect — bottom stack (below flex spacer) */}
          <div className="min-w-0 shrink-0 border-t border-black/10 pt-5">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
              Connect
            </p>
            <div className="flex flex-col gap-2 font-safiro text-[10px] leading-snug text-black/85">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words hover:opacity-60"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words hover:opacity-60"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="mt-6 min-w-0 shrink-0">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
              Email
            </p>
            <a
              href="mailto:ashercode4u@gmail.com"
              className="block font-safiro text-[10px] leading-snug break-all text-black/85 hover:opacity-60"
            >
              ashercode4u@gmail.com
            </a>
          </div>

          <p className="mt-8 min-w-0 font-chaney text-[clamp(1.1rem,2.9vw,1.5rem)] font-bold uppercase leading-[0.98] tracking-[0.02em] text-black">
            Full-stack developer.
          </p>

          <p className="mt-6 shrink-0 border-t border-black/10 pt-4 font-safiro text-[10px] text-black/50">
            © {year} ASHCODE
          </p>
        </div>

        {/* Vertical rail — two columns, reference-style */}
        <div
          className="flex shrink-0 flex-row items-center justify-center gap-1 self-stretch bg-white px-1 py-8 select-none sm:gap-1.5 sm:px-1.5"
          aria-hidden
        >
          {SIDEBAR_VERTICAL_ROWS.map((line) => (
            <span
              key={line}
              className="max-h-[min(78vh,36rem)] text-center font-mono text-[0.58rem] uppercase leading-tight tracking-[0.2em] text-black/38 [text-orientation:mixed] [writing-mode:vertical-rl] rotate-180 sm:text-[0.68rem] sm:tracking-[0.22em]"
            >
              {line}
            </span>
          ))}
        </div>
      </aside>

      {/* Mobile: fixed top strip — same section links */}
      <nav
        className="fixed left-0 right-0 top-0 z-[60] flex items-center gap-3 overflow-x-auto border-b border-black/15 bg-white px-3 py-2.5 text-black md:hidden"
        aria-label="Site navigation"
      >
        <a
          href="#home"
          className="shrink-0 font-safiro text-sm font-bold lowercase"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          ashcode
        </a>
        <span className="shrink-0 text-black/25" aria-hidden>
          |
        </span>
        <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em]">
          <NavLinks
            className="whitespace-nowrap transition-opacity hover:opacity-80"
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        </div>
      </nav>

      {/* Mobile: compact footer (sidebar content not visible on narrow top bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-black/10 bg-white px-3 py-2 text-center font-safiro text-[9px] text-black/55 md:hidden">
        <span>© {year} ASHCODE</span>
      </div>
    </div>
  );
}
