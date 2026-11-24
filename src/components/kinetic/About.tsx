"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { about, contact } from "@/data/portfolio";
import { revealParts, useMotion } from "./motion";

// "Ash" over "Code" holds the middle of the screen while four photographs of the work
// pass beneath it, alternately under its left and right halves. Then the page releases.
export function About() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    // The two words close in from either side as the section arrives, then hold.
    const [ash, code] = el.querySelectorAll<HTMLElement>(
      ".kx-about__heading .kx-mask > span",
    );
    gsap.fromTo(
      ash,
      { xPercent: -60, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 10%",
          scrub: 0.6,
        },
      },
    );
    gsap.fromTo(
      code,
      { xPercent: 60, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 10%",
          scrub: 0.6,
        },
      },
    );

    el.querySelectorAll<HTMLElement>(".kx-portrait").forEach((figure) => {
      const frame = figure.querySelector<HTMLElement>(".kx-portrait__frame")!;
      const img = frame.querySelector("img");
      // The frame opens upward once; the picture drifts inside it for as long as it is in view.
      gsap.from(frame, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: figure, start: "top 88%", once: true },
      });
      gsap.fromTo(
        img,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from(figure.querySelectorAll(".kx-portrait__caption > *"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: figure, start: "top 70%", once: true },
      });
    });

    revealParts(el);
  });

  return (
    <section
      ref={root}
      id="about"
      className="kx-about"
      aria-labelledby="about-title"
    >
      <div className="kx-about__hold">
        <div className="kx-about__pinwrap">
          <div className="kx-about__pin">
            <h2
              id="about-title"
              className="kx-about__heading kx-display"
              aria-label="About AshCode"
            >
              {about.heading.map((word) => (
                <span key={word} className="kx-mask" aria-hidden="true">
                  <span>{word}</span>
                </span>
              ))}
            </h2>
          </div>
        </div>

        <div className="kx-about__run">
          {about.portraits.map((p) => (
            <figure key={p.src} className="kx-portrait">
              <div className="kx-portrait__frame">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 767px) 72vw, (max-width: 1023px) 48vw, 32vw"
                  style={{ objectPosition: p.position }}
                />
              </div>
              <figcaption className="kx-portrait__caption">
                <h3 className="kx-portrait__title">{p.title}</h3>
                <p className="kx-portrait__role">{p.role}</p>
                <p className="kx-portrait__text">{p.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="kx-about__release">
        <div className="kx-about__intro" data-reveal-group>
          <p className="kx-about__statement" data-reveal>
            {about.statement}
          </p>
          <a className="kx-button" href={contact.action.href} data-reveal>
            {contact.action.label}{" "}
            <span className="kx-button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <div className="kx-toolkit" data-reveal-group>
          {about.toolkit.map((group) => (
            <div key={group.label} data-reveal>
              <h3>{group.label}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
