"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { linkedin } from "@/data/portfolio";

// A held stage: the title stays across the top while each scroll step brings one post into
// the centre and one comment into a gutter. On a phone the stage lets go and the posts stack.
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

        {steps.map((step, i) => (
          <article
            key={step.src}
            className="kx-li__step"
            data-active={i === active}
            data-past={i < active}
            aria-label={`Post: ${step.title}`}
          >
            <figure className="kx-li__figure">
              <div className="kx-li__frame">
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 767px) 72vw, 28vw"
                  style={"fit" in step ? { objectFit: "contain" } : undefined}
                />
              </div>
              <figcaption>{step.title}</figcaption>
            </figure>
            <div className="kx-li__quote">
              <blockquote>“{step.quote}”</blockquote>
              <p>{step.name}, in the comments</p>
            </div>
          </article>
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
