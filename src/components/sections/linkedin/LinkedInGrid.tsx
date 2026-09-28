import { linkedinSays } from "@/data/linkedin";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { LinkedInCard } from "./LinkedInCard";

const CELL = "relative aspect-square border-r border-b border-black/15";
const GLASS =
  "bg-black/[0.05] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";

// Sparkles sit on the inner grid-line crossings of the 4×4 desktop layout.
const SPARKLES = [1, 2, 3].flatMap((row) =>
  [1, 2, 3].map((col) => ({ top: `${row * 25}%`, left: `${col * 25}%` })),
);

export function LinkedInGrid() {
  const [first, second, third, fourth, fifth, sixth] = linkedinSays.items;

  return (
    <div className="relative grid grid-cols-2 border-t border-l border-black/15 md:grid-cols-4">
      {/* Row 1 */}
      <div className={`${CELL} hidden md:block`} />
      <div className={`${CELL} flex items-center justify-center bg-black/[0.06] p-4`}>
        <p className="max-w-[9rem] text-sm leading-tight text-black/80 sm:text-base">
          {linkedinSays.teaser}
        </p>
      </div>
      <div className={`${CELL} hidden md:block`} />
      <div className={`${CELL}`} />

      {/* Row 2 — headline */}
      <div className={`${CELL} hidden md:block`} />
      <div className="relative col-span-2 flex items-center border-r border-b border-black/15 px-4 py-8 md:col-span-3 md:px-8 md:py-4">
        <SectionReveal className="w-full">
          <h2 className="grid grid-cols-[auto_1fr] items-end gap-x-4 gap-y-1 sm:gap-x-6">
            <em className="font-serif text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] font-light italic tracking-tight">
              {linkedinSays.headingItalic}
            </em>
            <span className="pb-2 text-[clamp(0.95rem,2.2vw,1.75rem)] leading-tight">
              {linkedinSays.headingSmallOne}
            </span>
            <span className="justify-self-end pb-2 text-right text-[clamp(0.8rem,1.8vw,1.4rem)] leading-tight text-black/70">
              {linkedinSays.headingSmallTwo}
            </span>
            <span className="font-sans text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] tracking-tight">
              {linkedinSays.headingLarge}
            </span>
          </h2>
        </SectionReveal>
      </div>

      {/* Row 3 */}
      <LinkedInCard item={first} className={CELL} />
      <LinkedInCard item={second} className={CELL} />
      <LinkedInCard item={third} className={CELL} />
      <div className={`${CELL} flex items-center p-4`}>
        <p className="max-w-[10rem] text-sm leading-tight text-black/75 sm:text-base">
          {linkedinSays.stat}
        </p>
      </div>

      {/* Row 4 */}
      <LinkedInCard item={fourth} className={CELL} />
      <LinkedInCard item={fifth} className={CELL} />
      <LinkedInCard item={sixth} className={CELL} />
      <div className={`${CELL} flex items-end justify-center p-3 sm:p-4`}>
        <a
          href={linkedinSays.href}
          target="_blank"
          rel="noreferrer"
          className={`${GLASS} group/cta flex w-full items-center justify-between gap-3 rounded-full px-4 py-3 text-sm text-black transition-colors hover:bg-black/10 sm:text-base`}
        >
          {linkedinSays.cta}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/cta:translate-x-1"
          >
            →
          </span>
        </a>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {SPARKLES.map((s) => (
          <span
            key={`${s.top}-${s.left}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] leading-none text-black"
            style={{ top: s.top, left: s.left }}
          >
            ✦
          </span>
        ))}
      </div>
    </div>
  );
}
