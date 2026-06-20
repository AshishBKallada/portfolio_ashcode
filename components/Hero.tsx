"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";

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
      gsap.set(tags, { y: 18, opacity: 0 });
      gsap.set(words, { y: 90, opacity: 0 });
      gsap.set(ctas, { y: 22, opacity: 0 });
      gsap.set(marquee, { yPercent: 100, opacity: 0 });

      const runEntrance = () => {
        if (entranceRanRef.current) return;
        entranceRanRef.current = true;

        const tl = gsap.timeline();

        // 1) Hero text cascades in first
        tl.to(tags, { y: 0, opacity: 0.7, duration: 0.7, ease: "power2.out" })
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

        // 2) Signal the navbar to drop in
        tl.add(() => {
          window.dispatchEvent(new Event("hero:textDone"));
        }, "+=0.1");

        // 3) Rock platform rises first (after header lands)
        if (rockInnerRef.current) {
          tl.to(
            rockInnerRef.current,
            { yPercent: 0, duration: 1.1, ease: "power3.out" },
            "+=0.85"
          );
        }

        // 4) Character rises on top of the rock
        if (imageInnerRef.current) {
          tl.to(
            imageInnerRef.current,
            { yPercent: 0, duration: 1.3, ease: "power3.out" },
            "-=0.4"
          );
        }

        // 5) Marquee slides up into place
        tl.to(
          marquee,
          { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.25"
        );

        // Scramble headline words in sync with the words tween (early in the timeline)
        const labels = ["Obsession", "beats", "talent."];
        const hwEls = Array.from(words) as HTMLElement[];
        hwEls.forEach((el, i) => {
          window.setTimeout(
            () => scrambleText(el, labels[i] ?? el.textContent ?? "", { duration: 900 }),
            700 + i * 80
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky top-0 z-0 w-full min-h-screen overflow-hidden bg-paper text-ink"
    >
      {/* Torii gate — atmospheric background layer, sits behind the rock + samurai */}
      <div
        ref={toriiParallaxRef}
        className="pointer-events-none absolute inset-0 z-[1] will-change-transform"
        aria-hidden
      >
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[18vh] md:bottom-[12vh] w-[90vmin] max-w-[820px] aspect-square opacity-[0.18] dark:opacity-[0.22] mix-blend-luminosity">
          <Image
            src="/hero-torii.png"
            alt=""
            fill
            priority
            sizes="90vmin"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Foreground hero figure — always visible */}
      <div className="pointer-events-none absolute inset-0 z-[3] will-change-transform">
        {/* Rock platform — scroll parallax / entrance / content */}
        <div ref={rockParallaxRef} className="pointer-events-none absolute inset-0 will-change-transform">
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

        {/* Samurai character — scroll parallax / entrance / content */}
        <div ref={charParallaxRef} className="absolute inset-0 will-change-transform">
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

      {/* SplashCursor — only mount when Hero is in view, hardware supports it,
          and the user hasn't asked for reduced motion. */}
      {inView && splashCfg?.enabled && (
        <SplashCursor
          RAINBOW_MODE={false}
          COLOR="#ff1a1a"
          SIM_RESOLUTION={48}
          DYE_RESOLUTION={splashCfg.dye}
          PRESSURE_ITERATIONS={3}
          SHADING={false}
        />
      )}

{/* Headline block — bottom-left. Colors inherit from section via currentColor */}
      <div className="hero-headline absolute left-0 right-0 bottom-24 md:bottom-28 z-[3] px-6 md:px-12 max-w-2xl md:max-w-3xl pointer-events-none will-change-transform">
        <p className="hero-tag font-body text-xs uppercase tracking-[0.3em] mb-4 opacity-0">
          Full-stack engineer / Kerala, India
        </p>
        <h1 className="font-headline text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.85] tracking-[-0.02em]">
          <span className="hw inline-block mr-[0.18em] cursor-pointer opacity-0">Obsession</span>
          <span className="hw inline-block mr-[0.18em] italic cursor-pointer opacity-0">beats</span>
          <br />
          <span className="hw inline-block cursor-pointer opacity-0">talent.</span>
        </h1>
        <div className="hero-cta mt-8 flex flex-wrap gap-4 items-center opacity-0">
          <a
            ref={ctaRef}
            href="mailto:ashercode4u@gmail.com"
            data-cursor="cta"
            className="group pointer-events-auto relative inline-flex items-center gap-2 px-6 py-3 border border-ink overflow-hidden font-headline text-lg will-change-transform"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1] transition-colors duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-paper">Get in Touch</span>
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
              className="relative z-[1] transition-[transform,color] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45 group-hover:text-paper"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
          <span className="font-body text-xs uppercase tracking-[0.2em] opacity-70">
            Available · Q3 2026
          </span>
        </div>

      </div>

      {/* Hex tag — sits above the marquee */}
      <div className="absolute bottom-16 left-6 md:bottom-20 md:left-12 z-[4] font-body text-[11px] tracking-[0.2em] opacity-70">
        0x2f·7a · 4b · ff · 01 · 3c · ae →
      </div>

      {/* "Scroll to explore" — sits above the marquee */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 pointer-events-none opacity-90">
        <p className="font-body text-xs uppercase tracking-[0.25em]">Scroll to explore</p>
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
        className="hero-marquee absolute bottom-0 left-0 right-0 z-[4] overflow-hidden py-2.5 bg-ink text-paper opacity-0 will-change-transform shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.45)]"
        aria-hidden
      >
        <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
          {Array.from({ length: 2 }).map((_, copy) => (
            <div key={copy} className="flex shrink-0 items-center font-body text-[10px] uppercase tracking-[0.32em]">
              {[
                "Available · Q3 2026",
                "一期一会",
                "Kerala · IST",
                "努力は才能を超える",
                "Full-stack engineer",
                "武士道",
                "Obsession beats talent",
                "開発中",
                "Currently shipping",
                "不撓不屈",
                "Open to collaborations",
                "全力",
              ].map((s, i) => (
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
