"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { linkedin } from "@/data/portfolio";

// A held stage: the title stays across the top and the posts run past as a strip of film,
// while each scroll step lights one frame and brings its comment in. On a phone the stage
// lets go: the tape still runs and the comments stack under it.
export function LinkedIn() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const steps = linkedin.steps;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) =>
          setActive(
            Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length),
            ),
          ),
      });
      // The title letters lift in once as the stage arrives.
      gsap.from(el.querySelectorAll(".kx-li__heading .kx-mask > span"), {
        yPercent: 105,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    });
    return () => mm.revert();
  }, [steps.length]);

  return (
    <section
      ref={root}
      id="linkedin"
      className="kx-li"
      aria-labelledby="linkedin-title"
    >
      <div
        className="kx-li__stage"
        style={{ backgroundColor: steps[active].ground }}
      >
        <h2 id="linkedin-title" className="kx-li__heading kx-display">
          <span className="kx-mask">
            <span>{linkedin.heading}</span>
          </span>
        </h2>

        {/* The posts run past as a strip of film; the frame for the current step is lit. */}
        <div className="kx-li__tape" aria-label="LinkedIn posts">
          <div className="kx-li__reel">
            {[0, 1].map((copy) =>
              steps.map((step, i) => (
                <figure
                  key={`${copy}-${step.src}`}
                  className="kx-li__frame"
                  data-active={i === active}
                  aria-hidden={copy === 1 || undefined}
                >
                  <div className="kx-li__shot">
                    <Image
                      src={step.src}
                      alt={copy === 0 ? step.alt : ""}
                      fill
                      sizes="(max-width: 767px) 52vw, 22vw"
                      style={
                        "fit" in step ? { objectFit: "contain" } : undefined
                      }
                    />
                  </div>
                  <figcaption>{step.title}</figcaption>
                </figure>
              )),
            )}
          </div>
        </div>

        {steps.map((step, i) => (
          <div
            key={step.src}
            className="kx-li__quote"
            data-active={i === active}
          >
            <blockquote>“{step.quote}”</blockquote>
            <p>
              {step.name}, in the comments on {step.title}
            </p>
          </div>
        ))}

        <div className="kx-li__aside">
          <p>{linkedin.lede}</p>
          <a
            className="kx-link"
            href={linkedin.href}
            target="_blank"
            rel="noreferrer"
          >
            {linkedin.cta} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="kx-li__count" aria-hidden="true">
          {steps.map((step, i) => (
            <span key={step.src} data-on={i === active} />
          ))}
        </div>
      </div>
    </section>
  );
}
