// The site's two button looks, shared by every CTA so they read as one
// family: solid cream for the main action, cream outline for the rest.
const base =
  "inline-flex min-h-11 shrink-0 items-center gap-2 px-5 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 focus-visible:outline-ink";

export const buttonSolid = `${base} bg-ink text-wall hover:bg-flame`;
export const buttonOutline = `${base} border border-ink text-ink hover:bg-ink hover:text-wall`;
