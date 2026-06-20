/** Reusable Tailwind class strings — semantic tokens from globals.css where possible. */
export const themeClasses = {
  body: "m-0 p-0 font-body antialiased bg-paper text-ink transition-colors",

  section: {
    transparent: "relative z-10 bg-transparent text-ink",
    paper: "relative z-10 w-full bg-paper text-ink",
    contact:
      "relative z-10 w-full bg-paper text-ink border-t border-ink/10 overflow-hidden",
    projects:
      "relative isolate z-10 w-full bg-transparent text-ink px-6 md:px-12 lg:px-20 py-24 md:py-36 overflow-hidden",
    statement: "relative z-10 bg-transparent text-ink px-4 md:px-6 py-16 md:py-24",
  },

  hero: {
    section:
      "sticky top-0 z-0 w-full h-screen min-h-screen overflow-hidden bg-paper dark:bg-transparent text-black",
    cta: "group pointer-events-auto relative inline-flex items-center gap-2 px-6 py-3 border border-black overflow-hidden font-headline text-lg text-black will-change-transform",
    ctaFill:
      "pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100",
    ctaLabel:
      "relative z-[1] transition-colors duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white",
    ctaIcon:
      "relative z-[1] transition-[transform,color] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 group-hover:text-white",
    marquee:
      "hero-marquee absolute bottom-0 left-0 right-0 z-[4] overflow-hidden py-2.5 bg-white/75 text-black opacity-0 will-change-transform shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.2)] backdrop-blur-sm",
  },

  terminal: {
    card: "relative mx-auto max-w-6xl overflow-hidden rounded-[5px] md:rounded-[8px] border border-ink/15 bg-surface text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.72)]",
    titleBar:
      "relative flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-ink/10 bg-ink/[0.04] dark:bg-ink/[0.06]",
    body: "relative px-6 md:px-12 py-16 md:py-24 text-center",
    label: "relative z-[1] font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 text-ink/55",
    headline:
      "relative z-[1] font-headline tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-ink",
    bodyText:
      "relative z-[1] font-body text-sm md:text-base leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto text-ink/75",
    link: "inline-block italic text-ink/55 underline decoration-ink/20 underline-offset-[0.18em] decoration-[0.04em] group-hover:text-ink group-hover:decoration-ink/60 transition-colors",
  },

  loader: {
    overlay:
      "fixed inset-0 z-[10000] flex items-center justify-center pointer-events-auto",
    percent:
      "absolute bottom-4 right-4 md:bottom-8 md:right-10 font-headline italic tabular-nums tracking-[-0.04em] leading-none",
  },

  overHero: {
    headerText: "text-black [text-shadow:0_1px_12px_rgba(255,255,255,0.65)]",
    inkText: "text-ink",
    mobileMenu: "bg-black/75 text-white",
    mobileMenuBelow: "bg-paper/95 text-ink border border-ink/10",
    floatingTone: "text-black",
    floatingToneBelow: "text-ink",
    floatingRing: "border border-black/25 bg-white/60",
    floatingRingBelow: "border border-ink/25 bg-paper/60",
  },

  accent: {
    playingGlow: "shadow-[0_0_30px_rgba(255,26,26,0.55)] ring-1 ring-accent/60",
  },
} as const;

export const OVER_HERO_THRESHOLD_PX = 72;

export function overHeroTone(overHero: boolean) {
  return {
    header: overHero ? themeClasses.overHero.headerText : themeClasses.overHero.inkText,
    mobileMenu: overHero
      ? themeClasses.overHero.mobileMenu
      : themeClasses.overHero.mobileMenuBelow,
    floatingTone: overHero
      ? themeClasses.overHero.floatingTone
      : themeClasses.overHero.floatingToneBelow,
    floatingRing: overHero
      ? themeClasses.overHero.floatingRing
      : themeClasses.overHero.floatingRingBelow,
  };
}
