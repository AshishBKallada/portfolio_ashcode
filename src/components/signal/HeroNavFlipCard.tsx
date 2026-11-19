"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { heroPinPhases } from "@/lib/heroPinScroll";
import { ASH_PAD, createCardBurn } from "./cardBurn";
import { DropCap } from "./Editions";

const about = site.aboutEdition;
/** The card's height (globals.css --card-h). */
const CARD_H = 464;

const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";

const links = [
  { href: "/", label: "Home" },
  { href: "/#index", label: "Work" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;

const ROMAN = ["I", "II", "III", "IV"] as const;

/**
 * Centred hero nav card: front is site chrome, back is About copy. Scroll drives
 * a horizontal flip before the cloud/figure reveal runs.
 */
export function HeroNavFlipCard({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const flip = useTransform(scrollY, (y) => heroPinPhases(y).flip);
  const rotateY = useTransform(flip, (v) => v * -180);

  // Leaving: as Work rises over the hero, the card is sucked down into its torn edge,
  // faster and faster, stretching tall and thin. The nav's layer sits between the
  // hero and Work (SignalNav), so Work's edge swallows it. Nothing fades; scrolling
  // back up plays it in reverse.
  const pullY = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  useMotionValueEvent(scrollY, "change", () => {
    const work = document.getElementById("index");
    if (!work || reduce) return;
    const vh = window.innerHeight;
    // Work's torn edge runs about 0.4vh ahead of the section's top. The pull starts as it
    // reaches the card's bottom edge and is done by the time it would cover the card.
    const front = work.getBoundingClientRect().top - vh * 0.4;
    const cardBottom = vh / 2 + CARD_H / 2;
    const t = Math.min(1, Math.max(0, (cardBottom - front) / (CARD_H * 0.9)));
    pullY.set(t * t * t * vh * 0.7);
    scaleY.set(1 + t * t * 0.4);
    scaleX.set(1 - t * t * 0.5);
  });

  // The card's polish follows the cursor: its highlight sits where the pointer is,
  // held inside the card, written straight to CSS so nothing re-renders.
  const flipper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = flipper.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = Math.min(1.2, Math.max(-0.2, (e.clientX - r.left) / r.width));
        const y = Math.min(1.2, Math.max(-0.2, (e.clientY - r.top) / r.height));
        el.style.setProperty("--sheen-x", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--sheen-y", `${(y * 100).toFixed(1)}%`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [reduce]);

  // While the pointer is on it, the card burns away from the bottom like paper, shedding
  // ash (cardBurn), and heals when it leaves. Hover is read from the card's box, not its
  // pointer events, since the burnt-away part no longer catches the pointer.
  const scene = useRef<HTMLDivElement>(null);
  const burnTarget = useRef<HTMLDivElement>(null);
  const embers = useRef<HTMLCanvasElement>(null);
  const ashes = useRef<HTMLCanvasElement>(null);
  const shown = useRef(visible);
  useEffect(() => {
    shown.current = visible;
  }, [visible]);
  useEffect(() => {
    if (reduce || !burnTarget.current || !embers.current || !ashes.current) return;
    const ash = ashes.current;
    const sceneBox = scene.current?.getBoundingClientRect();
    ash.width = Math.round((sceneBox?.width ?? 340) + ASH_PAD * 2);
    ash.height = Math.round((sceneBox?.height ?? CARD_H) + ASH_PAD * 2);
    const burn = createCardBurn(burnTarget.current, embers.current, ash);
    let inside = false;
    const move = (e: PointerEvent) => {
      const el = scene.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const now = shown.current && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (now === inside) return;
      inside = now;
      if (now) burn.ignite();
      else burn.heal();
    };
    const out = () => {
      if (inside) burn.heal();
      inside = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", out);
      burn.dispose();
    };
  }, [reduce]);

  // Kept mounted once hidden, so it stays in place until Work pulls it down.
  return (
    <div
      ref={scene}
      aria-hidden={!visible}
      inert={!visible}
      className="edition-nav__flip-scene pointer-events-none"
    >
      <motion.div
        ref={burnTarget}
        style={{ maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        className="relative h-full w-full"
      >
      <motion.div
        style={{ y: pullY, scaleX, scaleY }}
        className="h-full w-full origin-bottom"
      >
        <motion.div
          ref={flipper}
          style={reduce ? undefined : { rotateY }}
          className="edition-nav__flipper pointer-events-auto"
        >
          <div className="edition-nav__face edition-nav__face--front">
            <Link
              href="/"
              className="block font-headline text-[44px] leading-[0.95] tracking-[-0.035em] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {site.name}
            </Link>
            <span aria-hidden className="mt-3 block h-px w-10 bg-brand" />
            <p className="edition-nav__subtitle mt-4 max-w-[290px] font-narrative text-[20px] leading-[1.1] tracking-[-0.03em] text-balance">
              {site.tagline}
            </p>
            <nav aria-label="Primary" className="mt-auto pt-8">
              <ul>
                {links.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-end justify-between gap-2 py-2 font-headline text-[18px] leading-[0.95] tracking-[-0.02em] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
                    >
                      <span>{link.label}</span>
                      <span className="font-narrative text-[15px] tracking-normal tabular-nums text-[#ff8a6b] opacity-90 group-hover:opacity-100">
                        {ROMAN[i]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <section
            id="about"
            aria-label="About"
            className="edition-nav__face edition-nav__face--back flex flex-col"
          >
            <p className={`${smallLabel} text-[#ff8a6b]`}>{about.kicker}</p>
            <h2 className="mt-3 font-narrative text-[22px] leading-[0.95] tracking-[-0.04em] text-balance">
              <DropCap className="text-[20px]">{`${about.dropCap}${about.headline}`}</DropCap>
            </h2>
            <p className="mt-4 flex-1 font-narrative text-[15px] leading-[1.35] tracking-[-0.03em] text-white/90">
              {about.body}
            </p>
            <Link
              href={about.cta.href}
              className={`${smallLabel} mt-4 inline-flex min-h-9 items-center gap-2 rounded-[4px] border border-white/40 px-3 transition-colors hover:border-white/70 hover:bg-white/10`}
            >
              {about.cta.label}
              <span aria-hidden>↗</span>
            </Link>
          </section>
        </motion.div>
      </motion.div>
        {/* The char and the embers along the burning edge. */}
        <canvas ref={embers} aria-hidden className="pointer-events-none absolute inset-0 z-[3] h-full w-full" />
      </motion.div>
      {/* The ash it sheds, free of the card's mask so it can drift out past its edges. */}
      <canvas
        ref={ashes}
        aria-hidden
        className="pointer-events-none absolute z-[3]"
        style={{ inset: -ASH_PAD }}
      />
    </div>
  );
}
