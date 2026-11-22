"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";

const ease = [0.76, 0, 0.24, 1] as const;
const rise = [0.16, 1, 0.3, 1] as const;
const brush =
  "[font-family:var(--font-yuji),'Hiragino_Mincho_ProN','Yu_Mincho',serif]";
/** Seen this session: later loads skip straight to the hero. */
const SEEN_KEY = "ashcode-intro-seen";

/** The two statements, each two lines; `hot` marks the line set in brand red. */
const LINES = [
  { lines: ["Self-taught", "Developer"], hot: -1, jp: "独学の開発者" },
  { lines: ["Obsession", "Beats talent"], hot: 1, jp: "執念は才能に勝る" },
];
/** When each beat starts, in ms: first statement, second, lift. */
const AT = { second: 2100, lift: 4400, done: 5200 };

/**
 * The home page's intro: on near-black, SELF-TAUGHT DEVELOPER rises in huge, line by line,
 * with its Japanese small beside it; it leaves upward and OBSESSION BEATS TALENT rises in the
 * same way; then the black lifts off the hero, whose name starts its own entrance as it goes.
 * Once per session; a click or any key skips it. Elsewhere (or with reduced motion) it's
 * skipped outright.
 */
export function IntroSplash() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const { markLoaded } = useHeroIntro();
  const lenis = useLenis();
  // -1: not decided yet (server, first paint); 0, 1: the statement on screen; 2: lifting; 3: gone.
  const [beat, setBeat] = useState(-1);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const skip = pathname !== "/" || reduce || seen;
    // Decided on the first frame, then the beats on their clock.
    const timers = skip
      ? [
          window.setTimeout(() => {
            setBeat(3);
            markLoaded();
          }, 0),
        ]
      : [
          window.setTimeout(() => setBeat((b) => Math.max(b, 0)), 0),
          window.setTimeout(() => setBeat((b) => Math.max(b, 1)), AT.second),
          window.setTimeout(() => {
            setBeat((b) => Math.max(b, 2));
            markLoaded();
          }, AT.lift),
          window.setTimeout(() => setBeat(3), AT.done),
        ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Runs once on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seen once it lifts (not when it starts, so a remount on the way can't skip it).
  useEffect(() => {
    if (beat < 2) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, [beat]);

  // No scrolling under it; a click or a key skips to the lift.
  useEffect(() => {
    if (beat < 0 || beat > 1) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const skip = () => {
      setBeat(2);
      markLoaded();
      window.setTimeout(() => setBeat(3), AT.done - AT.lift);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [beat, lenis, markLoaded]);

  if (beat === 3) return null;

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={
        beat === 2
          ? { clipPath: "inset(0 0 100% 0)" }
          : { clipPath: "inset(0 0 0% 0)" }
      }
      transition={{ duration: 0.8, ease }}
      className="fixed inset-0 z-[999] flex items-center bg-[#140606] px-[6vw] text-white"
    >
      <AnimatePresence mode="wait">
        {beat === 0 || beat === 1 ? (
          <motion.div key={beat} className="relative w-full">
            {LINES[beat].lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-105%" }}
                  transition={{
                    duration: 0.75,
                    ease: rise,
                    delay: 0.1 + i * 0.09,
                  }}
                  className={`block font-display text-[min(15.5vw,30vh)] leading-[0.86] whitespace-nowrap uppercase ${i === LINES[beat].hot ? "text-brand" : ""}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease: rise, delay: 0.35 }}
              className={`absolute top-[0.6vh] right-0 text-[min(2.6vw,4.6vh)] tracking-[0.25em] text-white/80 [writing-mode:vertical-rl] ${brush}`}
            >
              {LINES[beat].jp}
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* Where the beat is: two short ticks at the foot. */}
      <div className="absolute bottom-[5vh] left-[6vw] flex gap-2">
        {LINES.map((_, i) => (
          <span
            key={i}
            className={`h-[2px] w-8 transition-colors duration-500 ${i <= beat ? "bg-white" : "bg-white/25"}`}
          />
        ))}
      </div>
      <span className="absolute right-[6vw] bottom-[5vh] font-headline text-[12px] tracking-[0.14em] text-white/50 uppercase">
        Click to skip
      </span>
    </motion.div>
  );
}
