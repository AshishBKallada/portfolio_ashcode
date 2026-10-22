"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Dot, SectionLabel, frame } from "@/components/signal/primitives";
import { buttonSolid } from "@/components/ui/buttonStyles";
import { Parallax } from "@/components/motion/Parallax";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { ContactClouds } from "@/components/sections/contact/ContactClouds";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { ImageTrail } from "@/components/ui/image-trail";
import { site } from "@/data/site";

const copy = site.contactStatement;
// The work trails the cursor behind the closing lines: every LinkedIn panel.
const trail = site.signal.linkedin.posts.map((post) => post.src);

const display = "font-serif text-[clamp(2.75rem,7.5vw,7rem)] leading-[0.92] tracking-[-0.035em]";

// [05] Contact: centred hairline-serif lines with a cream script word
// tucked under the last one (never across it, so both read), a short
// subline and the mail button, framed by clouds drifting in from both edges
// and a marble column leaning out of the right-hand one.
export function ContactStatement() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-36 pb-24 text-center"
    >
      <ContactClouds target={ref} />
      {/* Above the clouds, below the copy (z-10). */}
      <ImageTrail images={trail} imageWidth={220} imageHeight={165} threshold={80} className="z-[1]" />

      <div className={`${frame} absolute inset-x-0 top-16 z-10 text-left`}>
        <SectionLabel index="03">Contact</SectionLabel>
      </div>

      <h2 className="sr-only">
        {copy.lines.join(" ")} {copy.script}
      </h2>

      <div aria-hidden className="relative z-10">
        <Parallax speed={40}>
          {copy.lines.map((line, i) => (
            <SectionReveal key={line} delay={i * 0.08}>
              <p className={display}>{line}</p>
            </SectionReveal>
          ))}
        </Parallax>
        <Parallax speed={110} className="relative z-10">
          <SectionReveal
            delay={0.3}
            className="relative z-10 -mt-[0.08em] text-[clamp(3.25rem,10vw,9.5rem)]"
          >
            <p
              className="text-script -rotate-[4deg] whitespace-nowrap px-[0.25em] font-script leading-[1.1]"
            >
              {copy.script}
            </p>
          </SectionReveal>
        </Parallax>
      </div>

      <Parallax speed={20} className="relative z-10 flex flex-col items-center">
        <p className="mt-[clamp(1.5rem,4vw,3.5rem)] font-sans text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.3] tracking-[-0.015em]">
          {copy.sub[0]}
          <br />
          {copy.sub[1]}
        </p>

        <Magnetic className="mt-10">
        <a
          href={`mailto:${site.email}`}
          className={buttonSolid}
        >
          <Dot />
          {copy.cta}
        </a>
        </Magnetic>
        <div className="mt-6">
          <CopyEmail email={site.email} />
        </div>
      </Parallax>
    </section>
  );
}
