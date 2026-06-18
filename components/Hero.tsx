"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";
import { scrambleText } from "@/lib/scramble";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

const LIGHT_GRID = {
  backgroundImage:
    "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1.5px), rgba(0,0,0,0.05) calc(8.333333% - 0.75px), transparent 8.333333%)",
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const rockInnerRef = useRef<HTMLDivElement>(null);
  const charParallaxRef = useRef<HTMLDivElement>(null);
  const rockParallaxRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.22);

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
      if (!startedAtTop) return;

      // Lock entrance state — held until loader finishes
      const tags = root.querySelectorAll(".hero-tag");
      const words = root.querySelectorAll(".hw");
      const ctas = root.querySelectorAll(".hero-cta");
      const resume = root.querySelectorAll(".hero-resume");
      const marquee = root.querySelectorAll(".hero-marquee");

      if (imageInnerRef.current)
        gsap.set(imageInnerRef.current, { yPercent: 100, opacity: 1 });
      if (rockInnerRef.current)
        gsap.set(rockInnerRef.current, { yPercent: 100, opacity: 1 });
      gsap.set(tags, { y: 18, opacity: 0 });
      gsap.set(words, { y: 90, opacity: 0 });
      gsap.set(ctas, { y: 22, opacity: 0 });
      gsap.set(resume, { x: 60, opacity: 0 });
      gsap.set(marquee, { yPercent: 100, opacity: 0 });

      const runEntrance = () => {
        const tl = gsap.timeline();

        // 1) Hero text cascades in first
        tl.to(tags, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" })
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
          )
          .to(
            resume,
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.5"
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

      const onLoaderDone = () => runEntrance();
      window.addEventListener("loader:done", onLoaderDone, { once: true });
      // Safety: if loader event is missed, still reveal after 4s
      const safety = window.setTimeout(() => {
        window.removeEventListener("loader:done", onLoaderDone);
        runEntrance();
      }, 4000);

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

      const resume = root.querySelector(".hero-resume");
      if (resume) {
        gsap.to(resume, {
          y: 60,
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
      className="sticky top-0 z-0 w-full min-h-screen overflow-hidden bg-white text-black"
    >
      {/* Foreground hero figure — always visible */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute inset-0 z-[3] will-change-transform"
      >
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
              alt="Ashish B Kallada — hero"
              fill
              priority
              sizes="100vw"
              quality={100}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* SplashCursor — only when Hero is in view. */}
      {inView && (
        <SplashCursor
          RAINBOW_MODE={false}
          COLOR="#ff1a1a"
          SIM_RESOLUTION={48}
          DYE_RESOLUTION={256}
          PRESSURE_ITERATIONS={3}
          SHADING={false}
        />
      )}

      {/* 12-column gridlines */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={LIGHT_GRID} aria-hidden />

      {/* Headline block — bottom-left. Colors inherit from section via currentColor */}
      <div className="hero-headline absolute left-0 right-0 bottom-24 md:bottom-28 z-[3] px-6 md:px-12 max-w-2xl md:max-w-3xl pointer-events-none will-change-transform">
        <p className="hero-tag font-body text-xs uppercase tracking-[0.3em] mb-4 opacity-70">
          Full-stack engineer / Kerala, India
        </p>
        <h1 className="font-headline text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.85] tracking-[-0.02em]">
          <span className="hw inline-block mr-[0.18em] cursor-pointer">Obsession</span>
          <span className="hw inline-block mr-[0.18em] italic cursor-pointer">beats</span>
          <br />
          <span className="hw inline-block cursor-pointer">talent.</span>
        </h1>
        <div className="hero-cta mt-8 flex flex-wrap gap-4 items-center">
          <a
            ref={ctaRef}
            href="mailto:ashercode4u@gmail.com"
            data-cursor="cta"
            className="group pointer-events-auto relative inline-flex items-center gap-2 px-6 py-3 border border-black overflow-hidden font-headline text-lg will-change-transform"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
            />
            <span className="relative z-[1] transition-colors duration-300 group-hover:text-white">Get in Touch</span>
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
              className="relative z-[1] group-hover:rotate-45 transition-transform group-hover:text-white"
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

      {/* Resume thumbnail — fixed bottom-right with jointed connector line */}
      <a
        href="/ashishbkalladaresume.pdf"
        download="ashishbkalladaresume.pdf"
        aria-label="Download resume"
        onClick={(e) => {
          const ok = window.confirm("Download ashishbkalladaresume.pdf?");
          if (!ok) e.preventDefault();
        }}
        data-cursor="view"
        className="hero-resume group hidden md:flex fixed bottom-24 right-10 lg:bottom-28 lg:right-14 z-[90] pointer-events-auto items-start gap-2"
      >
        {/* Label */}
        <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
          <span className="font-body text-[10px] uppercase tracking-[0.22em] text-black">
            ashishbkalladaresume.pdf
          </span>
          <Download className="w-3.5 h-3.5 text-black" />
        </div>

        {/* Connector — horizontal from label right, then diagonal down-right to thumbnail top-left */}
        <svg
          aria-hidden
          className="shrink-0 pointer-events-none text-black"
          width="32"
          height="44"
          viewBox="0 0 32 44"
          fill="none"
        >
          <path d="M 0 8 L 14 8 L 32 42" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="8" r="1.6" fill="currentColor" />
          <circle cx="32" cy="42" r="1.6" fill="currentColor" />
        </svg>

        {/* Thumbnail */}
        <div className="relative w-24 lg:w-28 aspect-[3/4] mt-10 shrink-0 overflow-hidden shadow-[0_18px_40px_-15px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04]">
          <Image
            src="/resume-thumb.png"
            alt="Resume preview"
            fill
            sizes="120px"
            className="object-cover object-top grayscale transition duration-300 group-hover:grayscale-0"
          />
        </div>
      </a>

      {/* Hex tag — sits above the marquee */}
      <div className="absolute bottom-16 left-6 md:bottom-20 md:left-12 z-[4] font-body text-[11px] tracking-[0.2em] opacity-70">
        0x2f·7a · 4b · ff · 01 · 3c · ae →
      </div>

      {/* "Scroll to explore" — sits above the marquee */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2 pointer-events-none text-white opacity-90">
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
        className="hero-marquee absolute bottom-0 left-0 right-0 z-[4] overflow-hidden py-2.5 text-white bg-[#ff1a1a] will-change-transform shadow-[0_-12px_40px_-8px_rgba(255,26,26,0.65),0_0_24px_rgba(255,26,26,0.5)]"
        aria-hidden
      >
        <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
          {Array.from({ length: 2 }).map((_, copy) => (
            <div key={copy} className="flex shrink-0 items-center font-body text-[10px] uppercase tracking-[0.32em]">
              {[
                "Available · Q3 2026",
                "Kerala · IST",
                "Full-stack engineer",
                "Obsession beats talent",
                "Currently shipping",
                "Open to collaborations",
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
