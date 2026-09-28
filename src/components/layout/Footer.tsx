import { site } from "@/data/site";

const CORNER =
  "text-[11px] leading-tight tracking-[-0.01em] text-black sm:text-[13px]";
const LINK = "transition-opacity hover:opacity-60";

export function Footer() {
  const year = new Date().getFullYear();
  const linkedin = site.socials.find((social) => social.label === "LinkedIn");
  const github = site.socials.find((social) => social.label === "GitHub");

  return (
    <footer className="relative isolate flex min-h-[70svh] flex-col justify-between overflow-hidden bg-white px-5 py-6 font-sans text-black sm:min-h-[85svh] sm:px-10 sm:py-8">
      {/* Oversized red wordmark behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <span className="font-display text-[34vw] leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-[#b3201b] uppercase">
          {site.name}
        </span>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(255,255,255,0.8)_100%)]" />
      </div>

      {/* Top corners */}
      <div className="flex items-start justify-between">
        <p className={CORNER}>
          <span className="block font-medium">{site.name}.</span>
          <span className="block text-[9px] text-black/70 sm:text-[10px]">
            Edition.
          </span>
        </p>
        <p className="text-[9px] font-medium tracking-[0.12em] uppercase sm:text-[10px]">
          Portfolio
        </p>
        <p className={`${CORNER} text-right`}>
          <span className="block font-medium">{site.role}</span>
          <span className="block text-[9px] text-black/70 sm:text-[10px]">
            {site.location}
          </span>
        </p>
      </div>

      {/* Centerpiece */}
      <div className="relative flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] font-script text-[clamp(4rem,17vw,15rem)] leading-none whitespace-nowrap text-black/85"
        >
          Thank you
        </span>
        <p className="relative font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-[-0.01em] uppercase">
          {String(year).slice(0, 2)} {site.name} {String(year).slice(2)}
        </p>
        <p className="relative mt-8 text-[10px] font-semibold tracking-[0.02em] uppercase sm:mt-12 sm:text-xs">
          Credits reserved.
        </p>
        <p className="relative mt-4 max-w-xs text-[10px] leading-snug text-black/75 sm:text-[11px]">
          {site.hero.note}
        </p>
      </div>

      {/* Bottom corners */}
      <div className="flex items-end justify-between">
        <a href={`mailto:${site.email}`} className={`${CORNER} ${LINK}`}>
          {site.email}
        </a>
        <p className={`${CORNER} text-black/60`}>© {year}</p>
        <div className={`${CORNER} flex gap-4`}>
          {linkedin ? (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              LinkedIn
            </a>
          ) : null}
          {github ? (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
