"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";

const ACCENT = "#ff1a1a";

const SKILLS: { category: string; jp: string; items: string }[] = [
  { category: "Frontend",   jp: "前面",     items: "React · Next.js · React Native · Tamagui · Tailwind · ShadCN · ANTD · Bootstrap · MUI · Redux · GSAP" },
  { category: "Languages",  jp: "言語",     items: "JavaScript · TypeScript · HTML · CSS · Java · PHP" },
  { category: "Backend",    jp: "背面",     items: "Node.js · Express.js · REST API · MVC · Clean Architecture · JWT · Kafka · EJS" },
  { category: "Database",   jp: "データ",   items: "MongoDB · PostgreSQL · MySQL" },
  { category: "Services",   jp: "サービス", items: "Firebase · Socket.IO · Cloudinary · Razorpay · Zegocloud · Passport.js · Nodemailer · Chart.js" },
  { category: "Deployment", jp: "配備",     items: "Vercel · Render · NGINX · Hostinger · Android" },
  { category: "DevOps",     jp: "運用",     items: "Docker · Kubernetes · AWS · Git · GitHub" },
  { category: "Testing",    jp: "試験",     items: "Mocha · ESLint · Postman" },
  { category: "Concepts",   jp: "概念",     items: "DSA · OOPS · Microservices · JSON" },
  { category: "Tools",      jp: "道具",     items: "Figma · Notion · Moon Modeler" },
];

type LenisLike = { stop: () => void; start: () => void };

export default function SkillsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.75, ease: "expo.out" }
      );
      if (rowsRef.current) {
        gsap.from(rowsRef.current.children, {
          y: 36, opacity: 0, stagger: 0.05, duration: 0.55, ease: "power3.out", delay: 0.22,
        });
      }
    });

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[120] flex justify-end bg-paper/30 backdrop-blur-lg"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Skills"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-[880px] h-full flex flex-col bg-surface text-ink shadow-[0_0_120px_rgba(0,0,0,0.55)] overflow-hidden will-change-transform"
      >
        {/* Top hairline — single red brush stroke */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
            opacity: 0.6,
          }}
        />

        {/* Vertical kanji rail — left edge */}
        <div
          aria-hidden
          className="hidden md:flex absolute top-1/2 left-3 -translate-y-1/2 flex-col items-center gap-4 font-headline text-ink/15 text-xl pointer-events-none leading-none"
        >
          <span>全</span>
          <span className="w-px h-3 bg-ink/15" />
          <span>技</span>
          <span className="w-px h-3 bg-ink/15" />
          <span>能</span>
        </div>

        {/* Header */}
        <header className="flex items-start justify-between gap-6 px-6 md:px-12 pt-10 md:pt-14 pb-6 md:pb-8">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.32em] text-ink/50">
              技能 · The whole kit
            </p>
            <h3 className="font-headline italic tracking-[-0.025em] leading-[0.92] text-[clamp(2.5rem,7vw,5.5rem)] mt-3">
              Every <span className="text-ink/60">tool</span>
              <br />
              in the rack.
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close skills"
            className="shrink-0 mt-1 rounded-full border border-ink/20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Categories */}
        <ul
          ref={rowsRef}
          className="flex-1 overflow-y-auto px-6 md:px-12 pb-8 border-t border-ink/10"
        >
          {SKILLS.map((row, i) => (
            <li
              key={row.category}
              className="group flex flex-col md:flex-row md:items-baseline gap-y-2 md:gap-x-10 py-5 border-b border-ink/10 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="flex items-baseline gap-4 shrink-0 md:w-60">
                <span className="font-body text-[10px] tracking-[0.3em] text-ink/40 tabular-nums w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-headline italic text-2xl md:text-3xl tracking-[-0.01em] leading-none">
                  {row.category}
                </span>
                <span className="font-body text-[10px] tracking-[0.2em] text-ink/35 hidden md:inline">
                  {row.jp}
                </span>
              </div>
              <p className="font-body text-sm md:text-base leading-relaxed text-ink/75 group-hover:text-ink transition-colors">
                {row.items}
              </p>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-4 border-t border-ink/10 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-ink/40">
          <p>Esc to close</p>
          <p>
            {SKILLS.length} categories · 全部で
          </p>
        </footer>
      </div>
    </div>
  );
}
