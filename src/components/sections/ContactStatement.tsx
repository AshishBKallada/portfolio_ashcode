"use client";

import Image from "next/image";
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
  "font-sans text-[clamp(2.6rem,9vw,8.75rem)] leading-[0.86] font-bold tracking-[-0.04em] uppercase lg:text-[5.4vw]";

// Chapter four, "Text me": the heavy statement with its flame script word,
// the mail button and copyable address on the left, the halftone collage
// hand on the right, framed by clouds drifting in from both edges.
export function ContactStatement() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="contact"
      className="sky-band relative isolate flex min-h-svh items-center overflow-hidden px-4 pt-28 pb-20 text-ink sm:px-5"
    >
      <ContactClouds target={ref} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <SectionLabel index={4} className="mb-8">
            {site.gallery.textMe.label}
          </SectionLabel>

          <h2 className="sr-only">
            {copy.lines.join(" ")} {copy.script}
          </h2>

          <div aria-hidden>
            <Parallax speed={40}>
              {copy.lines.map((line, i) => (
                <SectionReveal key={line} delay={i * 0.08}>
                  <p className={heavy}>{line}</p>
                </SectionReveal>
              ))}
            </Parallax>
            <Parallax speed={70}>
              <SectionReveal delay={0.3} className="-mt-[0.42em] text-[clamp(4rem,11vw,10.5rem)]">
                <p className="translate-x-[9%] -rotate-[7deg] font-script leading-[1.1] whitespace-nowrap text-flame">
                  {copy.script}
                </p>
              </SectionReveal>
            </Parallax>
          </div>

          <Parallax speed={20} className="flex flex-col items-center lg:items-start">
            <p className="mt-[clamp(1.5rem,3vw,2.5rem)] font-sans text-[clamp(1.1rem,1.6vw,1.5rem)] leading-[1.25] font-semibold tracking-[-0.02em]">
              {copy.sub[0]}
              <br />
              {copy.sub[1]}
            </p>

            <Magnetic className="mt-9">
              <a href={`mailto:${site.email}`} className={buttonSolid}>
                {copy.cta} <span aria-hidden>↗</span>
              </a>
            </Magnetic>
            <CopyEmail email={site.email} className="mt-6 lg:justify-start" />
          </Parallax>
        </div>

        {/* The collage: a halftone hand mid-text, cut out and pinned at a tilt. */}
        <Parallax speed={80} className="relative mx-auto w-[min(78vw,26rem)] lg:w-full lg:max-w-[30rem]">
          <figure className="relative rotate-[4deg]">
            <Image
              src={site.gallery.textMe.image}
              alt={site.gallery.textMe.imageAlt}
              width={1152}
              height={2048}
              sizes="(min-width: 1024px) 30rem, 78vw"
              className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] select-none"
            />
            <figcaption className="absolute bottom-[14%] left-0 -rotate-[8deg] bg-paper px-3 py-2 font-serif text-[15px] leading-none text-placard italic shadow-[0_10px_24px_rgba(0,0,0,0.3)]">
              Fig. IV — <span className="font-script text-[1.35em] text-flame not-italic">reply within a day</span>
            </figcaption>
          </figure>
        </Parallax>
      </div>
    </section>
  );
}
