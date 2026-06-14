"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ACCENT = "#3fd75e";

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

const MagneticEmailButton = forwardRef<
  HTMLAnchorElement,
  { href: string; label: string; value: string }
>(({ href, label, value }, ref) => (
  <a
    ref={ref}
    href={href}
    className="group relative flex items-center gap-3 px-8 py-4 border border-black dark:border-white overflow-hidden transition-colors duration-300 font-headline text-xl will-change-transform"
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      style={{ backgroundColor: ACCENT }}
    />
    <Mail className="relative z-[1] w-5 h-5 transition-colors group-hover:text-black" />
    <div className="relative z-[1] flex flex-col items-start leading-tight">
      <span className="font-body text-[10px] uppercase tracking-[0.25em] opacity-60 transition-colors group-hover:text-black">
        {label}
      </span>
      <span className="transition-colors group-hover:text-black">{value}</span>
    </div>
    <ArrowUpRight className="relative z-[1] w-4 h-4 transition-transform group-hover:rotate-45 group-hover:text-black" />
  </a>
));
MagneticEmailButton.displayName = "MagneticEmailButton";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const workRef = useMagnetic<HTMLAnchorElement>(0.22);
  const sayHiRef = useMagnetic<HTMLAnchorElement>(0.22);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);
  const keralaTime = useKeralaTime();

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = sectionRef.current;
      if (!root) return;

      gsap.from(root.querySelectorAll(".cnt-label"), {
        y: 14, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 80%" },
      });

      gsap.from(root.querySelectorAll(".cnt-word"), {
        y: 50, opacity: 0, duration: 0.95, ease: "expo.out", stagger: 0.07,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.from(root.querySelectorAll(".cnt-cta"), {
        y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.25,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.from(root.querySelectorAll(".cnt-foot"), {
        y: 12, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06,
        scrollTrigger: { trigger: root, start: "top 60%" },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full flex flex-col bg-white text-black dark:bg-black dark:text-white border-t border-black/10 dark:border-white/10 overflow-hidden"
    >

      {/* Top row — status + live time */}
      <div className="relative z-10 flex items-start justify-between px-6 md:px-12 pt-20 md:pt-24">
        <div className="cnt-label flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: ACCENT, opacity: 0.65 }}
            />
            <span
              className="relative inline-flex w-2 h-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
          </span>
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/70 dark:text-white/70">
            Available for work
          </p>
        </div>
        <div className="cnt-label text-right">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/55 dark:text-white/55">
            Kerala · IND
          </p>
          <p
            className="font-headline italic text-lg md:text-xl tabular-nums leading-none mt-1"
            aria-label={`Local time ${keralaTime} IST`}
          >
            {keralaTime || "—"}{" "}
            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-black/50 dark:text-white/50 align-middle">
              IST
            </span>
          </p>
        </div>
      </div>

      {/* Centered headline + two email buttons */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 pt-16 md:pt-24 pb-10 md:pb-14">
        <h2 className="font-headline text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tighter">
          <span className="whitespace-nowrap">
            <a
              href="https://github.com/AshishBKallada"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="cnt-word inline-flex items-center align-middle mr-[0.25em] opacity-80 hover:opacity-100 hover:text-black dark:hover:text-white transition-opacity"
            >
              <Github className="w-[0.85em] h-[0.85em]" strokeWidth={1.8} />
            </a>
            <span className="cnt-word inline-block mr-[0.18em]">Got</span>
          </span>
          <span className="cnt-word inline-block mr-[0.18em]">an</span>
          <span className="cnt-word inline-block">idea</span>
          <br />
          <span className="cnt-word inline-block mr-[0.18em]">worth</span>
          <span
            className="cnt-word inline-block"
            style={{ color: ACCENT }}
          >
            <em>shipping?</em>
          </span>
          <br />
          <span className="cnt-word inline-block mr-[0.18em]">Let&apos;s</span>
          <span className="whitespace-nowrap">
            <span className="cnt-word inline-block">talk.</span>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="cnt-word inline-flex items-center align-middle ml-[0.25em] opacity-80 hover:opacity-100 hover:text-black dark:hover:text-white transition-opacity"
            >
              <Linkedin className="w-[0.85em] h-[0.85em]" strokeWidth={1.8} />
            </a>
          </span>
        </h2>

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <div className="cnt-cta">
            <MagneticEmailButton
              ref={workRef}
              href="mailto:ashercode4u@gmail.com"
              label="work"
              value="ashercode4u@gmail.com"
            />
          </div>
          <div className="cnt-cta">
            <MagneticEmailButton
              ref={sayHiRef}
              href="mailto:ashishbkallada@gmail.com"
              label="say hi"
              value="ashishbkallada@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Bottom row — copyright */}
      <div className="relative z-10 flex items-end justify-center px-6 md:px-12 pb-8 md:pb-10">
        <p className="cnt-foot font-body text-[10px] uppercase tracking-[0.3em] text-black/65 dark:text-white/65">
          © 2026 Ashcode Web Studio
        </p>
      </div>

      {/* Back to top */}
      <button
        ref={backTopRef}
        type="button"
        onClick={scrollTop}
        aria-label="Back to top"
        className="group absolute bottom-6 right-6 md:bottom-10 md:right-12 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-black/25 dark:border-white/25 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-colors duration-300 will-change-transform"
      >
        <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </section>
  );
}
