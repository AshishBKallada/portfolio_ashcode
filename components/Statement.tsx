"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SkillsModal from "@/components/SkillsModal";
import { INTRO_BADGES, INTRO_COPY } from "@/lib/constants/statement";
import { SITE } from "@/lib/constants/site";
import { useScrollReveal } from "@/lib/useScrollReveal";

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
        <div className="mx-auto max-w-7xl">
          <div className="meta-label mb-10 md:mb-12">
            <span className="opacity-60">{INTRO_COPY.metaSection}</span>
            <span className="mx-2 opacity-30">/</span>
            {INTRO_COPY.metaLabel}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14 items-start">
            {/* Badges — top left */}
            <div
              data-reveal="fade"
              className="lg:col-span-3 flex flex-wrap items-center gap-2 md:gap-2.5"
            >
              {INTRO_BADGES.map(({ label, title, className }) => (
                <span
                  key={label}
                  title={title}
                  className={`inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full font-body text-[10px] md:text-[11px] font-semibold tracking-wide ring-1 ring-ink/10 ${className}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Bio — center column */}
            <div className="lg:col-span-5 lg:col-start-4 space-y-6 md:space-y-7">
              <p
                data-reveal="fade"
                className="font-body text-sm md:text-[15px] lg:text-base leading-[1.75] text-ink/88 max-w-xl"
              >
                {INTRO_COPY.lead}
              </p>
              <p
                data-reveal="fade"
                className="font-body text-sm md:text-[15px] lg:text-base leading-[1.75] text-ink/65 max-w-xl"
              >
                {INTRO_COPY.body}
              </p>

              <div data-reveal="fade" className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-1">
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
                  className="group w-fit font-body text-sm md:text-[15px] text-ink/50 underline underline-offset-[6px] decoration-ink/25 transition-colors hover:text-ink/75 hover:decoration-ink/45"
                >
                  ↳ {INTRO_COPY.skillsCta}
                </button>
              </div>
            </div>

            {/* Portrait + experience — right column */}
            <div className="lg:col-span-4 lg:col-start-9 space-y-5 md:space-y-6">
              <div
                data-reveal="line"
                className="relative aspect-[4/5] w-full max-w-[280px] lg:max-w-none overflow-hidden rounded-[1.35rem] md:rounded-[1.75rem] bg-ink/5"
              >
                <Image
                  src={INTRO_COPY.image}
                  alt={INTRO_COPY.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 280px, 33vw"
                  className="object-cover object-center"
                />
              </div>

              <div data-reveal="fade" className="relative max-w-sm pr-6">
                <p className="font-body text-[11px] md:text-xs leading-[1.8] text-ink/55">
                  {INTRO_COPY.experience}
                </p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1 right-0 h-[calc(100%+1.5rem)] w-px bg-ink/15"
                >
                  <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rose-400/90" />
                </span>
              </div>
            </div>
          </div>

          <p
            data-reveal="fade"
            className="mt-16 md:mt-20 meta-label text-ink/35"
          >
            {SITE.brand} · {SITE.role} · {SITE.locationShort}
          </p>
        </div>
      </section>
    </>
  );
}
