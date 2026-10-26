"use client";

import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Dot, SectionLabel, frame } from "@/components/signal/primitives";
import { buttonSolid } from "@/components/ui/buttonStyles";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { useRobot } from "@/components/sections/contact/robot/useRobot";
import { site } from "@/data/site";

const copy = site.contactStatement;
const display = "font-serif text-[clamp(2.6rem,5.4vw,5.6rem)] leading-[0.92] tracking-[-0.035em]";

/**
 * [03] Contact, with a robot that watches the pointer: the closing lines, the
 * script word, the subline and the mail button on the left; the robot on the
 * right, looking about. Phones: the robot above, the words below, centred.
 */
export function ContactRobot() {
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  useRobot(host, canvas, words, loader);

  return (
    <section ref={host} id="contact" className="relative isolate min-h-dvh overflow-hidden">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 z-0 block h-full w-full touch-pan-y" />
      <div
        ref={loader}
        aria-hidden
        className="absolute z-[2] size-[46px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-ink/15 border-t-ink transition-opacity duration-500"
      />

      <div className={`${frame} absolute inset-x-0 top-16 z-10`}>
        <SectionLabel index="03">Contact</SectionLabel>
      </div>

      <div
        className={`${frame} pointer-events-none relative z-[2] flex min-h-dvh flex-col justify-center pt-36 pb-24 max-[860px]:items-center max-[860px]:justify-end max-[860px]:pb-14 max-[860px]:text-center`}
      >
        <div ref={words} className="pointer-events-auto max-w-[36rem] px-3">
          <h2 className="sr-only">
            {copy.lines.join(" ")} {copy.script}
          </h2>
          <div aria-hidden>
            {copy.lines.map((line, i) => (
              <SectionReveal key={line} delay={i * 0.08}>
                <p className={display}>{line}</p>
              </SectionReveal>
            ))}
            <SectionReveal delay={0.3} className="-mt-[0.08em] text-[clamp(3rem,7vw,7rem)]">
              <p className="inline-block -rotate-[4deg] font-script leading-[1.1] whitespace-nowrap text-script">{copy.script}</p>
            </SectionReveal>
          </div>
          <p className="mt-6 font-sans text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.3] tracking-[-0.015em]">
            {copy.sub[0]}
            <br />
            {copy.sub[1]}
          </p>
          <Magnetic className="mt-8 inline-block">
            <a href={`mailto:${site.email}`} className={buttonSolid}>
              <Dot />
              {copy.cta}
            </a>
          </Magnetic>
          <div className="mt-6 min-[861px]:[&>div]:items-start min-[861px]:[&>div]:justify-start">
            <CopyEmail email={site.email} />
          </div>
        </div>
      </div>
    </section>
  );
}
