"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";
import { colors } from "@/lib/theme/colors";
import { HERO_COPY, HERO_IMAGE, HERO_MARQUEE } from "@/lib/constants/hero";
import { SITE } from "@/lib/constants/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const headlineMouseRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const [splashCfg, setSplashCfg] = useState<{ enabled: boolean; dye: number } | null>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);
  const entranceRanRef = useRef(false);

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

  // Entrance + staggered text reveal (hero image leads the timeline)
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
      const tags = root.querySelectorAll(".hero-tag");
      const words = root.querySelectorAll(".hw");
      const ctas = root.querySelectorAll(".hero-cta");
      const marquee = root.querySelectorAll(".hero-marquee");

      if (heroImage) gsap.set(heroImage, { opacity: 0, scale: 1.08 });
      gsap.set(tags, { y: 18, opacity: 0 });
      gsap.set(words, { y: 90, opacity: 0 });
      gsap.set(ctas, { y: 22, opacity: 0 });
      gsap.set(marquee, { yPercent: 100, opacity: 0 });

      const runEntrance = () => {
        if (entranceRanRef.current) return;
        entranceRanRef.current = true;

        const tl = gsap.timeline();

        if (heroImage) {
          tl.to(
            heroImage,
            { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
            0
          );
        }

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

        tl.add(() => {
          window.dispatchEvent(new Event("hero:textDone"));
        }, 1.4);

        tl.to(
          marquee,
          { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          1.6
        );

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

    const layers: { ref: React.RefObject<HTMLDivElement>; mx: number; my: number }[] = [
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

  // Parallax + fade on scroll
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

      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          y: -50,
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
        start: "bottom top",
        end: "+=100%",
        scrub: 0.45,
      } as const;

      if (visualsRef.current) {
        gsap.to(visualsRef.current, {
          opacity: 0.18,
          filter: "blur(18px)",
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
      className="sticky top-0 z-0 w-full h-screen min-h-screen overflow-hidden bg-paper text-ink"
    >
      <div ref={visualsRef} className="absolute inset-0 will-change-[opacity,filter]">
        <div
          ref={heroImageRef}
          className="hero-image-inner absolute inset-0 z-[1] will-change-transform"
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

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
            className="group pointer-events-auto relative inline-flex items-center gap-2 px-6 py-3 border border-ink overflow-hidden font-headline text-lg text-ink will-change-transform"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1] transition-colors duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-paper">
              {HERO_COPY.ctaLabel}
            </span>
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
            {HERO_COPY.availability}
          </span>
        </div>
      </div>

      <div className="hero-scroll-ui hidden sm:block absolute bottom-16 left-6 md:bottom-20 md:left-12 z-[4] font-body text-[11px] tracking-[0.2em] opacity-70">
        {HERO_COPY.hexTag}
      </div>

      <div className="hero-scroll-ui absolute bottom-16 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 pointer-events-none opacity-90">
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

      <div
        className="hero-marquee absolute bottom-0 left-0 right-0 z-[4] overflow-hidden py-2.5 bg-paper/75 text-ink opacity-0 will-change-transform shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.2)] backdrop-blur-sm"
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
