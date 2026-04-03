"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !canRef.current || !captionRef.current) return;
    gsap.set(canRef.current, { transformOrigin: "50% 50%" });
    gsap.set(captionRef.current, { opacity: 0, x: 28 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#skills",
        start: "bottom 92%",
        endTrigger: sectionRef.current,
        end: "center 55%",
        scrub: 3.2,
      },
    });

    tl.fromTo(
      canRef.current,
      {
        x: -320,
        y: -340,
        rotation: -88,
        scale: 1.75,
        force3D: true,
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        ease: "sine.inOut",
        force3D: true,
      },
      0
    );

    tl.fromTo(
      captionRef.current,
      { opacity: 0, x: 28 },
      { opacity: 1, x: 0, ease: "sine.out" },
      0.58
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.killTweensOf(canRef.current);
      gsap.killTweensOf(captionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-full bg-white px-6 py-16 text-black md:px-12 md:py-20 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-center md:justify-between md:gap-6 lg:gap-10">
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <p className="font-safiro text-xs uppercase tracking-[0.2em] text-black/60">
              Contact
            </p>
            <h2 className="font-chaney text-4xl uppercase leading-none md:text-6xl">
              Have a Monster.
              <br />
              Let&apos;s Build Something.
            </h2>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
            <div
              ref={captionRef}
              className="flex items-center gap-1.5 text-right sm:gap-2"
            >
              <p className="max-w-[6.5rem] font-safiro text-[0.5rem] italic leading-snug text-black sm:max-w-[8rem] md:max-w-none md:text-[0.65rem] lg:text-xs">
                Deez are 4 cool ppl
              </p>
              <Image
                src="/arrowblack1.png"
                alt=""
                width={60}
                height={60}
                className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 md:h-[52px] md:w-[52px]"
              />
            </div>

            <div ref={canRef}>
              <Image
                src="/skills-bottom.png"
                alt="Energy can"
                width={320}
                height={320}
                className="h-auto w-[min(52vw,13rem)] object-contain md:w-[min(26vw,16rem)]"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-t border-black/15 pt-8 md:grid-cols-2">
          <a
            href="mailto:connect@ashcode.com"
            className="font-safiro text-lg transition-opacity hover:opacity-70"
          >
            connect@ashcode.com
          </a>
          <a
            href="mailto:hello@ashcode.com"
            className="font-safiro text-lg text-left transition-opacity hover:opacity-70 md:text-right"
          >
            hello@ashcode.com
          </a>
        </div>

        <div className="flex w-full justify-end">
          <div className="flex items-center gap-6">
            <h3 className="font-safiro text-right text-lg font-normal tracking-normal text-black md:text-xl">
              Projects
            </h3>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-black/30 text-center font-safiro text-[10px] uppercase tracking-[0.12em] text-black md:h-28 md:w-28 md:text-xs">
              Scroll to
              <br />
              explore
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
