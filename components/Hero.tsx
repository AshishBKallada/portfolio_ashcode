"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";
import { colors } from "@/lib/theme/colors";
import { HERO_COPY, HERO_MARQUEE } from "@/lib/constants/hero";
import { SITE } from "@/lib/constants/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const rockInnerRef = useRef<HTMLDivElement>(null);
  const charParallaxRef = useRef<HTMLDivElement>(null);
  const rockParallaxRef = useRef<HTMLDivElement>(null);
  const toriiParallaxRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  // Mouse-parallax wrappers — nested between the scroll-parallax (outer) and
  // entrance (inner) divs so each transform owns its own element.
  const toriiMouseRef = useRef<HTMLDivElement>(null);
  const rockMouseRef = useRef<HTMLDivElement>(null);
  const charMouseRef = useRef<HTMLDivElement>(null);
  const headlineMouseRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const [splashCfg, setSplashCfg] = useState<{ enabled: boolean; dye: number } | null>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);
  const entranceRanRef = useRef(false);

  // Probe device capabilities once — disable WebGL fluid on touch / reduced-motion,
  // and drop dye resolution on small screens to keep mobile smooth.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    setSplashCfg({
      enabled: !reduced && !coarse,
      dye: narrow ? 128 : 256,
    });
  }, []);

  // Pause heavy WebGL (SplashCursor) when Hero scrolls out of view
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

  // Entrance + staggered text reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      const startedAtTop = window.scrollY < 50;
      if (!startedAtTop) {
        // Mid-scroll refresh: skip entrance, signal header immediately
        window.dispatchEvent(new Event("hero:textDone"));
        return;
      }

      // Lock entrance state — held until loader finishes
      const tags = root.querySelectorAll(".hero-tag");
      const words = root.querySelectorAll(".hw");
      const ctas = root.querySelectorAll(".hero-cta");
      const marquee = root.querySelectorAll(".hero-marquee");

      if (imageInnerRef.current)
        gsap.set(imageInnerRef.current, { yPercent: 100, opacity: 1 });
      if (rockInnerRef.current)
        gsap.set(rockInnerRef.current, { yPercent: 100, opacity: 1 });
      if (toriiParallaxRef.current)
        gsap.set(toriiParallaxRef.current, { opacity: 0, scale: 1.06 });
      gsap.set(tags, { y: 18, opacity: 0 });
      gsap.set(words, { y: 90, opacity: 0 });
      gsap.set(ctas, { y: 22, opacity: 0 });
      gsap.set(marquee, { yPercent: 100, opacity: 0 });

      const runEntrance = () => {
        if (entranceRanRef.current) return;
        entranceRanRef.current = true;

        const tl = gsap.timeline();

        // 0) Torii materializes first — sets the stage, breathes for a beat
        if (toriiParallaxRef.current) {
          tl.to(
            toriiParallaxRef.current,
            { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
            0
          );
        }

        // 1) Hero text cascades in while the gate is still settling
        tl.to(tags, { y: 0, opacity: 0.7, duration: 0.7, ease: "power2.out" }, 0.45)
          .to(
            words,
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.08,
              ease: "power4.out",
            },
            "-=0.3"
          )
          .to(
            ctas,
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.35"
          );

        // 2) Signal the navbar to drop in once the main text has settled
        tl.add(() => {
          window.dispatchEvent(new Event("hero:textDone"));
        }, 1.9);

        // 3) Rock platform rises only AFTER the headline's first animation
        if (rockInnerRef.current) {
          tl.to(
            rockInnerRef.current,
            { yPercent: 0, duration: 1.25, ease: "power3.out" },
            2.0
          );
        }

        // 4) Character rises after the rock has mostly landed (slight overlap for flow)
        if (imageInnerRef.current) {
          tl.to(
            imageInnerRef.current,
            { yPercent: 0, duration: 1.35, ease: "power3.out" },
            2.75
          );
        }

        // 5) Marquee slides up into place after the figures are settled
        tl.to(
          marquee,
          { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          3.6
        );

        // Headline gets two layered animations:
        //   a) slide-up + fade-in (already running above)
        //   b) scramble pass that lands AFTER the slide settles, so it reads
        const labels = HERO_COPY.headline;
        const hwEls = Array.from(words) as HTMLElement[];
        hwEls.forEach((el, i) => {
          window.setTimeout(
            () =>
              scrambleText(el, labels[i] ?? el.textContent ?? "", {
                duration: 850,
              }),
            1900 + i * 130
          );
          el.addEventListener("mouseenter", () => {
            scrambleText(el, labels[i] ?? el.textContent ?? "", { duration: 480 });
          });
        });
      };

      const onLoaderDone = () => {
        window.clearTimeout(safety);
        runEntrance();
      };
      window.addEventListener("loader:done", onLoaderDone, { once: true });
      // Safety: if loader event is missed, still reveal after loader finishes
      const safety = window.setTimeout(onLoaderDone, 6000);

      return () => {
        window.removeEventListener("loader:done", onLoaderDone);
        window.clearTimeout(safety);
      };
    });
    return () => ctx.revert();
  }, []);

  // Cursor parallax — layers shift toward the cursor at different magnitudes
  // to give the scene depth. Disabled on touch + reduced-motion.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    // Larger magnitude = appears closer to the viewer.
    const layers: { ref: React.RefObject<HTMLDivElement>; mx: number; my: number }[] = [
      { ref: toriiMouseRef, mx: 10, my: 6 },
      { ref: rockMouseRef, mx: 22, my: 12 },
      { ref: charMouseRef, mx: 36, my: 18 },
      { ref: headlineMouseRef, mx: 14, my: 8 },
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
      // Normalize cursor to [-1, 1] relative to section center.
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

  // Parallax on scroll — different layers move at different speeds for depth
  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      const trigger = {
        trigger: root,
        start: "top top",
        end: "+=100%",
        scrub: 0.6,
      } as const;

      if (toriiParallaxRef.current) {
        gsap.to(toriiParallaxRef.current, {
          y: -25,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      if (rockParallaxRef.current) {
        gsap.to(rockParallaxRef.current, {
          y: -60,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      if (charParallaxRef.current) {
        gsap.to(charParallaxRef.current, {
          y: -140,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      const headline = root.querySelector(".hero-headline");
      if (headline) {
        gsap.to(headline, {
          y: 90,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      const fadeTrigger = {
        trigger: root,
        start: "top top",
        end: "+=85%",
        scrub: 0.45,
      } as const;

      if (visualsRef.current) {
        gsap.to(visualsRef.current, {
          opacity: 0.28,
          filter: "blur(14px)",
          ease: "none",
          scrollTrigger: fadeTrigger,
        });
      }

      if (scrimRef.current) {
        gsap.to(scrimRef.current, {
          opacity: 0.82,
          ease: "none",
          scrollTrigger: fadeTrigger,
        });
      }

      const marquee = root.querySelector(".hero-marquee");
      if (headline) {
        gsap.to(headline, {
          opacity: 0,
          ease: "none",
          scrollTrigger: fadeTrigger,
        });
      }
      if (marquee) {
        gsap.to(marquee, {
          opacity: 0,
          ease: "none",
          scrollTrigger: fadeTrigger,
        });
      }

      root.querySelectorAll(".hero-scroll-ui").forEach((el) => {
        gsap.to(el, {
          opacity: 0,
          ease: "none",
          scrollTrigger: fadeTrigger,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky top-0 z-0 w-full h-screen min-h-screen overflow-hidden bg-paper dark:bg-transparent text-black"
    >
      <div ref={visualsRef} className="absolute inset-0 will-change-[opacity,filter]">
      {/* Torii gate — full-screen looping video backdrop behind rock + character */}
      <div
        ref={toriiParallaxRef}
        className="pointer-events-none absolute inset-0 z-[1] will-change-transform"
        aria-hidden
      >
        <div ref={toriiMouseRef} className="absolute inset-0 will-change-transform">
          <video
            src="/hero-torii.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Foreground hero figure — always visible */}
      <div className="pointer-events-none absolute inset-0 z-[3] will-change-transform">
        {/* Rock platform — scroll parallax / mouse parallax / entrance / content */}
        <div ref={rockParallaxRef} className="pointer-events-none absolute inset-0 will-change-transform">
          <div ref={rockMouseRef} className="absolute inset-0 will-change-transform">
            <div ref={rockInnerRef} className="absolute inset-0 will-change-transform">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70vmin] max-w-[520px] aspect-[640/440]">
                <Image
                  src="/hero-rock.png"
                  alt=""
                  fill
                  priority
                  sizes="70vmin"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Samurai character — scroll parallax / mouse parallax / entrance / content */}
        <div ref={charParallaxRef} className="absolute inset-0 will-change-transform">
          <div ref={charMouseRef} className="absolute inset-0 will-change-transform">
            <div ref={imageInnerRef} className="absolute inset-0 will-change-transform">
              <Image
                src="/hero-bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                quality={100}
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SplashCursor — only mount when Hero is in view, hardware supports it,
          and the user hasn't asked for reduced motion. */}
      {inView && splashCfg?.enabled && (
        <SplashCursor
          RAINBOW_MODE={false}
          COLOR={colors.accent}
          SIM_RESOLUTION={48}
          DYE_RESOLUTION={splashCfg.dye}
          PRESSURE_ITERATIONS={3}
          SHADING={false}
        />
      )}
      </div>

      {/* Scrim — lifts as you scroll so content above stays readable */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-paper opacity-0"
      />

{/* Headline block — bottom-left. Colors inherit from section via currentColor */}
      <div
        ref={headlineMouseRef}
        className="hero-headline absolute left-0 right-0 bottom-24 md:bottom-28 z-[3] px-6 md:px-12 max-w-2xl md:max-w-3xl pointer-events-none will-change-transform"
      >
        <p className="hero-tag font-body text-xs uppercase tracking-[0.3em] mb-4 opacity-0">
          {HERO_COPY.tag}
        </p>
        <h1 className="font-headline text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.85] tracking-[-0.02em]">
          <span className="hw inline-block mr-[0.18em] cursor-pointer opacity-0">{HERO_COPY.headline[0]}</span>
          <span className="hw inline-block mr-[0.18em] italic cursor-pointer opacity-0">{HERO_COPY.headline[1]}</span>
          <br />
          <span className="hw inline-block cursor-pointer opacity-0">{HERO_COPY.headline[2]}</span>
        </h1>
        <div className="hero-cta mt-8 flex flex-wrap gap-4 items-center opacity-0">
          <a
            ref={ctaRef}
            href={`mailto:${SITE.email}`}
            data-cursor="cta"
            className="group pointer-events-auto relative inline-flex items-center gap-2 px-6 py-3 border border-black overflow-hidden font-headline text-lg text-black will-change-transform"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1] transition-colors duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white">{HERO_COPY.ctaLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-[1] transition-[transform,color] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 group-hover:text-white"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
          <span className="font-body text-xs uppercase tracking-[0.2em] opacity-70">
            {HERO_COPY.availability}
          </span>
        </div>

      </div>

      {/* Hex tag — sits above the marquee */}
      <div className="hero-scroll-ui absolute bottom-16 left-6 md:bottom-20 md:left-12 z-[4] font-body text-[11px] tracking-[0.2em] opacity-70">
        {HERO_COPY.hexTag}
      </div>

      {/* "Scroll to explore" — sits above the marquee */}
      <div className="hero-scroll-ui absolute bottom-16 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 pointer-events-none opacity-90 text-white">
        <p className="font-body text-xs uppercase tracking-[0.25em]">{HERO_COPY.scroll}</p>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 animate-bounce"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Marquee ticker — full width at the very bottom */}
      <div
        className="hero-marquee absolute bottom-0 left-0 right-0 z-[4] overflow-hidden py-2.5 bg-white/75 text-black opacity-0 will-change-transform shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.2)] backdrop-blur-sm"
        aria-hidden
      >
        <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
          {Array.from({ length: 2 }).map((_, copy) => (
            <div key={copy} className="flex shrink-0 items-center font-body text-[10px] uppercase tracking-[0.32em]">
              {HERO_MARQUEE.map((s, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="px-8">{s}</span>
                  <span className="opacity-70">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
