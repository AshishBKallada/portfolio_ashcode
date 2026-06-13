"use client";

import Image from "next/image";
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
    document.documentElement.style.overflow = "hidden";
    return () => { ctx.revert(); document.documentElement.style.overflow = ""; };
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
              <span className="font-headline italic text-lg md:text-xl leading-snug text-black">{row.items}</span>
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
    <div className="relative inline-flex items-center justify-center p-6 md:p-10">
      <button
        onClick={onClick}
        aria-label="Open skills"
        className="group relative w-60 h-60 md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] shrink-0 rounded-full bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-transform duration-500"
      >
        {/* Doodles scattered inside the button */}
        <span aria-hidden className="pointer-events-none absolute inset-0">
          <Doodle className="absolute left-[15%] top-[18%] text-black/55 w-3 md:w-4" kind="spark" />
          <Doodle className="absolute right-[14%] top-[14%] text-black/45 w-4 md:w-5" kind="star" />
          <Doodle className="absolute left-[22%] bottom-[36%] text-black/55 w-3 md:w-4" kind="plus" />
          <Doodle className="absolute right-[18%] bottom-[40%] text-black/45 w-3 md:w-4" kind="arrow" />
          <Doodle className="absolute left-[10%] top-[48%] text-black/40 w-2.5 md:w-3" kind="dot" />
          <Doodle className="absolute right-[10%] top-[52%] text-black/40 w-2.5 md:w-3" kind="dot" />
        </span>

        <span className="absolute inset-0 flex flex-col items-center justify-center z-[1]">
          <span className="font-headline italic text-5xl md:text-7xl lg:text-8xl leading-none text-black">
            Skills
          </span>
          <span className="mt-2 md:mt-3 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-black/60">
            {SKILLS.length} categories
          </span>
          <span className="mt-5 md:mt-7 text-xl md:text-2xl text-black group-hover:translate-x-1 transition-transform">↗</span>
        </span>
      </button>
    </div>
  );
}

function Doodle({
  kind,
  className = "",
}: {
  kind: "star" | "spark" | "plus" | "arrow" | "dot";
  className?: string;
}) {
  switch (kind) {
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="currentColor" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M5 19 L19 5 M11 5 H19 V13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "dot":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="6" fill="currentColor" />
        </svg>
      );
  }
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

        // Idle slow rotation as ambient motion
        gsap.to(circleARef.current, { rotation: "+=360", duration: 90, ease: "none", repeat: -1 });

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
        section.addEventListener("mousemove", onMove);
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
      className="relative z-10 flex w-full shrink-0 flex-col bg-white px-1 sm:px-1.5 md:px-2 overflow-hidden"
      aria-label="Statement"
    >
      <div className="relative isolate w-full px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.05) calc(8.333333% - 1px), rgba(0,0,0,0.05) 8.333333%)",
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
                <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                  <div className="absolute inset-0 scale-105">
                    <Image
                      src="/hero-background.jpg"
                      alt=""
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      className="object-cover object-center blur-md brightness-[0.62] saturate-[1.15]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/55" aria-hidden />
                </div>
              </div>
            </div>

            <div className="relative md:col-span-3 min-h-[460px] md:min-h-[600px]">
              <div className="absolute top-1/2 -translate-y-1/2 -right-32 md:-right-48 lg:-right-64">
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
