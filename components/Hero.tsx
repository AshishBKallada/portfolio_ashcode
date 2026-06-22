"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";
import { colors } from "@/lib/theme/colors";
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
  const heroImageScrollRef = useRef<HTMLDivElement>(null);
  const heroImageMouseRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.18);
  const entranceRanRef = useRef(false);

  const [inView, setInView] = useState(true);
  const [splashCfg, setSplashCfg] = useState<{ enabled: boolean; dye: number } | null>(null);
  const { resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => setThemeMounted(true), []);

  const isDarkTheme = themeMounted && resolvedTheme === "dark";
  const splashColor = isDarkTheme ? colors.accent : "#000000";
  const splashStrength = isDarkTheme ? 0.15 : 0.42;

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
          el.addEventListener("mouseenter", () => {
            scrambleText(el, labels[i] ?? el.textContent ?? "", { duration: 420 });
          });
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      const scrollTrigger = {
        trigger: root,
        start: "top top",
        end: "+=100%",
        scrub: 0.6,
      } as const;

      if (heroImageScrollRef.current) {
        gsap.to(heroImageScrollRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger,
        });
      }

      const fadeTrigger = {
        trigger: root,
        start: "bottom top",
        end: "+=100%",
        scrub: 0.45,
      } as const;

      if (visualsRef.current) {
        gsap.fromTo(
          visualsRef.current,
          { opacity: 1, filter: "blur(0px)" },
          {
            opacity: 0.15,
            filter: "blur(16px)",
            ease: "none",
            scrollTrigger: fadeTrigger,
          }
        );
      }

      const resetHeroContent = () => {
        gsap.set(root.querySelectorAll(".hero-headline, .hero-ui, .hero-line"), {
          opacity: 1,
          y: 0,
        });
        if (visualsRef.current) {
          gsap.set(visualsRef.current, { opacity: 1, filter: "blur(0px)" });
        }
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        onEnterBack: resetHeroContent,
        onLeaveBack: resetHeroContent,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky top-0 z-0 w-full h-screen min-h-screen overflow-hidden bg-paper text-ink transition-colors duration-500"
    >
      {/* Block display title — behind figure */}
      <div className="hero-headline pointer-events-none absolute inset-0 z-[1] flex items-center px-5 md:px-10 lg:px-12">
        <h1 className="font-main font-normal not-italic leading-[0.92] tracking-[0.03em] text-[clamp(2.75rem,11vw,8.5rem)] select-none">
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

      {/* Center figure */}
      <div ref={visualsRef} className="absolute inset-0 z-[2] will-change-[opacity,filter]">
        <div
          ref={heroImageScrollRef}
          className="absolute left-1/2 top-[46%] z-[1] h-[min(72vh,720px)] w-[min(78vw,520px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
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
              sizes="(max-width: 1024px) 78vw, 520px"
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
      <div className="hero-ui absolute bottom-6 md:bottom-8 left-4 md:left-6 lg:left-10 z-[4] max-w-[220px] md:max-w-xs">
        <p className="font-headline text-[11px] md:text-xs leading-[1.75] text-ink/55">
          {HERO_COPY.note}
        </p>
        <span aria-hidden className="mt-5 block h-px w-14 bg-ink/30" />
      </div>

      {/* Center CTA */}
      <div className="hero-ui absolute bottom-12 md:bottom-14 left-1/2 z-[5] -translate-x-1/2">
        <a
          ref={ctaRef}
          href="#contact"
          data-cursor="cta"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("contact");
          }}
          className="group pointer-events-auto inline-flex items-center gap-3 bg-ink px-7 md:px-9 py-3.5 md:py-4 font-body text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-paper will-change-transform transition-[transform,background-color,color] duration-300 hover:scale-[1.02] hover:bg-ink/90 active:scale-[0.98]"
        >
          {HERO_COPY.ctaLabel}
          <span aria-hidden className="text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="hero-ui absolute bottom-8 md:bottom-10 left-1/2 z-[4] flex -translate-x-1/2 flex-col items-center gap-3 pointer-events-none text-ink/60">
        <p className="font-headline text-[10px] md:text-[11px] uppercase tracking-[0.38em] leading-none">
          {HERO_COPY.scroll}
        </p>
        <span aria-hidden className="block h-10 md:h-14 w-px bg-current opacity-60" />
      </div>
    </section>
  );
}
