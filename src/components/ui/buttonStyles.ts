// The site's button family, shared by every CTA so they read as one set:
// sentence case, a square marker, a pressed nudge. Solid ink is the main
// action on the red ground, ink outline the secondary, cream the main action
// on dark panels.
const base =
  "inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-[3px] px-4 font-sans text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,transform] duration-200 active:translate-y-px";

export const buttonSolid = `${base} bg-ink text-cream hover:bg-oxblood`;
export const buttonOutline = `${base} border border-ink text-ink hover:bg-ink hover:text-cream`;
export const buttonCream = `${base} bg-cream text-ink hover:bg-white`;
