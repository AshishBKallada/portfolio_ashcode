"use client";

import Image from "next/image";
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

      // Subtle endless drift on the hinomaru dot
      gsap.to(root.querySelectorAll(".cnt-dot"), {
        y: -4, repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full h-screen min-h-[640px] flex flex-col bg-black text-[#E1E0CC] overflow-hidden"
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

      {/* Vertical kanji column — right edge */}
      <div
        aria-hidden
        className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 flex-col items-center gap-3 font-headline text-[#E1E0CC]/25 text-lg pointer-events-none leading-none z-[5]"
      >
        <span>縁</span>
        <span className="w-px h-2.5 bg-[#E1E0CC]/15" />
        <span>道</span>
        <span className="w-px h-2.5 bg-[#E1E0CC]/15" />
        <span>繋</span>
      </div>

      {/* Decorative figure — latest image from Downloads */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden md:block w-[min(46vw,480px)] h-[min(62vh,520px)]"
      >
        <Image
          src="/contact-samurai.png"
          alt=""
          fill
          sizes="480px"
          className="object-contain object-bottom object-left opacity-85"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
          }}
        />
      </div>

      {/* ─── Top meta row ─── */}
      <div className="relative z-10 px-6 md:px-12 pt-8 md:pt-10 flex items-center justify-between">
        <div className="cnt-label flex items-center gap-2.5">
          <span className="relative flex w-1.5 h-1.5">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: ACCENT, opacity: 0.55 }}
            />
            <span
              className="relative inline-flex w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
          </span>
          <p className="font-body text-[10px] uppercase tracking-[0.32em] text-[#E1E0CC]/60">
            便り · Correspondence
          </p>
        </div>

        <p
          className="cnt-label font-body text-[10px] uppercase tracking-[0.32em] text-[#E1E0CC]/55 tabular-nums"
          aria-label={`Local time ${keralaTime} IST`}
        >
          {keralaTime || "—"} IST · Kerala
        </p>
      </div>

      {/* ─── Center — headline + indexed emails ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto w-full">
        <span
          aria-hidden
          className="cnt-dot inline-block w-2 h-2 rounded-full mb-5"
          style={{ backgroundColor: ACCENT }}
        />

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

      {/* ─── Bottom bar — copyright + socials + version ─── */}
      <div className="relative z-10 px-6 md:px-12 pb-6 md:pb-8">
        <div className="border-t border-[#E1E0CC]/10 pt-4 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-[#E1E0CC]/55">
          <p className="cnt-foot flex items-center gap-2">
            © 2026 Ashcode
            <span className="opacity-50 tracking-[0.2em]">· 令和八年</span>
          </p>

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

          <p className="cnt-foot flex items-center gap-2 text-[#E1E0CC]/45">
            <span
              className="inline-block w-1 h-1 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            v.26 · Available Q3
          </p>
        </div>
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
