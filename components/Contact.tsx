"use client";

import { forwardRef } from "react";
import { ArrowUp, ArrowUpRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";
import { colors } from "@/lib/theme/colors";
import { CONTACT_COPY, CONTACT_EMAILS } from "@/lib/constants/contact";
import { SITE, SOCIAL_LINKS } from "@/lib/constants/site";

// Map social labels → lucide icon. Adding a new social? Add the label here.
const SOCIAL_ICON: Record<string, LucideIcon> = {
  Github,
  LinkedIn: Linkedin,
  Resume: FileText,
};

const ACCENT = colors.accent;

type EmailButtonProps = {
  href: string;
  label: string;
  jp: string;
  value: string;
};

// Bordered email card. On hover an accent-coloured panel sweeps in from the
// left (origin-left scale-x) while the text colour inverts to read on top of it.
// The wrapping ref is the magnetic target — that's the "displacement" pull.
const MagneticEmailButton = forwardRef<HTMLAnchorElement, EmailButtonProps>(
  ({ href, label, jp, value }, ref) => (
    <a
      ref={ref}
      href={href}
      data-cursor="cta"
      className="group relative inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 border border-ink overflow-hidden font-headline text-base md:text-xl will-change-transform"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-[500ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      />
      <Mail
        className="relative z-[1] w-5 h-5 text-ink transition-colors duration-[450ms] group-hover:text-black"
        strokeWidth={1.4}
      />
      <span className="relative z-[1] flex flex-col items-start leading-tight text-ink transition-colors duration-[450ms] group-hover:text-black">
        <span className="font-body not-italic text-[10px] uppercase tracking-[0.28em] opacity-70">
          {label} <span className="ml-1 opacity-70 tracking-[0.18em]">· {jp}</span>
        </span>
        <span className="italic tracking-[-0.01em]">{value}</span>
      </span>
      <ArrowUpRight
        className="relative z-[1] shrink-0 w-4 h-4 md:w-5 md:h-5 text-ink transition-[transform,color] duration-[450ms] group-hover:rotate-45 group-hover:text-black"
        strokeWidth={1.4}
      />
    </a>
  )
);
MagneticEmailButton.displayName = "MagneticEmailButton";

export default function Contact() {
  const workRef = useMagnetic<HTMLAnchorElement>(0.22);
  const sayHiRef = useMagnetic<HTMLAnchorElement>(0.22);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);

  const scrollTop = () => {
    if (typeof window === "undefined") return;
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (target: number) => void };
    }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttonRefs = [workRef, sayHiRef] as const;

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-paper text-ink border-t border-ink/10 overflow-hidden"
    >
      <div className="relative mx-auto max-w-6xl px-6 md:px-12 pt-24 md:pt-32 pb-8 md:pb-10 flex flex-col items-center text-center">
        {/* Focal headline */}
        <h2 className="font-headline italic tracking-[-0.04em] leading-[0.82] text-[clamp(3.25rem,13vw,11rem)]">
          {CONTACT_COPY.headline}
        </h2>

        {/* Two email buttons — magnetic + sweep-fill on hover */}
        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          {CONTACT_EMAILS.map((e, i) => (
            <MagneticEmailButton
              key={e.value}
              ref={buttonRefs[i]}
              href={e.href}
              label={e.label}
              jp={e.jp}
              value={e.value}
            />
          ))}
        </div>

        {/* Socials — small icon + label row, hover reveals accent underline */}
        <ul className="mt-12 md:mt-16 flex items-center gap-6 md:gap-10 font-body text-[11px] uppercase tracking-[0.28em] text-ink/60">
          {SOCIAL_LINKS.map(({ label, href }, i) => {
            const Icon = SOCIAL_ICON[label];
            const external = href.startsWith("http");
            return (
              <li key={label} className="flex items-center gap-6 md:gap-10">
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 hover:text-ink transition-colors duration-300"
                >
                  {Icon && <Icon className="w-4 h-4" strokeWidth={1.6} />}
                  <span className="relative">
                    {label}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
                      style={{ backgroundColor: ACCENT }}
                    />
                  </span>
                </a>
                {i < SOCIAL_LINKS.length - 1 && (
                  <span aria-hidden className="hidden sm:inline-block w-px h-3 bg-ink/20" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Bottom strip — copyright + back to top */}
        <div className="w-full mt-14 md:mt-20 pt-5 border-t border-ink/10 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.28em] text-ink/55">
          <span className="tabular-nums">
            © {SITE.copyrightYear} {SITE.brand}
          </span>
          <button
            ref={backTopRef}
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 hover:text-ink transition-colors will-change-transform"
          >
            {CONTACT_COPY.backToTop}
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current/40 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <ArrowUp className="w-3 h-3" strokeWidth={1.4} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
