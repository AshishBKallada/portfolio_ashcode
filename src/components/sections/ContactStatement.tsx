"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { buttonSolid } from "@/components/ui/buttonStyles";
import { Parallax } from "@/components/motion/Parallax";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { ContactClouds } from "@/components/sections/contact/ContactClouds";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/data/site";

const copy = site.contactStatement;

const heavy =
  "font-sans text-[clamp(2.6rem,9vw,8.75rem)] leading-[0.86] font-bold tracking-[-0.04em] uppercase lg:text-[7vw]";

// Centered statement on navbar red: heavy cream lines with a bright red
// script word slung across the last one, a short bold subline and a small
// cream mail button, framed by clouds drifting in from both edges.
export function ContactStatement() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="contact"
      style={{ backgroundColor: site.navbar.bg }}
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20 text-center text-cream"
    >
      <ContactClouds target={ref} />

      <SectionLabel index={4} className="relative z-10 mb-8">
        Contact
      </SectionLabel>

      <h2 className="sr-only">
        {copy.lines.join(" ")} {copy.script}
      </h2>

      <div aria-hidden className="relative z-10">
        <Parallax speed={40}>
          {copy.lines.map((line, i) => (
            <SectionReveal key={line} delay={i * 0.08}>
              <p className={heavy}>{line}</p>
            </SectionReveal>
          ))}
        </Parallax>
        <Parallax speed={110} className="relative z-10">
          <SectionReveal
            delay={0.3}
            className="relative z-10 -mt-[0.42em] text-[clamp(4rem,13vw,12.5rem)]"
          >
            <p
              style={{ color: site.intro.bg }}
              className="translate-x-[9%] -rotate-[7deg] whitespace-nowrap font-script leading-[1.1]"
            >
              {copy.script}
            </p>
          </SectionReveal>
        </Parallax>
      </div>

      <Parallax speed={20} className="relative z-10 flex flex-col items-center">
        <p className="mt-[clamp(1.5rem,4vw,3.5rem)] font-sans text-[clamp(1.1rem,1.9vw,1.75rem)] leading-[1.2] font-semibold tracking-[-0.02em]">
          {copy.sub[0]}
          <br />
          {copy.sub[1]}
        </p>

        <Magnetic className="mt-10">
        <a
          href={`mailto:${site.email}`}
          className={buttonSolid}
        >
          {copy.cta} <span aria-hidden>↗</span>
        </a>
        </Magnetic>
        <div className="mt-6">
          <CopyEmail email={site.email} />
        </div>
      </Parallax>
    </section>
  );
}
