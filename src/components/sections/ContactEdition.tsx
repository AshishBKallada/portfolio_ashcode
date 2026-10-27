"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealItem } from "@/components/motion/Reveal";
import { ContactClouds } from "@/components/sections/contact/ContactClouds";
import { CopyEmail } from "@/components/sections/contact/CopyEmail";
import { Dot } from "@/components/signal/primitives";
import { ImageTrail } from "@/components/ui/image-trail";
import { site } from "@/data/site";

const copy = site.contactStatement;
const trail = site.signal.linkedin.posts.map((post) => post.src);

/** John Constable, Cloud Study (c. 1821): a storm sky over a gold horizon. Public domain, via Wikimedia Commons. */
const PAINTING = { src: "/images/contact/constable-cloud-study.webp", width: 2200, height: 1677 };

/**
 * [05] Contact, Editions-style: the closing line over a full-bleed painting,
 * Constable's storm clouds rolling over a band of gold light. The painting drifts and settles
 * as the section scrolls in; a scrim deepest behind the copy holds the cream
 * text above 4.5:1 over the bright sky. The clouds and marble column drift in
 * from the edges as before, and the cursor trails recent work. The earlier
 * cream ContactStatement is kept but not shown.
 */
export function ContactEdition() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(p, [0, 1], [1.18, 1]);
  const y = useTransform(p, [0, 1], ["-6%", "0%"]);

  return (
    <section
      ref={ref}
      id="contact"
      data-nav-theme="dark"
      className="relative isolate flex min-h-[110svh] flex-col items-center justify-center overflow-hidden bg-night px-4 py-32 text-center text-cream"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { scale, y }}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PAINTING.src}
          alt=""
          width={PAINTING.width}
          height={PAINTING.height}
          loading="lazy"
          className="h-full w-full object-cover object-[50%_60%] select-none"
        />
      </motion.div>
      {/* Scrim: an even wash, deepest in an ellipse behind the copy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_52%,rgba(21,19,15,0.62),rgba(21,19,15,0.38)_70%,rgba(21,19,15,0.5)_100%)]"
      />

      {/* The clouds drifting in from both edges, the marble column leaning out of the right one. */}
      <ContactClouds target={ref} />

      <ImageTrail images={trail} imageWidth={200} imageHeight={150} threshold={90} className="z-[1]" />

      <h2 className="sr-only">
        {copy.lines.join(" ")} {copy.script}
      </h2>

      <div className="relative z-10 flex max-w-[60rem] flex-col items-center [text-shadow:0_4px_40px_rgba(0,0,0,0.45)]">
        <RevealItem>
          <p className="inline-flex items-center gap-2 font-headline text-[15px] tracking-[-0.01em] text-cream/90">
            <Dot className="animate-pulse bg-gold" />
            {site.signal.availability}
          </p>
        </RevealItem>

        <div aria-hidden className="mt-8">
          <RevealItem delay={0.06}>
            <p className="font-headline text-[clamp(3rem,7.4vw,7.25rem)] leading-[0.9] tracking-[-0.05em] text-balance">
              {copy.lines.join(" ")}
            </p>
          </RevealItem>
          <RevealItem delay={0.16}>
            <p className="mt-2 font-narrative text-[clamp(4rem,10.5vw,10rem)] leading-[0.95] tracking-[-0.045em] text-gold">
              <span className="mr-[-0.04em] font-flourish text-[1.3em] leading-none tracking-normal">
                {copy.script[0]}
              </span>
              {copy.script.slice(1)}
            </p>
          </RevealItem>
        </div>

        <RevealItem delay={0.24}>
          <p className="mt-8 max-w-[32rem] font-narrative text-[clamp(1.35rem,1.9vw,1.75rem)] leading-[1.08] tracking-[-0.03em] text-pretty text-cream/90">
            {copy.sub.join(" ")}
          </p>
        </RevealItem>

        <RevealItem delay={0.32} className="mt-10 flex flex-col items-center gap-6">
          <Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-[4px] bg-cream px-6 font-headline text-[16px] tracking-[-0.02em] text-ink [text-shadow:none] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              {copy.cta}
              <span aria-hidden>↗</span>
            </a>
          </Magnetic>
          <CopyEmail email={site.email} tone="dark" />
        </RevealItem>
      </div>

      {/* Painting credit, the way the reference credits its art. */}
      <p className="absolute inset-x-0 bottom-5 z-10 mx-auto max-w-[24rem] px-4 text-center font-narrative text-[13px] leading-[1.15] tracking-[-0.01em] text-cream/75">
        John Constable, <em>Cloud Study</em>, c. 1821. Public domain.
      </p>
    </section>
  );
}
