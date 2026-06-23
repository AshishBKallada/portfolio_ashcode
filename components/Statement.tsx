"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import SkillsModal from "@/components/SkillsModal";
import { INTRO_COPY } from "@/lib/constants/statement";
import { SITE, SOCIAL_LINKS } from "@/lib/constants/site";
import { useScrollReveal } from "@/lib/useScrollReveal";

const SOCIAL_ICONS = [
  {
    label: "Github",
    href: SOCIAL_LINKS.find((s) => s.label === "Github")?.href ?? "#",
    Icon: Github,
    newTab: true,
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.find((s) => s.label === "LinkedIn")?.href ?? "#",
    Icon: Linkedin,
    newTab: true,
  },
  {
    label: "Email",
    href: `mailto:${SITE.email}`,
    Icon: Mail,
    newTab: false,
  },
  {
    label: "Resume",
    href: SITE.resume,
    Icon: FileText,
    newTab: true,
  },
] as const;

type LenisLike = { scrollTo: (target: number | string | HTMLElement) => void };

function scrollToContact() {
  const el = document.getElementById("contact");
  if (!el) return;
  const lenis = (typeof window !== "undefined"
    ? (window as unknown as { __lenis?: LenisLike }).__lenis
    : undefined);
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [skillsOpen, setSkillsOpen] = useState(false);
  useScrollReveal(sectionRef);

  return (
    <>
      <SkillsModal open={skillsOpen} onClose={() => setSkillsOpen(false)} />
      <section
        ref={sectionRef}
        id="statement"
        className="relative z-10 bg-paper text-ink px-5 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32"
        aria-label="About"
      >
        <div className="relative w-full max-w-[1600px] mx-auto">
          {/* Focal headline */}
          <h2 className="section-title -ml-[0.04em]">
            <span data-reveal="fade" className="inline-block align-baseline mr-[0.18em]">
              {INTRO_COPY.headlineLeft}
            </span>
            <span data-reveal="fade" className="inline-block align-baseline text-ink/45">
              {INTRO_COPY.headlineRight}
            </span>
          </h2>

          {/* Body grid */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14 items-start">
            {/* Social icons + bottom credit — left column */}
            <div className="lg:col-span-3 flex flex-col gap-10">
              <div
                data-reveal="fade"
                className="flex flex-wrap items-center gap-2.5 md:gap-3"
              >
                {SOCIAL_ICONS.map(({ label, href, Icon, newTab }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target={newTab ? "_blank" : undefined}
                    rel={newTab ? "noreferrer" : undefined}
                    className="group inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-black text-white border border-black transition-[transform,background-color,color] duration-300 hover:bg-white hover:text-black hover:-translate-y-0.5"
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </a>
                ))}
              </div>

              <div data-reveal="fade" className="hidden lg:flex items-center gap-3 meta-label text-ink/45">
                <span aria-hidden className="block h-px w-8 bg-current" />
                <span>{SITE.locationShort}</span>
              </div>
            </div>

            {/* Bio — center column */}
            <div className="lg:col-span-5 lg:col-start-4 space-y-6 md:space-y-7">
              <p
                data-reveal="char"
                className="font-body text-base md:text-lg leading-relaxed text-ink/85 max-w-xl"
              >
                {INTRO_COPY.lead}
              </p>
              <p
                data-reveal="fade"
                className="font-body text-sm md:text-[15px] leading-[1.8] text-ink/60 max-w-xl"
              >
                {INTRO_COPY.body}
              </p>

              <div
                data-reveal="fade"
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2"
              >
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="group w-fit font-body text-sm md:text-[15px] text-ink underline underline-offset-[6px] decoration-ink/40 transition-colors hover:decoration-ink"
                >
                  ↳ {INTRO_COPY.cta}
                </button>
                <button
                  type="button"
                  onClick={() => setSkillsOpen(true)}
                  className="group w-fit font-body text-sm md:text-[15px] text-ink/55 underline underline-offset-[6px] decoration-ink/25 transition-colors hover:text-ink/85 hover:decoration-ink/45"
                >
                  ↳ {INTRO_COPY.skillsCta}
                </button>
              </div>
            </div>

            {/* Portrait + experience — right column */}
            <div className="lg:col-span-4 lg:col-start-9 space-y-6">
              <div
                data-reveal="line"
                className="relative aspect-[4/5] w-full max-w-[300px] lg:max-w-none overflow-hidden rounded-[1.35rem] md:rounded-[1.75rem] bg-ink/5 ring-1 ring-ink/10"
              >
                <Image
                  src={INTRO_COPY.image}
                  alt={INTRO_COPY.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 300px, 33vw"
                  className="object-cover object-center"
                />
              </div>

              <div data-reveal="fade" className="relative max-w-sm pl-5">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1 left-0 h-[calc(100%+0.5rem)] w-px bg-ink/15"
                >
                  <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/90" />
                </span>
                <p className="font-body text-[11px] md:text-xs leading-[1.85] text-ink/55">
                  {INTRO_COPY.experience}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
