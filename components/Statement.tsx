"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SKILLS: { category: string; items: string }[] = [
  { category: "Frontend",   items: "React · Next.js · React Native · Tamagui · Tailwind · ShadCN · ANTD · Bootstrap · MUI · Redux · GSAP" },
  { category: "Languages",  items: "JavaScript · TypeScript · HTML · CSS · Java · PHP" },
  { category: "Backend",    items: "Node.js · Express.js · REST API · MVC · Clean Architecture · JWT · Kafka · EJS" },
  { category: "Database",   items: "MongoDB · PostgreSQL · MySQL" },
  { category: "Services",   items: "Firebase · Socket.IO · Cloudinary · Razorpay · Zegocloud · Passport.js · Nodemailer · Chart.js" },
  { category: "Deployment", items: "Vercel · Render · NGINX · Hostinger · Android" },
  { category: "DevOps",     items: "Docker · Kubernetes · AWS · Git · GitHub" },
  { category: "Testing",    items: "Mocha · ESLint · Postman" },
  { category: "Concepts",   items: "DSA · OOPS · Microservices · JSON" },
  { category: "Tools",      items: "Figma · Notion · Moon Modeler" },
];

function SkillsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "expo.out" }
      );
      if (rowsRef.current) {
        gsap.from(rowsRef.current.children, {
          y: 24, opacity: 0, stagger: 0.04, duration: 0.45, ease: "power3.out", delay: 0.15,
        });
      }
    });
    const scrollY = window.scrollY;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/45 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-[1.5rem] md:rounded-[2rem] bg-white text-black shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm px-6 md:px-10 py-5 border-b border-black/10">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.35em] text-black/50">The whole stack</p>
            <h3 className="font-headline italic text-3xl md:text-5xl leading-[1] mt-1">Skills.</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close skills"
            className="rounded-full border border-black/15 p-2 hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div ref={rowsRef} className="px-6 md:px-10 py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {SKILLS.map((row) => (
            <div key={row.category} className="flex flex-col gap-1 border-b border-black/10 pb-4">
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-black/45">{row.category}</span>
              <span className="font-body text-sm md:text-base leading-relaxed text-black/85">{row.items}</span>
            </div>
          ))}
        </div>

        <footer className="px-6 md:px-10 py-5 border-t border-black/10 flex items-center justify-between">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/50">Esc to close</p>
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/50">Built between 03:00 and 05:00</p>
        </footer>
      </div>
    </div>
  );
}

function SkillsBadge({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open skills"
      className="group relative block w-[260px] md:w-[320px] lg:w-[360px] h-[380px] md:h-[460px] lg:h-[520px] rounded-[1.25rem] md:rounded-[1.5rem] bg-white text-black shadow-[0_30px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden transition-transform duration-[700ms] ease-[cubic-bezier(0.65,0,0.35,1)] rotate-[-10deg] translate-x-[25%] hover:rotate-0 hover:-translate-x-[8%] hover:scale-[1.05] will-change-transform"
    >
      {/* clip detail at top */}
      <span
        aria-hidden
        className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-black/15"
      />

      <div className="absolute inset-0 px-7 md:px-9 pt-10 md:pt-12 pb-7 md:pb-9 flex flex-col items-center text-center">
        <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-black/60">
          June 2026
        </p>
        <h3 className="mt-4 md:mt-6 font-headline italic text-[2rem] md:text-4xl lg:text-5xl leading-[1.02] text-black">
          Maker Of
          <br />
          The Stack
        </h3>
        <p className="mt-3 md:mt-4 font-body text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-black/55">
          Ashish B Kallada
        </p>

        {/* Visual — realistic green Mjolnir, upside-down at 45° */}
        <div className="relative mt-auto w-full flex items-center justify-center pb-2 pt-2">
          <svg
            viewBox="0 0 120 210"
            className="w-[150px] md:w-[190px] lg:w-[210px] rotate-[135deg] transition-transform duration-500 ease-out group-hover:rotate-[125deg]"
            aria-hidden
          >
            <defs>
              <linearGradient id="hammer-head" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6fee8a" />
                <stop offset="50%" stopColor="#3fd75e" />
                <stop offset="100%" stopColor="#1f9a3d" />
              </linearGradient>
              <linearGradient id="hammer-handle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5fe87a" />
                <stop offset="50%" stopColor="#3fd75e" />
                <stop offset="100%" stopColor="#268a44" />
              </linearGradient>
              <linearGradient id="hammer-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3fd75e" />
                <stop offset="100%" stopColor="#1a7d36" />
              </linearGradient>
            </defs>

            {/* Head — classic Mjolnir with slight concave sides */}
            <path
              d="M 18 18
                 Q 14 22 14 30
                 L 14 60
                 Q 14 68 18 72
                 L 102 72
                 Q 106 68 106 60
                 L 106 30
                 Q 106 22 102 18
                 Z"
              fill="url(#hammer-head)"
              stroke="#1a7d36"
              strokeWidth="0.8"
            />
            {/* Top-edge highlight */}
            <path
              d="M 20 22 Q 18 24 18 30 L 18 38"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.55"
              fill="none"
              strokeLinecap="round"
            />
            <line x1="22" y1="22" x2="100" y2="22" stroke="#ffffff" strokeWidth="1" opacity="0.35" />
            {/* Side panel divisions (gives the head depth) */}
            <line x1="32" y1="20" x2="32" y2="70" stroke="#1a7d36" strokeWidth="0.6" opacity="0.55" />
            <line x1="88" y1="20" x2="88" y2="70" stroke="#1a7d36" strokeWidth="0.6" opacity="0.55" />
            <line x1="20" y1="45" x2="100" y2="45" stroke="#1a7d36" strokeWidth="0.6" opacity="0.4" />
            {/* Bottom-edge shadow */}
            <line x1="22" y1="68" x2="100" y2="68" stroke="#0d4a1f" strokeWidth="1" opacity="0.35" />
            {/* Rune detail (center of face) */}
            <circle cx="60" cy="45" r="6" fill="none" stroke="#0d4a1f" strokeWidth="0.8" opacity="0.35" />
            <circle cx="60" cy="45" r="2.5" fill="#0d4a1f" opacity="0.4" />

            {/* Cuff/collar between head and handle */}
            <rect x="44" y="72" width="32" height="9" fill="url(#hammer-metal)" />
            <line x1="44" y1="76" x2="76" y2="76" stroke="#ffffff" strokeWidth="0.7" opacity="0.45" />
            <line x1="44" y1="80" x2="76" y2="80" stroke="#0d4a1f" strokeWidth="0.7" opacity="0.5" />

            {/* Handle */}
            <rect x="52" y="81" width="16" height="98" fill="url(#hammer-handle)" />
            {/* Handle highlight (left edge) */}
            <rect x="52" y="81" width="2.5" height="98" fill="#ffffff" opacity="0.3" />
            {/* Handle shadow (right edge) */}
            <rect x="65.5" y="81" width="2.5" height="98" fill="#0d4a1f" opacity="0.35" />
            {/* Leather grip wraps */}
            {[94, 108, 122, 136, 150, 164].map((y) => (
              <g key={y}>
                <rect x="52" y={y} width="16" height="3" fill="#0d4a1f" opacity="0.35" />
                <line x1="52" y1={y} x2="68" y2={y} stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
              </g>
            ))}

            {/* Pommel */}
            <path
              d="M 42 179
                 L 78 179
                 Q 80 179 80 181
                 L 80 192
                 Q 80 194 78 194
                 L 42 194
                 Q 40 194 40 192
                 L 40 181
                 Q 40 179 42 179 Z"
              fill="url(#hammer-metal)"
              stroke="#0d4a1f"
              strokeWidth="0.6"
            />
            <line x1="42" y1="183" x2="78" y2="183" stroke="#ffffff" strokeWidth="0.7" opacity="0.4" />
            <line x1="42" y1="190" x2="78" y2="190" stroke="#0d4a1f" strokeWidth="0.7" opacity="0.5" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bpRef = useRef<SVGSVGElement>(null);
  const circleARef = useRef<SVGGElement>(null);
  const circleBRef = useRef<SVGGElement>(null);
  const rectRef = useRef<SVGGElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const headline = headlineRef.current;
    if (!stage || !card) return;

    const ctx = gsap.context(() => {
      // Scaling card scrub
      gsap.set(card, { scale: 0.42, transformOrigin: "0% 0%" });
      gsap.to(card, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top 92%", end: "top 18%", scrub: 0.6 },
      });

      // Headline word-by-word reveal
      if (headline) {
        const spans = headline.querySelectorAll(".word");
        gsap.from(spans, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: headline, start: "top 78%" },
        });
      }

      // Blueprint shapes — mouse parallax + rotation (Yogi-style)
      const section = sectionRef.current;
      const bp = bpRef.current;
      if (section && bp && circleARef.current && circleBRef.current && rectRef.current) {
        gsap.set(circleARef.current, { svgOrigin: "640 160" });
        gsap.set(circleBRef.current, { svgOrigin: "640 160" });
        gsap.set(rectRef.current, { svgOrigin: "500 480" });

        const rotA = gsap.quickTo(circleARef.current, "rotation", { duration: 1.2, ease: "power3.out" });
        const rotB = gsap.quickTo(circleBRef.current, "rotation", { duration: 1.6, ease: "power3.out" });
        const rectRot = gsap.quickTo(rectRef.current, "rotation", { duration: 1.8, ease: "power3.out" });
        const bpX = gsap.quickTo(bp, "x", { duration: 1.0, ease: "power3.out" });
        const bpY = gsap.quickTo(bp, "y", { duration: 1.0, ease: "power3.out" });

        // Idle slow rotation — paused when section is out of view
        const idleTween = gsap.to(circleARef.current, {
          rotation: "+=360",
          duration: 90,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => idleTween.play(),
          onEnterBack: () => idleTween.play(),
          onLeave: () => idleTween.pause(),
          onLeaveBack: () => idleTween.pause(),
        });

        const onMove = (e: MouseEvent) => {
          const r = section.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width - 0.5;
          const my = (e.clientY - r.top) / r.height - 0.5;
          rotA(mx * 25);
          rotB(-mx * 35);
          rectRot(mx * 10);
          bpX(mx * 30);
          bpY(my * 30);
        };
        section.addEventListener("mousemove", onMove, { passive: true });
      }

      // Skills badge — fully off-screen right, scrubbed in based on scroll
      const skills = skillsRef.current;
      if (skills) {
        gsap.set(skills, { xPercent: 180, rotation: 60, opacity: 0, transformOrigin: "50% 50%" });
        gsap.to(skills, {
          xPercent: 0,
          rotation: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: skills,
            start: "top bottom",
            end: "top 35%",
            scrub: 0.6,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const headlineWords = ["End-to-end", "web.", "Shipped", "with", "MERN."];

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="relative z-10 flex w-full shrink-0 flex-col bg-white text-black px-1 sm:px-1.5 md:px-2 overflow-hidden shadow-[0_-12px_40px_-10px_rgba(0,0,0,0.18)]"
      aria-label="Statement"
    >
      <div className="relative isolate w-full px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1.5px), rgba(0,0,0,0.022) calc(8.333333% - 0.75px), transparent 8.333333%)",
          }}
          aria-hidden
        />

        {/* Blueprint shapes — big, top-right, cursor-driven parallax + rotation */}
        <svg
          ref={bpRef}
          className="pointer-events-none absolute -top-20 -right-20 md:-top-32 md:-right-32 w-[80vw] h-[70vh] max-w-[1100px] max-h-[1100px] z-[1]"
          viewBox="0 0 800 800"
          aria-hidden
          style={{ willChange: "transform" }}
        >
          <defs>
            <linearGradient id="bp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#3fd75e" />
            </linearGradient>
          </defs>
          <g ref={circleARef} opacity="0.55">
            <circle cx="640" cy="160" r="290" fill="none" stroke="url(#bp-grad)" strokeWidth="1.4" strokeDasharray="6 6" />
          </g>
          <g ref={circleBRef} opacity="0.4">
            <circle cx="640" cy="160" r="265" fill="none" stroke="url(#bp-grad)" strokeWidth="0.8" />
          </g>
          <g ref={rectRef} opacity="0.55">
            <rect x="350" y="380" width="300" height="200" fill="none" stroke="url(#bp-grad)" strokeWidth="1.1" />
          </g>
          <line x1="60" y1="0" x2="60" y2="800" stroke="url(#bp-grad)" strokeWidth="0.7" strokeDasharray="12 12" opacity="0.45" />
          <line x1="740" y1="0" x2="740" y2="800" stroke="url(#bp-grad)" strokeWidth="0.7" strokeDasharray="12 12" opacity="0.3" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[88rem]">
          <div className="flex items-baseline justify-between mb-12 md:mb-16">
            <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/50">
              002 — End-to-end
            </p>
            <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/50 hidden md:block">
              The Stack
            </p>
          </div>

          <h2
            ref={headlineRef}
            className="font-headline italic leading-[0.92] tracking-[-0.02em] text-black text-[clamp(2.5rem,9vw,8rem)]"
          >
            {headlineWords.slice(0, 2).map((w, i) => (
              <span key={`a-${i}`} className="word inline-block mr-[0.18em]">{w}</span>
            ))}
            <br />
            {headlineWords.slice(2).map((w, i) => (
              <span key={`b-${i}`} className="word inline-block mr-[0.18em]">{w}</span>
            ))}
          </h2>

          <div className="mt-10 md:mt-14 max-w-3xl flex items-start gap-4 md:gap-6">
            <span
              className="hidden md:block h-px w-12 lg:w-20 bg-black/40 mt-[0.95rem] shrink-0"
              aria-hidden
            />
            <div className="flex-1">
              <p className="font-body text-base md:text-lg leading-relaxed text-black/75">
                I&apos;m <span className="font-headline italic text-black">Ashish B Kallada</span>,
                a full-stack developer from God&apos;s own country 🌴. I build for the internet from
                the database up — React, Node, Mongo, Postgres, the parts that don&apos;t have a
                name yet.
              </p>
              <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-black/40">
                — bio, 2026
              </p>
            </div>
          </div>

          {/* Row: scaling card LEFT, skills badge RIGHT */}
          <div
            ref={stageRef}
            className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch"
          >
            <div className="md:col-span-9 relative min-h-[460px] md:min-h-[600px]">
              <div
                ref={cardRef}
                className="absolute inset-0 will-change-transform"
                style={{ transformOrigin: "0% 0%" }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] bg-white shadow-[0_30px_80px_-15px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/30">
                    video comes here
                  </p>
                </div>
              </div>
            </div>

            <div className="relative md:col-span-3 min-h-[460px] md:min-h-[600px]">
              <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-2 lg:right-6">
                <div ref={skillsRef} className="will-change-transform">
                  <SkillsBadge onClick={() => setModalOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SkillsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
