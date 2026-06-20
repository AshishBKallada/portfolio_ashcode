"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ACCENT = "#ff1a1a";

function useKeralaTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

const ContactRow = forwardRef<
  HTMLAnchorElement,
  { idx: string; label: string; jp: string; href: string; value: string }
>(({ idx, label, jp, href, value }, ref) => (
  <a
    ref={ref}
    href={href}
    className="group relative flex items-center gap-4 md:gap-6 py-3.5 border-b border-[#E1E0CC]/10 will-change-transform"
  >
    <span className="font-body text-[10px] tracking-[0.3em] text-[#E1E0CC]/45 tabular-nums w-7 shrink-0">
      {idx}
    </span>

    <span className="font-body text-[10px] uppercase tracking-[0.28em] text-[#E1E0CC]/55 w-32 shrink-0 hidden sm:block">
      {label}
      <span className="ml-1.5 opacity-60 tracking-[0.15em]">· {jp}</span>
    </span>

    <span className="flex-1 min-w-0 font-headline text-base md:text-xl tracking-tight truncate transition-colors duration-300 group-hover:text-[#ff1a1a]">
      {value}
    </span>

    <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-[#E1E0CC]/30 transition-all duration-300 group-hover:border-[#ff1a1a] group-hover:rotate-[40deg]">
      <ArrowUpRight className="w-3.5 h-3.5 transition-colors group-hover:text-[#ff1a1a]" />
    </span>
  </a>
));
ContactRow.displayName = "ContactRow";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const workRef = useMagnetic<HTMLAnchorElement>(0.18);
  const sayHiRef = useMagnetic<HTMLAnchorElement>(0.18);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);
  const keralaTime = useKeralaTime();

  const scrollTop = () => {
    if (typeof window === "undefined") return;
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (target: number) => void };
    }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      gsap.from(root.querySelectorAll(".cnt-label"), {
        y: 12, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06,
        scrollTrigger: { trigger: root, start: "top 85%" },
      });

      gsap.from(root.querySelectorAll(".cnt-word"), {
        y: 40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07,
        scrollTrigger: { trigger: root, start: "top 80%" },
      });

      gsap.from(root.querySelectorAll(".cnt-row"), {
        y: 18, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.from(root.querySelectorAll(".cnt-foot"), {
        y: 10, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.05,
        scrollTrigger: { trigger: root, start: "top 70%" },
      });

      gsap.from(root.querySelectorAll(".cnt-mark"), {
        y: 80, opacity: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: root, start: "top 65%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full min-h-screen flex flex-col bg-black text-[#E1E0CC] overflow-hidden"
    >
      {/* Top hairline — single red brush stroke */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
          opacity: 0.55,
        }}
      />

      {/* ─── Top meta row — time only ─── */}
      <div className="relative z-10 px-6 md:px-12 pt-8 md:pt-10 flex items-center justify-end">
        <p
          className="cnt-label font-body text-[10px] uppercase tracking-[0.32em] text-[#E1E0CC]/55 tabular-nums"
          aria-label={`Local time ${keralaTime} IST`}
        >
          {keralaTime || "—"} IST · Kerala
        </p>
      </div>

      {/* ─── Center — headline + indexed emails ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto w-full py-16">
        <h2 className="font-headline tracking-[-0.025em] leading-[0.95] text-[clamp(2.25rem,6.5vw,5rem)]">
          <span className="cnt-word inline-block mr-[0.18em]">Let&apos;s</span>
          <span className="cnt-word inline-block mr-[0.18em]">make</span>
          <span className="cnt-word inline-block italic text-[#E1E0CC]/70">something</span>
          <br />
          <span className="cnt-word inline-block mr-[0.18em]">worth</span>
          <span className="cnt-word inline-block">shipping.</span>
        </h2>

        <p className="cnt-label mt-4 font-body text-xs md:text-sm tracking-[0.05em] text-[#E1E0CC]/55 max-w-md">
          一緒に作ろう — open for collaborations from Q3 2026.
        </p>

        <div className="mt-8 md:mt-10 border-t border-[#E1E0CC]/10">
          <div className="cnt-row">
            <ContactRow
              ref={workRef}
              idx="01"
              label="work"
              jp="仕事"
              href="mailto:ashercode4u@gmail.com"
              value="ashercode4u@gmail.com"
            />
          </div>
          <div className="cnt-row">
            <ContactRow
              ref={sayHiRef}
              idx="02"
              label="say hi"
              jp="挨拶"
              href="mailto:ashishbkallada@gmail.com"
              value="ashishbkallada@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* ─── Bottom bar — © + socials only ─── */}
      <div className="relative z-10 px-6 md:px-12 pb-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-[#E1E0CC]/55">
          <p className="cnt-foot">© 2026 Ashcode</p>

          <div className="cnt-foot flex items-center gap-5">
            <a
              href="https://github.com/AshishBKallada"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 hover:text-[#E1E0CC] transition-colors"
            >
              <Github className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="relative">
                Github
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-0.5 h-px scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: ACCENT }}
                />
              </span>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 hover:text-[#E1E0CC] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="relative">
                LinkedIn
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-0.5 h-px scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: ACCENT }}
                />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── Big katakana brand mark — full-bleed at bottom ─── */}
      <div className="relative z-[1] overflow-hidden leading-none">
        <p
          aria-hidden
          className="cnt-mark font-body font-light text-center select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(3.5rem, 19vw, 16rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
            color: ACCENT,
            textShadow:
              "0 0 18px rgba(255,26,26,0.55), 0 0 60px rgba(255,26,26,0.35), 0 0 120px rgba(255,26,26,0.25)",
          }}
        >
          アッシュコード
        </p>
      </div>

      {/* Back to top */}
      <button
        ref={backTopRef}
        type="button"
        onClick={scrollTop}
        aria-label="Back to top"
        className="group absolute top-6 right-6 md:top-10 md:right-12 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#E1E0CC]/25 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-[#E1E0CC] hover:text-black hover:border-[#E1E0CC] transition-colors duration-300 will-change-transform"
      >
        <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </section>
  );
}
