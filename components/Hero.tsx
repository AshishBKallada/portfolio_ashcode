"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";
import { HERO_COPY, HERO_IMAGE } from "@/lib/constants/hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

type LenisLike = { scrollTo: (target: number | string | HTMLElement) => void };

function smoothScrollTo(target: string) {
  const el = document.getElementById(target);
  if (!el) return;
  const lenis = (typeof window !== "undefined"
    ? (window as unknown as { __lenis?: LenisLike }).__lenis
    : undefined);
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroImageDriftRef = useRef<HTMLDivElement>(null);
  const heroImageMouseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.18);
  const entranceRanRef = useRef(false);
  const variantIdxRef = useRef(0);

  const [inView, setInView] = useState(true);
  const [splashCfg, setSplashCfg] = useState<{ enabled: boolean; dye: number } | null>(null);
  const { resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => setThemeMounted(true), []);

  const isDarkTheme = themeMounted && resolvedTheme === "dark";
  const splashColor = "#ffffff";
  const splashStrength = isDarkTheme ? 0.32 : 0.18;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    setSplashCfg({
      enabled: !reduced && !coarse,
      dye: narrow ? 128 : 256,
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      const startedAtTop = window.scrollY < 50;
      if (!startedAtTop) {
        window.dispatchEvent(new Event("hero:textDone"));
        return;
      }

      const heroImage = root.querySelector(".hero-image-inner");
      const lines = root.querySelectorAll(".hero-line");
      const ui = root.querySelectorAll(".hero-ui");

      if (heroImage) gsap.set(heroImage, { opacity: 0, scale: 1.06 });
      gsap.set(lines, { y: 80, opacity: 0 });
      gsap.set(ui, { y: 24, opacity: 0 });

      const runEntrance = () => {
        if (entranceRanRef.current) return;
        entranceRanRef.current = true;

        const tl = gsap.timeline();

        if (heroImage) {
          tl.to(heroImage, { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, 0);
        }

        tl.to(lines, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        }, 0.35)
          .to(ui, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" }, "-=0.45");

        tl.add(() => {
          window.dispatchEvent(new Event("hero:textDone"));
        }, 1.1);

        const labels = HERO_COPY.headline;
        const lineEls = Array.from(lines) as HTMLElement[];
        lineEls.forEach((el, i) => {
          window.setTimeout(
            () =>
              scrambleText(el, labels[i] ?? el.textContent ?? "", {
                duration: 800,
              }),
            1500 + i * 140
          );
        });
      };

      const onLoaderDone = () => {
        window.clearTimeout(safety);
        runEntrance();
      };
      window.addEventListener("loader:done", onLoaderDone, { once: true });
      const safety = window.setTimeout(onLoaderDone, 6000);

      return () => {
        window.removeEventListener("loader:done", onLoaderDone);
        window.clearTimeout(safety);
      };
    });
    return () => ctx.revert();
  }, []);

  // Cycle the hero headline between English and Japanese on a smooth interval.
  // Reads variantIdxRef so the hover handler always scrambles to the current variant.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const variants = [HERO_COPY.headline, HERO_COPY.headlineJp] as const;
    const lineEls = Array.from(
      root.querySelectorAll<HTMLElement>(".hero-line")
    );
    if (lineEls.length === 0) return;

    const applyVariantClass = () => {
      const isJp = variantIdxRef.current === 1;
      lineEls.forEach((el) => el.classList.toggle("is-jp", isJp));
    };

    const scrambleAll = (duration: number) => {
      applyVariantClass();
      const labels = variants[variantIdxRef.current];
      lineEls.forEach((el, i) => {
        scrambleText(el, labels[i] ?? "", { duration });
      });
    };

    const hoverHandlers = lineEls.map((el, i) => {
      const onEnter = () => {
        applyVariantClass();
        const labels = variants[variantIdxRef.current];
        scrambleText(el, labels[i] ?? "", { duration: 420 });
      };
      el.addEventListener("mouseenter", onEnter);
      return { el, onEnter };
    });

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let intervalId: number | undefined;
    const startDelay = window.setTimeout(() => {
      if (reduced) return;
      intervalId = window.setInterval(() => {
        variantIdxRef.current = (variantIdxRef.current + 1) % variants.length;
        scrambleAll(1100);
      }, 12000);
    }, 8000);

    return () => {
      window.clearTimeout(startDelay);
      if (intervalId !== undefined) window.clearInterval(intervalId);
      hoverHandlers.forEach(({ el, onEnter }) =>
        el.removeEventListener("mouseenter", onEnter)
      );
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const layers = [
      { ref: heroImageMouseRef, mx: 28, my: 18 },
    ];

    const setters = layers
      .map((l) =>
        l.ref.current
          ? {
              x: gsap.quickTo(l.ref.current, "x", { duration: 0.8, ease: "power3.out" }),
              y: gsap.quickTo(l.ref.current, "y", { duration: 0.8, ease: "power3.out" }),
              mx: l.mx,
              my: l.my,
            }
          : null
      )
      .filter((s): s is NonNullable<typeof s> => s !== null);

    if (setters.length === 0) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setters.forEach((s) => {
        s.x(nx * s.mx);
        s.y(ny * s.my);
      });
    };

    const onLeave = () => {
      setters.forEach((s) => {
        s.x(0);
        s.y(0);
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Drift the figure down + right and scale it down as the user scrolls,
  // so it lands over the top of the intro portrait. Eases back on scroll up.
  useEffect(() => {
    const root = sectionRef.current;
    const target = heroImageDriftRef.current;
    if (!root || !target) return;

    const ctx = gsap.context(() => {
      gsap.to(target, {
        yPercent: 58,
        xPercent: 24,
        scale: 0.65,
        transformOrigin: "50% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-screen min-h-screen [overflow-x:clip] [overflow-y:visible] bg-paper text-ink transition-colors duration-500"
    >
      {/* Block display title — behind figure, hugging the left edge */}
      <div className="hero-headline pointer-events-none absolute inset-y-0 left-0 z-[1] flex w-full items-center px-5 md:px-10 lg:px-12">
        <h1 className="font-main font-normal not-italic leading-[0.92] tracking-[0.02em] text-[clamp(2.5rem,9vw,7.5rem)] select-none">
          {HERO_COPY.headline.map((line) => (
            <span
              key={line}
              className="hero-line block cursor-pointer will-change-transform"
            >
              {line}
            </span>
          ))}
        </h1>
      </div>

      {/* Center figure — overlaps headline, drifts into next section on scroll */}
      <div className="absolute inset-0 z-[20] [overflow:visible]">
        <div
          ref={heroImageDriftRef}
          className="absolute left-1/2 top-[38%] z-[1] h-[min(92vh,900px)] w-[min(88vw,620px)] -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
        >
          <div
            ref={heroImageMouseRef}
            className="hero-image-inner relative h-full w-full will-change-transform"
          >
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 88vw, 620px"
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {inView && splashCfg?.enabled && themeMounted && (
          <SplashCursor
            key={`${splashColor}-${splashStrength}`}
            RAINBOW_MODE={false}
            COLOR={splashColor}
            COLOR_STRENGTH={splashStrength}
            SIM_RESOLUTION={48}
            DYE_RESOLUTION={splashCfg.dye}
            PRESSURE_ITERATIONS={3}
            SHADING={false}
          />
        )}
      </div>

      {/* Bottom-left note */}
      <div className="hero-ui absolute bottom-6 md:bottom-10 left-4 md:left-8 lg:left-12 z-[4] max-w-[240px] md:max-w-[260px]">
        <p className="font-headline text-sm md:text-base italic leading-snug text-ink">
          {HERO_COPY.bottomTitle}
        </p>
        <p className="mt-3 font-body text-[11px] md:text-xs leading-[1.7] text-ink/55">
          {HERO_COPY.bottomNote}
        </p>
        <span aria-hidden className="mt-5 flex items-center gap-2 text-ink/40">
          <span className="block h-px w-20 bg-current" />
          <span className="text-xs leading-none">→</span>
        </span>
      </div>

      {/* Center CTA — plain text stacked above a down arrow, both centered */}
      <div className="hero-ui absolute bottom-10 md:bottom-12 left-1/2 z-[5] -translate-x-1/2">
        <a
          ref={ctaRef}
          href="#contact"
          data-cursor="cta"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("contact");
          }}
          className="group pointer-events-auto inline-flex flex-col items-center gap-2 font-body text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-ink/80 will-change-transform transition-colors duration-300 hover:text-ink"
        >
          <span>{HERO_COPY.ctaLabel}</span>
          <span
            aria-hidden
            className="text-base leading-none transition-transform duration-300 group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </a>
      </div>

      {/* Bottom-right aside */}
      <div className="hero-ui absolute bottom-10 md:bottom-12 right-5 md:right-10 z-[4] hidden md:block max-w-[200px] text-right">
        <p className="meta-label text-ink/40 tracking-[0.22em]">
          {HERO_COPY.aside.jp}
        </p>
        <p className="mt-2 font-headline text-base italic leading-snug text-ink/75">
          {HERO_COPY.aside.line}
        </p>
        <span aria-hidden className="mt-4 ml-auto block h-px w-12 bg-ink/25" />
      </div>
    </section>
  );
}
