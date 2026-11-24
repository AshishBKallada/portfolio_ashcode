"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { hero, person } from "@/data/portfolio";
import { useMotion } from "./motion";

// The name on white, split over two lines, with a small window onto the Kallada river
// between them. Scrolling parts the name and opens the window to the whole screen.
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    const photo = el.querySelector<HTMLElement>(".kx-hero__photo")!;
    const windowEl = el.querySelector<HTMLElement>(".kx-hero__window")!;

    // The clip starts as the window's own box, measured against the stage.
    const inset = () => {
      const s = photo.getBoundingClientRect();
      const w = windowEl.getBoundingClientRect();
      return `inset(${w.top - s.top}px ${s.right - w.right}px ${s.bottom - w.bottom}px ${w.left - s.left}px)`;
    };

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      photo,
      { clipPath: inset },
      { clipPath: "inset(0px 0px 0px 0px)", duration: 1 },
      0,
    )
      .fromTo(
        photo.querySelector("img"),
        { scale: 1.35 },
        { scale: 1, duration: 1 },
        0,
      )
      .to(
        el.querySelector(".kx-hero__line--first"),
        { xPercent: -110, duration: 0.8 },
        0,
      )
      .to(
        el.querySelector(".kx-hero__line--last"),
        { xPercent: 110, duration: 0.8 },
        0,
      )
      .to(
        el.querySelectorAll(".kx-hero__bar, .kx-hero__foot"),
        { autoAlpha: 0, y: -20, duration: 0.15 },
        0,
      )
      .fromTo(
        el.querySelector(".kx-hero__caption"),
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.25 },
        0.72,
      );
  });

  return (
    <section ref={root} className="kx-hero" aria-labelledby="hero-title">
      <div className="kx-hero__stage">
        <header className="kx-hero__bar">
          <span className="kx-hero__mark">{person.wordmark}</span>
          <nav className="kx-hero__nav" aria-label="Sections">
            <a className="kx-link" href="#about">
              About
            </a>
            <a className="kx-link" href="#linkedin">
              LinkedIn
            </a>
            <a className="kx-link" href="#contact">
              Contact
            </a>
          </nav>
          <a className="kx-button kx-button--small" href={hero.action.href}>
            {hero.action.label}{" "}
            <span className="kx-button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </header>

        <div className="kx-hero__photo">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="kx-hero__curtain" aria-hidden="true" />
        </div>

        <h1
          id="hero-title"
          className="kx-hero__title kx-display"
          aria-label={`${person.full}, ${person.role}`}
        >
          <span
            className="kx-hero__line kx-hero__line--first"
            aria-hidden="true"
          >
            <span className="kx-mask">
              <span>{person.first}</span>
            </span>
          </span>
          <span
            className="kx-hero__line kx-hero__line--last"
            aria-hidden="true"
          >
            <span className="kx-mask">
              <span>{person.last}</span>
            </span>
          </span>
        </h1>

        {/* The river's window: an empty box the photograph is clipped to before the scroll opens it. */}
        <div className="kx-hero__window" aria-hidden="true" />

        <div className="kx-hero__foot">
          <p className="kx-hero__facts">
            <span>{person.role}</span>
            <span>{person.place}</span>
            <span className="kx-hero__live">{person.status}</span>
          </p>
          <p className="kx-hero__sentence">{hero.sentence}</p>
        </div>

        <p className="kx-hero__caption">
          <span className="kx-display">{hero.photo.caption}</span>
          <span>Kerala, where the work is made.</span>
        </p>
      </div>
    </section>
  );
}
